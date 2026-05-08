# 🚀 Clusteer Migration: Supabase → Spring Boot + PostgreSQL + Firebase

## Quick Start

**The fastest way to begin the migration:**

```bash
cd /Users/saintlammy/Documents/Clusteer/Website/Clusteer\ App/clusteer-app/scripts
./quick-start-migration.sh
```

This interactive script will guide you through:
- Installing PostgreSQL
- Installing Redis
- Exporting Supabase data
- Configuring Spring Boot
- Building the application

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **MIGRATION-GUIDE.md** | Complete step-by-step migration guide (START HERE) |
| **MIGRATION-README.md** | This file - quick reference |
| **SECURITY.md** | Security considerations during migration |
| **PRODUCTION-READY-GUIDE.md** | Post-migration deployment guide |

---

## 🎯 Migration Goals

### Current State (Before)
- **Frontend:** clusteer-unified (Next.js 15)
- **Auth:** Supabase Auth
- **Database:** Supabase PostgreSQL (cloud)
- **Backend #1:** Django Blockchain Engine (wallets)
- **Backend #2:** Spring Boot API (unused ❌)

### Target State (After)
- **Frontend:** clusteer-unified (Next.js 15)
- **Auth:** Firebase Authentication ✅
- **Database:** PostgreSQL (self-hosted or RDS) ✅
- **Backend #1:** Spring Boot API (main backend) ✅
- **Backend #2:** Django Blockchain Engine (wallets only)

---

## ✅ What's Been Created

### 1. Database Setup
- [x] `scripts/setup-postgresql.sh` - Automated PostgreSQL installation
- [x] Creates `clusteer_api` database
- [x] Creates `clusteer_admin` user
- [x] Generates secure passwords and encryption keys
- [x] Creates `.env` file for Spring Boot

### 2. Data Export
- [x] `scripts/export-supabase-data.ts` - Exports all Supabase data
- [x] Exports to CSV files in `data-exports/` directory
- [x] Includes: users, transactions, bank accounts, orders, exchange rates

### 3. Spring Boot Entities
- [x] `User.java` - User entity with Firebase integration
- [x] `Transaction.java` - Transaction history
- [x] `BankAccount.java` - User bank accounts
- [x] JPA repositories for all entities
- [x] OpenCSV dependency added for data import

### 4. Scripts & Tools
- [x] `quick-start-migration.sh` - Interactive migration wizard
- [x] Data import service (documented in MIGRATION-GUIDE.md)
- [x] Migration progress tracking

---

## 📋 Prerequisites

### Required Software
- ✅ Java 21+ (`java -version`)
- ✅ Maven 3.9+ (`mvn -version`)
- ✅ Node.js 20+ (`node -version`)
- ✅ Homebrew (macOS) (`brew --version`)

### Will Be Installed
- PostgreSQL 16 (via setup script)
- Redis (optional, recommended)
- ts-node (for data export)

