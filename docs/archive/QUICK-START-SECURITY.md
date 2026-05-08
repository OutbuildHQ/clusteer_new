# Quick Start: Security Setup

**⏱️ Time Required**: 15-30 minutes
**🎯 Goal**: Secure your Clusteer platform for production deployment

---

## Step 1: Generate Secure Keys (5 minutes)

```bash
# Navigate to blockchain engine
cd Clusteer-Blockchain-Engine

# Generate all required keys at once
python3 p2p/env_validator.py --generate-keys

# Save the output to a secure file
python3 p2p/env_validator.py --generate-keys > ../secure-keys.txt

# Generate JWT secret
openssl rand -base64 64 >> ../secure-keys.txt

# View the keys (DO NOT share or commit!)
cat ../secure-keys.txt
```

---

## Step 2: Update Environment Files (10 minutes)

### Django Blockchain Engine

```bash
cd Clusteer-Blockchain-Engine

# Copy template
cp .env.example .env

# Edit with your keys
nano .env  # or use your preferred editor
```

**Required values**:
```env
DEBUG=False
DJANGO_SECRET_KEY=<paste-from-secure-keys.txt>
USE_POSTGRES=True
DB_PASSWORD=<your-strong-db-password>
CUSTODIAL_WALLET_ENCRYPTION_KEY=<paste-from-secure-keys.txt>
VAULT_WALLET_ENCRYPTION_KEY=<paste-from-secure-keys.txt>
HMAC_SECRET=<paste-from-secure-keys.txt>
ALLOWED_HOSTS=yourdomain.com,api.yourdomain.com
CORS_ALLOW_ALL=False
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

### Unified Frontend

```bash
cd ../clusteer-unified

# Copy template
cp .env.example .env.local

# Edit with your keys
nano .env.local
```

**Required values**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from-supabase-dashboard>
JWT_SECRET=<paste-jwt-secret-from-secure-keys.txt>
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

---

## Step 3: Set Up PostgreSQL (5 minutes)

```bash
# Install PostgreSQL (if not already installed)
# macOS
brew install postgresql@14
brew services start postgresql@14

# Ubuntu/Debian
sudo apt update && sudo apt install postgresql postgresql-contrib

# Create database and user
createdb clusteer_blockchain
psql -c "CREATE USER clusteer_app WITH PASSWORD 'your-secure-password';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE clusteer_blockchain TO clusteer_app;"

# Update .env with these credentials
```

---

## Step 4: Validate & Migrate (5 minutes)

```bash
cd Clusteer-Blockchain-Engine

# Validate environment
python3 p2p/env_validator.py --validate --production

# If validation passes, run Django checks
python3 manage.py check --deploy

# Run migrations
python3 manage.py migrate

# Create superuser (optional)
python3 manage.py createsuperuser
```

---

## Step 5: Generate API Keys (2 minutes)

```bash
python3 manage.py shell
```

```python
from p2p.models import APIKey

# Create API key for external clients
key = APIKey.objects.create(
    name="Production API Key",
    key=APIKey.generate_key()
)

print(f"\n{'='*60}")
print(f"API Key Created Successfully!")
print(f"{'='*60}")
print(f"Name: {key.name}")
print(f"Key: {key.key}")
print(f"\n⚠️  Save this key securely - it won't be shown again!")
print(f"{'='*60}\n")

exit()
```

---

## Step 6: Test Everything (3 minutes)

```bash
# Test Django
cd Clusteer-Blockchain-Engine
python3 manage.py runserver

# In another terminal, test the API
curl http://localhost:8000/api/health

# Test Next.js
cd ../clusteer-unified
npm run build  # Should complete without errors
npm start

# Test in browser
open http://localhost:3000
```

---

## ✅ Verification Checklist

Run these commands to verify everything is secure:

```bash
# 1. Environment validation
cd Clusteer-Blockchain-Engine
python3 p2p/env_validator.py --status

# Expected output:
# ✓ Debug Mode: Disabled
# ✓ Database: PostgreSQL
# ✓ Secret Key: Set
# ✓ Encryption: Set

# 2. Django deployment checks
python3 manage.py check --deploy

# Expected: System check identified no issues (0 silenced).

# 3. Test encryption
python3 -c "from p2p.encryption import PrivateKeyEncryptor; e = PrivateKeyEncryptor(); test = 'test123'; enc = e.encrypt(test); dec = e.decrypt(enc); print('✓ Encryption OK' if test == dec else '✗ Encryption Failed')"

# Expected: ✓ Encryption OK

# 4. Test rate limiting
cd ../clusteer-unified
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}' \
  -v 2>&1 | grep -i "x-ratelimit"

# Expected: X-RateLimit-Limit, X-RateLimit-Remaining headers
```

---

## 🔐 Secure Your Keys

```bash
# Secure the keys file (read-only for owner)
chmod 600 secure-keys.txt

# Move to a secure location (NOT in project directory)
mv secure-keys.txt ~/.clusteer-keys-BACKUP.txt

# Add reminder to .gitignore (should already be there)
echo "secure-keys.txt" >> .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

---

## 🚨 Common Issues & Fixes

### Issue 1: "Module not found: jose"

```bash
cd clusteer-unified
npm install jose
```

### Issue 2: "PostgreSQL connection failed"

```bash
# Check PostgreSQL is running
pg_isready

# If not, start it
# macOS
brew services start postgresql@14

# Ubuntu/Debian
sudo systemctl start postgresql
```

### Issue 3: "Encryption key invalid"

```bash
# Regenerate keys
cd Clusteer-Blockchain-Engine
python3 p2p/env_validator.py --generate-keys

# Copy the new CUSTODIAL_WALLET_ENCRYPTION_KEY to .env
```

### Issue 4: "ALLOWED_HOSTS validation error"

```bash
# Update .env
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,localhost

# For development only:
ALLOWED_HOSTS=localhost,127.0.0.1
DEBUG=True
```

---

## 🎉 Success!

If all checks pass, your Clusteer platform is now secured!

### Next Steps:
1. ✅ Review `SECURITY.md` for complete security guidelines
2. ✅ Check `CRITICAL-FIXES-APPLIED.md` for detailed changes
3. ✅ Set up SSL/TLS certificates for HTTPS
4. ✅ Configure monitoring and logging
5. ✅ Schedule regular security audits

---

## 📞 Need Help?

- **Documentation**: See `SECURITY.md` and `CRITICAL-FIXES-APPLIED.md`
- **Environment Issues**: Run `python3 p2p/env_validator.py --help`
- **Deployment Checks**: Run `python3 manage.py check --deploy`

---

## 🔄 Regular Maintenance

### Weekly
- Check application logs
- Review failed authentication attempts
- Monitor rate limit violations

### Monthly
- Update dependencies
- Review access logs
- Test backups

### Quarterly
- Rotate JWT secrets
- Rotate API keys
- Security audit
- Penetration testing

---

**Remember**: Security is a continuous process, not a one-time task!
