# Clusteer Migration Guide: Supabase → Spring Boot + PostgreSQL

**Migration Date:** November 26, 2025
**Estimated Duration:** 3-4 weeks
**Status:** 🚧 In Progress

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Phase 1: Database Setup](#phase-1-database-setup)
4. [Phase 2: Data Export](#phase-2-data-export)
5. [Phase 3: Spring Boot Configuration](#phase-3-spring-boot-configuration)
6. [Phase 4: Firebase Setup](#phase-4-firebase-setup)
7. [Phase 5: Data Import](#phase-5-data-import)
8. [Phase 6: Frontend Migration](#phase-6-frontend-migration)
9. [Phase 7: Testing](#phase-7-testing)
10. [Phase 8: Deployment](#phase-8-deployment)
11. [Rollback Plan](#rollback-plan)

---

## Overview

### Current Architecture (Supabase-based)
```
Frontend (clusteer-unified)
    ↓
Supabase (PostgreSQL + Auth)
    ↓
Django Blockchain Engine (Wallets)
```

### Target Architecture (Spring Boot-based)
```
Frontend (clusteer-unified)
    ↓
Spring Boot API (port 8080)
    ↓ ↓ ↓
    ↓ ↓ PostgreSQL (all data)
    ↓ ↓
    ↓ Firebase (auth + storage)
    ↓
    Django Blockchain Engine (wallets)
```

### Why Migrate?

1. ✅ **Original Design** - Returns to the intended architecture
2. ✅ **Single Database** - Eliminates data fragmentation
3. ✅ **Firebase Proven** - Better for auth + push notifications
4. ✅ **Spring Boot Ecosystem** - Robust for financial applications
5. ✅ **Full Control** - Complete ownership of infrastructure

---

## Prerequisites

### Required Software

- [ ] **Java 21** - `java -version` should show 21+
- [ ] **Maven 3.9+** - `mvn -version`
- [ ] **PostgreSQL 16** - Will be installed in Phase 1
- [ ] **Redis** - `brew install redis`
- [ ] **Node.js 20+** - For frontend
- [ ] **Firebase Account** - For authentication

### Required Access

- [ ] Supabase project admin access
- [ ] Firebase Console access
- [ ] Git repository access
- [ ] Production server access (for deployment)

---

## Phase 1: Database Setup

### Step 1: Install PostgreSQL

```bash
cd /Users/saintlammy/Documents/Clusteer/Website/Clusteer\ App/clusteer-app/scripts

# Run the automated setup script
./setup-postgresql.sh
```

**This script will:**
- Install PostgreSQL 16 via Homebrew
- Create `clusteer_api` database
- Create `clusteer_admin` user with secure password
- Generate encryption keys
- Create `.env` file in `Clusteer-Api/`

### Step 2: Verify Installation

```bash
# Check PostgreSQL is running
brew services list | grep postgresql

# Test connection
psql -h localhost -U clusteer_admin -d clusteer_api -c "SELECT version();"

# Expected output: PostgreSQL 16.x
```

### Step 3: Install Redis

```bash
# Install Redis
brew install redis

# Start Redis
brew services start redis

# Test connection
redis-cli ping
# Expected output: PONG
```

---

## Phase 2: Data Export

### Step 1: Install Dependencies

```bash
cd /Users/saintlammy/Documents/Clusteer/Website/Clusteer\ App/clusteer-app/scripts

# Install ts-node if not installed
npm install -g ts-node typescript

# Install dependencies
npm install --save-dev @types/node dotenv
```

### Step 2: Run Export Script

```bash
# Export all data from Supabase
ts-node export-supabase-data.ts
```

**This will create:**
- `data-exports/users.csv` - All user data
- `data-exports/transactions.csv` - Transaction history
- `data-exports/bank_accounts.csv` - Bank account info
- `data-exports/orders.csv` - Order history
- `data-exports/exchange_rates.csv` - Historical rates
- `data-exports/export-summary.json` - Export metadata

### Step 3: Verify Exported Data

```bash
cd data-exports

# Check record counts
wc -l *.csv

# Review summary
cat export-summary.json
```

**⚠️ IMPORTANT:** Password hashes cannot be exported from Supabase. Users will need to reset passwords after migration using Firebase Authentication.

---

## Phase 3: Spring Boot Configuration

### Step 1: Configure Environment Variables

The `.env` file was created in Phase 1. Now update it with Firebase credentials:

```bash
cd /Users/saintlammy/Documents/Clusteer/Website/Clusteer\ App/clusteer-app/Clusteer-Api

nano .env
```

**Update these sections:**

```properties
# Firebase Configuration (GET FROM FIREBASE CONSOLE)
FIREBASE_PROJECT_ID=clusteer-production
FIREBASE_PRIVATE_KEY_ID=abc123...
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMII...
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@clusteer.iam.gserviceaccount.com
# ... (complete all Firebase fields)

# Email Service (OPTIONAL)
ZEPTO_API_KEY=your-zepto-api-key
```

### Step 2: Verify Spring Boot Build

```bash
cd /Users/saintlammy/Documents/Clusteer/Website/Clusteer\ App/clusteer-app/Clusteer-Api

# Clean build
./mvnw clean install

# Should complete without errors
```

### Step 3: Start Spring Boot (First Time)

```bash
# This will create database tables automatically
./mvnw spring-boot:run

# Watch for:
# - "Started Clusteer in X seconds"
# - "Tomcat started on port(s): 8080"
# - No red error messages
```

Keep this running in a separate terminal.

---

## Phase 4: Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add Project**
3. Project Name: `Clusteer` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click **Create Project**

### Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Click **Save**

### Step 3: Get Service Account Key

1. Go to **Project Settings** (gear icon) → **Service Accounts**
2. Click **Generate New Private Key**
3. Save the JSON file as `firebase-service-account.json`
4. Extract values to `.env`:

```bash
# Extract Firebase credentials from JSON
node -e "
const fs = require('fs');
const json = JSON.parse(fs.readFileSync('firebase-service-account.json'));
console.log('FIREBASE_PROJECT_ID=' + json.project_id);
console.log('FIREBASE_PRIVATE_KEY_ID=' + json.private_key_id);
console.log('FIREBASE_PRIVATE_KEY=' + json.private_key);
console.log('FIREBASE_CLIENT_EMAIL=' + json.client_email);
console.log('FIREBASE_CLIENT_ID=' + json.client_id);
"
```

Copy output to `.env`.

### Step 4: Configure Firebase Storage

1. In Firebase Console, go to **Storage**
2. Click **Get Started**
3. Choose **Production mode** for now
4. Select a Cloud Storage location (choose closest to users)
5. Click **Done**

Your storage bucket URL: `gs://clusteer-production.appspot.com`

---

## Phase 5: Data Import

### Step 1: Create Import Service

Create: `Clusteer-Api/src/main/java/com/outbuild/clusteer/services/DataImportService.java`

```java
package com.outbuild.clusteer.services;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import com.outbuild.clusteer.models.User;
import com.outbuild.clusteer.models.Transaction;
import com.outbuild.clusteer.models.BankAccount;
import com.outbuild.clusteer.repositories.UserRepository;
import com.outbuild.clusteer.repositories.TransactionRepository;
import com.outbuild.clusteer.repositories.BankAccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.FileReader;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataImportService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final BankAccountRepository bankAccountRepository;

    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_DATE_TIME;

    @Transactional
    public void importUsers(String csvPath) throws IOException, CsvException {
        log.info("Starting user import from: {}", csvPath);

        try (CSVReader reader = new CSVReader(new FileReader(csvPath))) {
            List<String[]> rows = reader.readAll();

            // Skip header
            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);

                User user = new User();
                user.setId(row[0]); // UUID from Supabase
                user.setEmail(row[1]);
                user.setUsername(row[4]);
                user.setPhone(row[5]);
                user.setIsVerified(Boolean.parseBoolean(row[6]));
                user.setAvatarUrl(row[7]);
                user.setCreatedAt(parseDateTime(row[2]));
                user.setUpdatedAt(parseDateTime(row[3]));
                user.setEmailConfirmedAt(parseDateTime(row[2]));

                // Default password - users must reset via Firebase
                user.setPasswordHash("RESET_REQUIRED");
                user.setIsActive(true);

                userRepository.save(user);

                if (i % 100 == 0) {
                    log.info("Imported {} users", i);
                }
            }

            log.info("User import complete. Total: {}", rows.size() - 1);
        }
    }

    @Transactional
    public void importTransactions(String csvPath) throws IOException, CsvException {
        log.info("Starting transaction import from: {}", csvPath);

        try (CSVReader reader = new CSVReader(new FileReader(csvPath))) {
            List<String[]> rows = reader.readAll();

            // Parse header to get column indices
            // Adjust indices based on your actual CSV structure

            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);

                Transaction transaction = new Transaction();
                transaction.setId(row[0]);
                transaction.setUserId(row[1]);
                transaction.setType(row[2]);
                transaction.setAmount(new BigDecimal(row[3]));
                transaction.setCurrency(row[4]);
                transaction.setStatus(row[5]);
                transaction.setCreatedAt(parseDateTime(row[6]));
                // ... map other fields

                transactionRepository.save(transaction);

                if (i % 100 == 0) {
                    log.info("Imported {} transactions", i);
                }
            }

            log.info("Transaction import complete. Total: {}", rows.size() - 1);
        }
    }

    @Transactional
    public void importBankAccounts(String csvPath) throws IOException, CsvException {
        log.info("Starting bank account import from: {}", csvPath);

        try (CSVReader reader = new CSVReader(new FileReader(csvPath))) {
            List<String[]> rows = reader.readAll();

            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);

                BankAccount account = new BankAccount();
                account.setUserId(row[1]);
                account.setBankName(row[2]);
                account.setAccountNumber(row[3]); // Will be encrypted by Jasypt
                account.setAccountName(row[4]);
                account.setIsDefault(Boolean.parseBoolean(row[5]));
                account.setIsVerified(Boolean.parseBoolean(row[6]));
                account.setCreatedAt(parseDateTime(row[7]));

                bankAccountRepository.save(account);

                if (i % 100 == 0) {
                    log.info("Imported {} bank accounts", i);
                }
            }

            log.info("Bank account import complete. Total: {}", rows.size() - 1);
        }
    }

    private LocalDateTime parseDateTime(String dateStr) {
        if (dateStr == null || dateStr.isEmpty()) {
            return null;
        }
        try {
            return LocalDateTime.parse(dateStr, ISO_FORMATTER);
        } catch (Exception e) {
            log.warn("Failed to parse date: {}", dateStr);
            return null;
        }
    }
}
```

### Step 2: Create Import Controller

Create: `Clusteer-Api/src/main/java/com/outbuild/clusteer/controllers/DataImportController.java`

```java
package com.outbuild.clusteer.controllers;

import com.outbuild.clusteer.services.DataImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/import")
@RequiredArgsConstructor
public class DataImportController {

    private final DataImportService dataImportService;

    @PostMapping("/users")
    public String importUsers(@RequestParam String csvPath) {
        try {
            dataImportService.importUsers(csvPath);
            return "Users imported successfully";
        } catch (Exception e) {
            return "Import failed: " + e.getMessage();
        }
    }

    @PostMapping("/transactions")
    public String importTransactions(@RequestParam String csvPath) {
        try {
            dataImportService.importTransactions(csvPath);
            return "Transactions imported successfully";
        } catch (Exception e) {
            return "Import failed: " + e.getMessage();
        }
    }

    @PostMapping("/bank-accounts")
    public String importBankAccounts(@RequestParam String csvPath) {
        try {
            dataImportService.importBankAccounts(csvPath);
            return "Bank accounts imported successfully";
        } catch (Exception e) {
            return "Import failed: " + e.getMessage();
        }
    }
}
```

### Step 3: Run Import

```bash
# Copy CSV files to known location
cp data-exports/*.csv /tmp/

# Import users
curl -X POST "http://localhost:8080/api/admin/import/users?csvPath=/tmp/users.csv"

# Import transactions
curl -X POST "http://localhost:8080/api/admin/import/transactions?csvPath=/tmp/transactions.csv"

# Import bank accounts
curl -X POST "http://localhost:8080/api/admin/import/bank-accounts?csvPath=/tmp/bank_accounts.csv"
```

### Step 4: Verify Import

```bash
# Connect to database
psql -h localhost -U clusteer_admin -d clusteer_api

# Check record counts
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM transactions;
SELECT COUNT(*) FROM bank_accounts;

# Compare with export summary
\q
```

---

## Phase 6: Frontend Migration

### Step 1: Update Environment Variables

```bash
cd /Users/saintlammy/Documents/Clusteer/Website/Clusteer\ App/clusteer-app/clusteer-unified

# Backup current .env.local
cp .env.local .env.local.supabase.backup

# Create new .env.local
nano .env.local
```

**New .env.local:**

```properties
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=clusteer-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=clusteer-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=clusteer-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123

# Spring Boot API
NEXT_PUBLIC_API_URL=http://localhost:8080/api
SPRING_BOOT_API_KEY=<generate-secure-key>

# Django Blockchain Engine (keep as is)
BLOCKCHAIN_ENGINE_URL=http://localhost:8000
BLOCKCHAIN_ENGINE_API_KEY=adHBFkoyv2KTENBWEAQXOqjm9GCYy0KFtt19RwURZKjnuP1M1GiePk09aapb4egG
NEXT_PUBLIC_BLOCKCHAIN_ENGINE_URL=http://localhost:8000/api/v1

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 2: Install Firebase SDK

```bash
# Firebase should already be installed, but verify
npm list firebase

# If not installed:
npm install firebase
```

### Step 3: Update Firebase Config

Edit: `src/lib/firebase.ts`

```typescript
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
```

### Step 4: Create API Client

Create: `src/lib/spring-boot-api.ts`

```typescript
import axios from 'axios';
import { auth } from './firebase';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': process.env.SPRING_BOOT_API_KEY || '',
  },
});

// Add Firebase auth token to all requests
apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Step 5: Update Authentication

Create: `src/lib/auth-firebase.ts`

```typescript
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from './firebase';
import apiClient from './spring-boot-api';

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  phone: string;
}

export async function loginWithFirebase(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);

  // Fetch user profile from Spring Boot
  const { data } = await apiClient.get(`/users/${userCredential.user.uid}`);

  return {
    user: data,
    firebaseUser: userCredential.user,
    token: await userCredential.user.getIdToken(),
  };
}

export async function registerWithFirebase(data: RegisterData) {
  // Create Firebase auth user
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    data.email,
    data.password
  );

  // Create user profile in Spring Boot
  await apiClient.post('/users', {
    id: userCredential.user.uid,
    email: data.email,
    username: data.username,
    phone: data.phone,
    firebaseUid: userCredential.user.uid,
  });

  return {
    user: userCredential.user,
    token: await userCredential.user.getIdToken(),
  };
}

export async function logoutFirebase() {
  await signOut(auth);
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}
```

### Step 6: Migrate Authentication Routes

**DO NOT modify files yet.** We'll create parallel implementations first for testing.

Create: `src/app/api/auth-firebase/login/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { loginWithFirebase } from "@/lib/auth-firebase";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { status: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const { user, token } = await loginWithFirebase(email, password);

    const response = NextResponse.json({
      status: true,
      message: "Login successful",
      token,
      data: user,
    });

    // Set Firebase token as cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600, // 1 hour (Firebase tokens)
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { status: false, message: error.message || "Login failed" },
      { status: 401 }
    );
  }
}
```

---

## Phase 7: Testing

### Test Checklist

#### Database Tests
- [ ] PostgreSQL connection works
- [ ] All tables created correctly
- [ ] Data imported successfully
- [ ] Record counts match Supabase export

#### Spring Boot Tests
- [ ] Application starts without errors
- [ ] Health endpoint responds: `curl http://localhost:8080/api/actuator/health`
- [ ] User API works
- [ ] Transaction API works
- [ ] Bank account API works

#### Firebase Tests
- [ ] User can register new account
- [ ] User can login
- [ ] Password reset email sends
- [ ] Token refresh works
- [ ] File upload to Storage works

#### Frontend Tests
- [ ] Login page works
- [ ] Register page works
- [ ] Dashboard loads
- [ ] Wallet balances display
- [ ] Transactions load
- [ ] Bank accounts display
- [ ] Settings pages work

#### Integration Tests
- [ ] Frontend → Spring Boot → PostgreSQL
- [ ] Frontend → Django → Blockchain
- [ ] Spring Boot → Django (wallet creation)
- [ ] File upload → Firebase Storage
- [ ] Auth token validation

---

## Phase 8: Deployment

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Production `.env` configured
- [ ] Firebase production project setup
- [ ] PostgreSQL production database created
- [ ] Redis production instance ready
- [ ] SSL certificates installed
- [ ] Domain DNS configured
- [ ] Backup strategy implemented

### Deployment Steps

**Will be documented after testing phase completes.**

---

## Rollback Plan

### If Migration Fails

1. **Keep Supabase Active** - Don't delete Supabase project until migration is 100% verified
2. **Backup .env files** - Always keep `.env.supabase.backup`
3. **Database backups** - PostgreSQL dumps created before each import
4. **Quick rollback**:
   ```bash
   cd clusteer-unified
   cp .env.local.supabase.backup .env.local
   npm run dev
   ```

### Emergency Contacts

- Database Admin: [Your contact]
- DevOps Lead: [Your contact]
- Firebase Support: https://firebase.google.com/support

---

## Progress Tracking

### Week 1
- [ ] Phase 1: Database Setup
- [ ] Phase 2: Data Export
- [ ] Phase 3: Spring Boot Configuration

### Week 2
- [ ] Phase 4: Firebase Setup
- [ ] Phase 5: Data Import
- [ ] Initial testing

### Week 3
- [ ] Phase 6: Frontend Migration
- [ ] Phase 7: Comprehensive Testing

### Week 4
- [ ] Final testing
- [ ] Phase 8: Production Deployment
- [ ] Monitoring

---

## Next Steps

**START HERE:**

```bash
# 1. Run PostgreSQL setup
cd /Users/saintlammy/Documents/Clusteer/Website/Clusteer\ App/clusteer-app/scripts
./setup-postgresql.sh

# 2. Export Supabase data
ts-node export-supabase-data.ts

# 3. Update this guide with your specific configuration
```

**Questions? Issues?** Document them in `MIGRATION-ISSUES.md`