### Required Accounts
- Firebase account (https://console.firebase.google.com/)
- Current Supabase access (for data export)

---

## ⚡ Quick Start Steps

### 1. Run Quick Start Script
```bash
cd scripts
./quick-start-migration.sh
```

### 2. Configure Firebase
1. Create Firebase project: https://console.firebase.google.com/
2. Enable Authentication → Email/Password
3. Download service account key
4. Update `Clusteer-Api/.env` with credentials

### 3. Start Spring Boot
```bash
cd Clusteer-Api
./mvnw spring-boot:run
```

Should see:
```
Started Clusteer in X seconds
Tomcat started on port(s): 8080
```

### 4. Verify Setup
```bash
# Test database
psql -h localhost -U clusteer_admin -d clusteer_api -c "SELECT version();"

# Test Spring Boot
curl http://localhost:8080/api/actuator/health

# Expected: {"status":"UP"}
```

### 5. Import Data
```bash
# In another terminal
PROJECT_ROOT="/Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app"

# Import users
curl -X POST "http://localhost:8080/api/admin/import/users?csvPath=$PROJECT_ROOT/data-exports/users.csv"

# Import transactions
curl -X POST "http://localhost:8080/api/admin/import/transactions?csvPath=$PROJECT_ROOT/data-exports/transactions.csv"

# Import bank accounts
curl -X POST "http://localhost:8080/api/admin/import/bank-accounts?csvPath=$PROJECT_ROOT/data-exports/bank_accounts.csv"
```

### 6. Verify Import
```bash
psql -h localhost -U clusteer_admin -d clusteer_api

SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM transactions;
SELECT COUNT(*) FROM bank_accounts;

\q
```

---

## 🗂️ File Structure

```
clusteer-app/
├── MIGRATION-GUIDE.md              ← Complete guide
├── MIGRATION-README.md             ← This file
├── MIGRATION-ISSUES.md             ← Track issues (you create)
│
├── scripts/
│   ├── setup-postgresql.sh         ← PostgreSQL setup
│   ├── quick-start-migration.sh    ← Interactive wizard
│   └── export-supabase-data.ts     ← Export from Supabase
│
├── data-exports/                   ← Created by export script
│   ├── users.csv
│   ├── transactions.csv
│   ├── bank_accounts.csv
│   └── export-summary.json
│
├── Clusteer-Api/                   ← Spring Boot backend
│   ├── .env                        ← Created by setup script
│   ├── pom.xml                     ← Updated with OpenCSV
│   └── src/main/java/com/outbuild/clusteer/
│       ├── models/
│       │   ├── User.java
│       │   ├── Transaction.java
│       │   └── BankAccount.java
│       ├── repositories/
│       │   ├── UserRepository.java
│       │   ├── TransactionRepository.java
│       │   └── BankAccountRepository.java
│       └── services/
│           └── DataImportService.java  ← You'll create this
│
└── clusteer-unified/               ← Next.js frontend
    ├── .env.local.supabase.backup  ← Backup (will be created)
    └── .env.local                  ← Will be updated
```

---

## ⏱️ Timeline

### Week 1: Setup & Export
- Day 1: Run quick start, install PostgreSQL
- Day 2: Export Supabase data
- Day 3: Configure Firebase
- Day 4: Start Spring Boot, verify
- Day 5: Import data, verify

### Week 2: Backend Development
- Create data import service
- Create authentication endpoints
- Create user management endpoints
- Create transaction endpoints
- Test all endpoints

### Week 3: Frontend Migration
- Update environment variables
- Replace Supabase client with Firebase
- Update authentication flows
- Update API calls to Spring Boot
- Test all features

### Week 4: Testing & Deployment
- End-to-end testing
- Performance testing
- Security audit
- Production deployment
- Monitor and adjust

---

## 🔧 Troubleshooting

### PostgreSQL won't start
```bash
# Check status
brew services list | grep postgresql

# View logs
tail -f /opt/homebrew/var/log/postgresql@16.log

# Restart
brew services restart postgresql@16
```

### Spring Boot won't start
```bash
# Check .env file exists
ls -la Clusteer-Api/.env

# Check PostgreSQL connection
psql -h localhost -U clusteer_admin -d clusteer_api -c "SELECT 1;"

# View detailed logs
cd Clusteer-Api
./mvnw spring-boot:run --debug
```

### Data export fails
```bash
# Check Supabase credentials
cat clusteer-unified/.env.local | grep SUPABASE

# Verify Supabase access
# Go to: https://supabase.com/dashboard

# Check dependencies
cd scripts
npm list @supabase/supabase-js
```

### Firebase authentication fails
```bash
# Verify Firebase config
cat Clusteer-Api/.env | grep FIREBASE

# Test Firebase connection
# Go to: https://console.firebase.google.com/
# Check if project exists and auth is enabled
```

---

## 📞 Support

### Documentation
- Full guide: `cat MIGRATION-GUIDE.md`
- Security: `cat SECURITY.md`
- Production: `cat PRODUCTION-READY-GUIDE.md`

### Useful Commands

**Database:**
```bash
# Connect
psql -h localhost -U clusteer_admin -d clusteer_api

# Backup
pg_dump -h localhost -U clusteer_admin clusteer_api > backup.sql

# Restore
psql -h localhost -U clusteer_admin -d clusteer_api < backup.sql
```

**Spring Boot:**
```bash
# Build
./mvnw clean install

# Run
./mvnw spring-boot:run

# Run in background
nohup ./mvnw spring-boot:run > spring-boot.log 2>&1 &

# Stop
pkill -f "spring-boot:run"
```

**Health Checks:**
```bash
# PostgreSQL
pg_isready -h localhost -U clusteer_admin

# Redis
redis-cli ping

# Spring Boot
curl http://localhost:8080/api/actuator/health

# Django
curl http://localhost:8000/health/
```

---

## ⚠️ Important Notes

1. **Keep Supabase Active** - Don't delete your Supabase project until migration is 100% verified in production

2. **Password Reset Required** - Supabase password hashes cannot be exported. Users must reset passwords via Firebase after migration.

3. **Backup Everything** - Before each major step:
   ```bash
   # Backup Supabase (export data)
   ts-node export-supabase-data.ts

   # Backup PostgreSQL
   pg_dump -h localhost -U clusteer_admin clusteer_api > backup-$(date +%Y%m%d).sql

   # Backup .env files
   cp clusteer-unified/.env.local clusteer-unified/.env.local.backup
   ```

4. **Test Before Production** - Complete all testing phases before deploying to production

5. **Monitor After Deployment** - Watch logs, error rates, and performance metrics closely for the first week

---

## 📊 Progress Checklist

### Phase 1: Setup ✅
- [x] PostgreSQL setup script created
- [x] Data export script created
- [x] Spring Boot entities created
- [x] Quick start script created
- [x] Documentation written

### Phase 2: Execution (Your Turn!)
- [ ] Run PostgreSQL setup
- [ ] Export Supabase data
- [ ] Configure Firebase
- [ ] Build Spring Boot
- [ ] Import data
- [ ] Verify data integrity

### Phase 3: Development
- [ ] Create data import service
- [ ] Create authentication endpoints
- [ ] Create API endpoints
- [ ] Test Spring Boot backend

### Phase 4: Frontend
- [ ] Update environment variables
- [ ] Implement Firebase auth
- [ ] Update API clients
- [ ] Test frontend flows

### Phase 5: Production
- [ ] Deploy to staging
- [ ] Complete testing
- [ ] Deploy to production
- [ ] Monitor and optimize

---

## 🎯 Success Criteria

Migration is successful when:

- ✅ All users can login with Firebase
- ✅ All historical data is accessible
- ✅ All features work as before
- ✅ No data loss
- ✅ Performance is equal or better
- ✅ Security is maintained or improved
- ✅ Production monitoring in place
- ✅ Rollback plan tested

---

## 🚀 Ready to Start?

```bash
# Step 1: Read the guide
cat MIGRATION-GUIDE.md

# Step 2: Run quick start
cd scripts
./quick-start-migration.sh

# Step 3: Follow the guide
# Open MIGRATION-GUIDE.md and follow each phase

# Step 4: Track your progress
# Create MIGRATION-ISSUES.md to document any problems
```

**Good luck! 🎉**

You're migrating to a more robust, scalable architecture. Take your time, follow the steps, and don't hesitate to create backups at every stage.
