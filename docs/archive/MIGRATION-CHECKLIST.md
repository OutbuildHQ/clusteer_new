# Clusteer Migration Checklist

**Print this and check off items as you complete them.**

---

## 📋 Pre-Migration Checklist

### Prerequisites
- [ ] Java 21+ installed (`java -version`)
- [ ] Maven 3.9+ installed (`mvn -version`)
- [ ] Node.js 20+ installed (`node -version`)
- [ ] Homebrew installed (macOS) (`brew --version`)
- [ ] Git access to repository
- [ ] Supabase admin access
- [ ] Read MIGRATION-GUIDE.md completely

### Backups
- [ ] Exported Supabase data (via export script)
- [ ] Saved `.env.local` backup
- [ ] Documented current Supabase configuration
- [ ] Created git branch for migration work

---

## Week 1: Database Setup & Export

### Day 1: PostgreSQL Setup
- [ ] Ran `./scripts/quick-start-migration.sh`
  - [ ] PostgreSQL 16 installed
  - [ ] `clusteer_api` database created
  - [ ] `clusteer_admin` user created
  - [ ] `.env` file created in `Clusteer-Api/`
- [ ] Verified PostgreSQL running: `brew services list | grep postgresql`
- [ ] Tested connection: `psql -h localhost -U clusteer_admin -d clusteer_api`
- [ ] Saved database password from `.env` to password manager

### Day 2: Redis Setup (Optional but Recommended)
- [ ] Installed Redis: `brew install redis`
- [ ] Started Redis: `brew services start redis`
- [ ] Tested connection: `redis-cli ping` (should return PONG)

### Day 3: Data Export from Supabase
- [ ] Installed ts-node: `npm install -g ts-node typescript`
- [ ] Installed dependencies: `cd scripts && npm install @supabase/supabase-js dotenv`
- [ ] Ran export: `ts-node export-supabase-data.ts`
- [ ] Verified exports created in `data-exports/`:
  - [ ] users.csv exists and has data
  - [ ] transactions.csv exists and has data
  - [ ] bank_accounts.csv exists and has data
  - [ ] export-summary.json exists
- [ ] Reviewed summary: `cat data-exports/export-summary.json`
- [ ] Verified record counts match Supabase

### Day 4: Firebase Setup
- [ ] Created Firebase project at https://console.firebase.google.com/
  - Project name: _________________
  - Project ID: _________________
- [ ] Enabled Authentication → Email/Password
- [ ] Downloaded service account key (JSON file)
- [ ] Saved JSON file securely
- [ ] Enabled Firebase Storage
- [ ] Storage bucket URL: _________________

### Day 5: Spring Boot Configuration
- [ ] Opened `Clusteer-Api/.env` file
- [ ] Updated Firebase credentials:
  - [ ] FIREBASE_PROJECT_ID
  - [ ] FIREBASE_PRIVATE_KEY_ID
  - [ ] FIREBASE_PRIVATE_KEY
  - [ ] FIREBASE_CLIENT_EMAIL
  - [ ] FIREBASE_CLIENT_ID
  - [ ] FIREBASE_DATABASE_URL
  - [ ] CLOUD_STORAGE_BUCKET
- [ ] Updated email service (if using):
  - [ ] ZEPTO_API_KEY
- [ ] Saved `.env` file
- [ ] Kept `.env` backup secure

---

## Week 2: Backend Development & Data Import

### Day 6: Build Spring Boot
- [ ] Changed to Clusteer-Api directory: `cd Clusteer-Api`
- [ ] Ran clean build: `./mvnw clean install`
- [ ] Build completed successfully (no errors)
- [ ] Reviewed build output for warnings

### Day 7: Create Data Import Service
- [ ] Created `DataImportService.java` (copy from MIGRATION-GUIDE.md Phase 5)
- [ ] Created `DataImportController.java` (copy from MIGRATION-GUIDE.md Phase 5)
- [ ] Built project: `./mvnw clean install`
- [ ] No compilation errors

