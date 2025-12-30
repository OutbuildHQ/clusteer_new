# Security Guide for Clusteer Platform

## ⚠️ CRITICAL: Before Deployment

This document outlines critical security measures implemented and required actions before deploying to production.

---

## 🔴 IMMEDIATE ACTIONS REQUIRED

### 1. Rotate All Secrets and Credentials

**All exposed secrets must be rotated immediately:**

#### Django Blockchain Engine
```bash
# Generate new Django secret key
python3 Clusteer-Blockchain-Engine/p2p/env_validator.py --generate-keys

# Update .env file with generated keys
```

Required environment variables:
- `DJANGO_SECRET_KEY` - 50+ character random string
- `CUSTODIAL_WALLET_ENCRYPTION_KEY` - Base64 encoded 32-byte key
- `VAULT_WALLET_ENCRYPTION_KEY` - Base64 encoded 32-byte key
- `HMAC_SECRET` - Base64 encoded 32-byte key
- `DB_PASSWORD` - Strong database password

#### Unified Frontend (Next.js + Supabase)
```bash
# Generate JWT secret
openssl rand -base64 64
```

Update `clusteer-unified/.env.local`:
- `JWT_SECRET` - 64+ character random string
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Get new key from Supabase dashboard
- Rotate Supabase project if keys were exposed

#### Java API
Update `Clusteer-Api/.env`:
- `POSTGRESQL_PASSWORD` - Strong database password
- `COLUMN_ENCRYPTION_KEY` - Secure encryption key
- `REDIS_PASSWORD` - Redis authentication password
- All Firebase credentials (if exposed)

### 2. Database Security

#### PostgreSQL Configuration
```bash
# Ensure PostgreSQL is configured for production
USE_POSTGRES=True
DB_HOST=your-secure-db-host
DB_USER=clusteer_app_user  # NOT postgres or root
DB_PASSWORD=<strong-password-32+chars>
DB_NAME=clusteer_production
```

**DO NOT use SQLite in production!**

#### Enable SSL/TLS for database connections
```python
# In Django settings
DATABASES = {
    'default': {
        'OPTIONS': {
            'sslmode': 'require',
        }
    }
}
```

### 3. Blockchain Wallet Security

#### Private Key Encryption

All private keys MUST be encrypted before storage:

```python
from p2p.encryption import PrivateKeyEncryptor

# Encrypt before saving
encryptor = PrivateKeyEncryptor()
encrypted_key = encryptor.encrypt(private_key)

# Save encrypted_key to database
wallet.private_key = encrypted_key
wallet.save()

# Decrypt when needed
decrypted_key = encryptor.decrypt(wallet.private_key)
```

**Never log or expose private keys!**

#### Generate Strong Encryption Keys
```bash
# Generate 256-bit encryption keys
openssl rand -base64 32
```

### 4. Security Headers & HTTPS

#### Enforce HTTPS in Production
```bash
# Django settings
DEBUG=False
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

#### Configure Reverse Proxy (Nginx example)
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### 5. CORS Configuration

#### Restrict CORS to Specific Origins
```bash
# Django .env
CORS_ALLOW_ALL=False
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Next.js
# Configure in next.config.ts
```

**NEVER use `CORS_ALLOW_ALL_ORIGINS=True` in production!**

### 6. Rate Limiting

Rate limiting is implemented for authentication endpoints:

- **Login**: 5 attempts per 15 minutes
- **Register**: 3 attempts per hour
- **OTP Verification**: 5 attempts per 15 minutes
- **Password Reset**: 3 attempts per hour

For production, consider Redis-based rate limiting:
```bash
pip install django-ratelimit
```

---

## 🔒 Security Features Implemented

### Authentication & Authorization

#### JWT Token Validation
- ✅ Proper JWT signature verification in middleware
- ✅ Token expiration checking
- ✅ Automatic token refresh on expiry
- ✅ HttpOnly cookies for token storage

#### Password Security
- ✅ Django password validators (min length, complexity)
- ✅ Bcrypt hashing for passwords
- ✅ No plain-text password storage

#### API Key Authentication
```python
# Django REST Framework
X-API-KEY: your-api-key-here
```

### Encryption

#### Private Key Storage
- ✅ AES-256-GCM encryption
- ✅ Unique nonce per encryption
- ✅ Authenticated encryption (prevents tampering)
- ✅ Separate keys for custodial and vault wallets

#### Database Encryption
- Configure at database level (PostgreSQL)
- Use encrypted filesystems for SQLite (dev only)

### Session Security
- ✅ HttpOnly cookies
- ✅ Secure flag in production
- ✅ SameSite=Strict
- ✅ Short session lifetime (1 hour default)

---

## 🛡️ Security Checklist

### Before Production Deployment

- [ ] All secrets rotated and stored securely
- [ ] PostgreSQL configured with SSL
- [ ] Private key encryption verified
- [ ] HTTPS/TLS certificates installed
- [ ] Security headers configured
- [ ] CORS restricted to specific domains
- [ ] Rate limiting tested
- [ ] Environment variables validated
- [ ] DEBUG mode disabled
- [ ] Logging configured (no sensitive data)
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting set up
- [ ] Security audit completed
- [ ] Penetration testing performed

### Environment Validation

Run validation before deployment:
```bash
# Django
python manage.py check --deploy
python p2p/env_validator.py --validate --production