### Day 8: Start Spring Boot & Import Data
- [ ] Started Spring Boot: `./mvnw spring-boot:run`
- [ ] Verified startup message: "Started Clusteer in X seconds"
- [ ] Verified Tomcat running on port 8080
- [ ] Tested health: `curl http://localhost:8080/api/actuator/health`
  - Response: `{"status":"UP"}` ✓

**In another terminal:**
- [ ] Imported users:
  ```bash
  curl -X POST 'http://localhost:8080/api/admin/import/users?csvPath=/Users/saintlammy/Documents/Clusteer/Website/Clusteer\ App/clusteer-app/data-exports/users.csv'
  ```
- [ ] Response: "Users imported successfully" ✓

- [ ] Imported transactions:
  ```bash
  curl -X POST 'http://localhost:8080/api/admin/import/transactions?csvPath=/Users/saintlammy/Documents/Clusteer/Website/Clusteer\ App/clusteer-app/data-exports/transactions.csv'
  ```
- [ ] Response: "Transactions imported successfully" ✓

- [ ] Imported bank accounts:
  ```bash
  curl -X POST 'http://localhost:8080/api/admin/import/bank-accounts?csvPath=/Users/saintlammy/Documents/Clusteer/Website/Clusteer\ App/clusteer-app/data-exports/bank_accounts.csv'
  ```
- [ ] Response: "Bank accounts imported successfully" ✓

### Day 9: Verify Data Import
- [ ] Connected to database: `psql -h localhost -U clusteer_admin -d clusteer_api`
- [ ] Checked user count: `SELECT COUNT(*) FROM users;`
  - Expected: _____ (from export-summary.json)
  - Actual: _____
  - Match: ✓ / ✗
- [ ] Checked transaction count: `SELECT COUNT(*) FROM transactions;`
  - Expected: _____
  - Actual: _____
  - Match: ✓ / ✗
- [ ] Checked bank account count: `SELECT COUNT(*) FROM bank_accounts;`
  - Expected: _____
  - Actual: _____
  - Match: ✓ / ✗
- [ ] Reviewed sample data: `SELECT * FROM users LIMIT 5;`
- [ ] Verified data looks correct

### Day 10: Create Authentication Endpoints
- [ ] Created UserService.java
- [ ] Created AuthController.java with endpoints:
  - [ ] POST /api/auth/register
  - [ ] POST /api/auth/login
  - [ ] POST /api/auth/logout
  - [ ] POST /api/auth/reset-password
- [ ] Tested each endpoint with curl
- [ ] All endpoints working

---

## Week 3: Frontend Migration

### Day 11-12: Update Environment & Firebase Config
- [ ] Backed up current .env.local:
  ```bash
  cd clusteer-unified
  cp .env.local .env.local.supabase.backup
  ```
- [ ] Updated `.env.local` with new configuration:
  - [ ] Removed Supabase URLs
  - [ ] Added Firebase configuration
  - [ ] Added Spring Boot API URL
  - [ ] Added Spring Boot API key
- [ ] Updated `src/lib/firebase.ts` (code in MIGRATION-GUIDE.md)
- [ ] Created `src/lib/spring-boot-api.ts` (code in MIGRATION-GUIDE.md)
- [ ] Created `src/lib/auth-firebase.ts` (code in MIGRATION-GUIDE.md)

### Day 13-14: Migrate Authentication Routes
- [ ] Created parallel Firebase auth routes:
  - [ ] `src/app/api/auth-firebase/login/route.ts`
  - [ ] `src/app/api/auth-firebase/register/route.ts`
  - [ ] `src/app/api/auth-firebase/logout/route.ts`
- [ ] Tested new auth routes work
- [ ] Updated login page to use new routes
- [ ] Updated register page to use new routes
- [ ] Tested user can register new account
- [ ] Tested user can login
- [ ] Tested password reset