# Next.js
npm run build  # Checks for build-time errors
```

### Database Backups

Set up automated backups:
```bash
# PostgreSQL backup
pg_dump -h localhost -U clusteer_user clusteer_production > backup.sql

# Automate with cron
0 2 * * * /path/to/backup-script.sh
```

### Monitoring & Logging

#### Required Monitoring
- Failed authentication attempts
- Rate limit violations
- Database connection errors
- Blockchain transaction failures
- API endpoint errors

#### Log Security Events
```python
import logging

security_logger = logging.getLogger('security')
security_logger.warning(f'Failed login attempt for {email} from {ip}')
```

**⚠️ Never log:**
- Passwords
- Private keys
- API keys
- Session tokens
- PII without encryption

---

## 🔐 Key Management Best Practices

### Secret Storage

#### Development
- Use `.env` files (never commit to git)
- `.env` files are in `.gitignore`

#### Production
Use a secrets management service:
- AWS Secrets Manager
- HashiCorp Vault
- Azure Key Vault
- Google Secret Manager

Example with AWS Secrets Manager:
```python
import boto3

def get_secret(secret_name):
    client = boto3.client('secretsmanager')
    response = client.get_secret_value(SecretId=secret_name)
    return response['SecretString']

SECRET_KEY = get_secret('django-secret-key')
```

### Key Rotation Policy

Rotate keys regularly:
- **Django SECRET_KEY**: Every 90 days
- **JWT secrets**: Every 90 days
- **Encryption keys**: Every 180 days (requires re-encryption)
- **API keys**: Every 90 days
- **Database passwords**: Every 180 days

---

## 🚨 Incident Response

### If Keys Are Compromised

1. **Immediate Actions**
   - Rotate all affected keys immediately
   - Revoke all active sessions
   - Force all users to re-authenticate
   - Review access logs for suspicious activity

2. **Investigation**
   - Identify scope of exposure
   - Check for unauthorized access
   - Review transaction history
   - Audit system logs

3. **Communication**
   - Notify affected users if PII exposed
   - Document the incident
   - Implement additional safeguards

### Security Contacts

- **Security Issues**: security@yourdomain.com
- **Bug Bounty**: bugbounty@yourdomain.com

---

## 📋 Security Audit Log

| Date | Action | Status |
|------|--------|--------|
| 2025-10-24 | Initial security review | ✅ Complete |
| 2025-10-24 | Django settings hardened | ✅ Complete |
| 2025-10-24 | JWT validation implemented | ✅ Complete |
| 2025-10-24 | Rate limiting added | ✅ Complete |
| 2025-10-24 | Encryption utilities created | ✅ Complete |
| 2025-10-24 | .env.example files created | ✅ Complete |
| TBD | PostgreSQL migration | ⏳ Pending |
| TBD | Production key rotation | ⏳ Pending |
| TBD | Security penetration test | ⏳ Pending |

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Django Security](https://docs.djangoproject.com/en/stable/topics/security/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [NIST Cryptography Standards](https://csrc.nist.gov/)

---

## ⚡ Quick Start Security Setup

```bash
# 1. Generate secure keys
cd Clusteer-Blockchain-Engine
python p2p/env_validator.py --generate-keys > secure-keys.txt

# 2. Update .env files (use .env.example as template)
cp .env.example .env
# Edit .env with generated keys

# 3. Validate environment
python p2p/env_validator.py --validate --production

# 4. Check Django deployment readiness
python manage.py check --deploy

# 5. Run migrations with PostgreSQL
python manage.py migrate

# 6. Create API keys
python manage.py shell
>>> from p2p.models import APIKey
>>> key = APIKey.objects.create(name="Production API", key=APIKey.generate_key())
>>> print(f"API Key: {key.key}")
```

---

**Remember: Security is not a one-time task. Continuously monitor, audit, and improve your security posture.**