### Day 15-16: Migrate API Calls
- [ ] Replaced Supabase calls with Spring Boot calls:
  - [ ] User profile endpoints
  - [ ] Transaction endpoints
  - [ ] Bank account endpoints
  - [ ] Wallet endpoints (still use Django)
- [ ] Updated all components using Supabase client
- [ ] Removed Supabase imports
- [ ] Tested all pages load without errors

### Day 17: Testing Frontend
- [ ] Dashboard loads correctly
- [ ] User can view profile
- [ ] User can view transactions
- [ ] User can view bank accounts
- [ ] User can view wallet balances
- [ ] User can update settings
- [ ] All forms submit successfully
- [ ] No console errors

---

## Week 4: Testing & Deployment

### Day 18-19: Integration Testing
- [ ] End-to-end user registration flow
- [ ] End-to-end login flow
- [ ] Password reset flow
- [ ] Profile update flow
- [ ] Transaction creation flow
- [ ] Bank account management
- [ ] Wallet operations
- [ ] File uploads (avatar)

### Day 20: Performance Testing
- [ ] Load testing with 100 concurrent users
- [ ] Database query performance acceptable
- [ ] API response times < 200ms
- [ ] No memory leaks
- [ ] No connection pool exhaustion

### Day 21: Security Testing
- [ ] Authentication works correctly
- [ ] Authorization prevents unauthorized access
- [ ] SQL injection tests pass
- [ ] XSS protection verified
- [ ] CSRF protection verified
- [ ] Rate limiting works
- [ ] Secrets not exposed in logs

### Day 22: Staging Deployment
- [ ] Deployed to staging environment
- [ ] Smoke tests passed
- [ ] Team testing completed
- [ ] Issues documented and fixed

### Day 23-24: Production Deployment
- [ ] Production database created
- [ ] Production Redis configured
- [ ] Production environment variables set
- [ ] SSL certificates installed
- [ ] Domain DNS configured
- [ ] Deployed Spring Boot to production
- [ ] Deployed Next.js to production
- [ ] Smoke tests in production
- [ ] Monitoring configured
- [ ] Alerts configured

### Day 25-28: Monitoring & Stabilization
- [ ] Monitor error rates (should be < 0.1%)
- [ ] Monitor response times
- [ ] Monitor database performance
- [ ] Monitor memory usage
- [ ] No critical issues
- [ ] User feedback collected
- [ ] Performance optimizations applied

---

## Post-Migration

### Week 5: Supabase Deprecation
- [ ] Verified 100% of users migrated
- [ ] Verified all features working
- [ ] No rollbacks needed for 1 week
- [ ] Announced Supabase deprecation to users
- [ ] Set Supabase to read-only mode
- [ ] Stopped Supabase billing (after 2 weeks verification)

### Ongoing
- [ ] Weekly performance reviews
- [ ] Monthly security audits
- [ ] Quarterly database maintenance
- [ ] User feedback collection
- [ ] Continuous improvement

---

## 🚨 Rollback Triggers

Rollback if:
- [ ] More than 10% of users cannot login
- [ ] Data loss detected
- [ ] Critical security vulnerability found
- [ ] Performance degrades significantly (>50%)
- [ ] Database corruption
- [ ] Production downtime > 1 hour

Rollback procedure:
```bash
cd clusteer-unified
cp .env.local.supabase.backup .env.local
npm run build
# Redeploy frontend
# Point users back to Supabase
```

---

## 📝 Notes Section

Use this space for notes, issues, or observations during migration:

**Week 1 Notes:**
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________

**Week 2 Notes:**
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________

**Week 3 Notes:**
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________

**Week 4 Notes:**
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________

---

## ✅ Final Sign-Off

- [ ] All checklist items completed
- [ ] All tests passing
- [ ] Production stable for 1 week
- [ ] Team satisfied with migration
- [ ] Documentation updated
- [ ] Migration considered successful

**Migration Completed By:** _____________________
**Date:** _____________________
**Signature:** _____________________

---

**🎉 Congratulations on completing the migration!**
