# CI/CD Secrets Configuration Guide

This guide explains how to configure all necessary secrets for GitHub Actions CI/CD pipeline.

## GitHub Repository Secrets

Go to your repository Settings → Secrets and variables → Actions → New repository secret

### Required Secrets

#### 1. Environment Variables (Production)

```
JWT_SECRET
```
- Generate with: `openssl rand -base64 32`
- Must be at least 32 characters
- Used for JWT token signing

```
SUPABASE_SERVICE_ROLE_KEY
```
- Get from: Supabase Dashboard → Project Settings → API
- Server-side only key (bypasses RLS)
- Never expose to client

```
BLOCKCHAIN_ENGINE_API_KEY
```
- Get from your blockchain engine backend
- Used for wallet operations

#### 2. KYC Provider

```
SMILE_IDENTITY_API_KEY
```
- Get from: https://portal.smileidentity.com
- Required for BVN/NIN verification

```
SMILE_IDENTITY_PARTNER_ID
```
- Partner ID from Smile Identity portal

**Or alternative:**

```
YOUVERIFY_API_KEY
```
- Get from: https://developers.youverify.co

#### 3. Redis (Upstash)

```
UPSTASH_REDIS_REST_URL
```
- Get from: https://console.upstash.com
- Format: https://your-redis.upstash.io

```
UPSTASH_REDIS_REST_TOKEN
```
- Redis authentication token from Upstash

```
USE_REDIS_RATE_LIMITING
```
- Set to: `true` (for production)

#### 4. Email Service (Resend)

```
RESEND_API_KEY
```
- Get from: https://resend.com/api-keys
- Format: re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

```
EMAIL_FROM
```
- Your verified sender email
- Example: noreply@clusteer.com

#### 5. Error Monitoring (Sentry)

```
NEXT_PUBLIC_SENTRY_DSN
```
- Get from: Sentry Project Settings → Client Keys (DSN)
- Format: https://xxxxx@xxxxx.ingest.sentry.io/xxxxx

```
SENTRY_AUTH_TOKEN
```
- Get from: Sentry → Settings → Auth Tokens
- Used for sourcemap uploads

```
SENTRY_ORG
```
- Your Sentry organization slug

```
SENTRY_PROJECT
```
- Your Sentry project slug

#### 6. Deployment (Vercel)

```
VERCEL_TOKEN
```
- Get from: Vercel → Account Settings → Tokens
- Create deployment token

```
VERCEL_ORG_ID
```
- Get from: Vercel Project Settings → General
- Or run: `vercel link`

```
VERCEL_PROJECT_ID
```
- Get from: Vercel Project Settings → General
- Or run: `vercel link`

#### 7. Optional: Security Scanning

```
SNYK_TOKEN
```
- Get from: https://app.snyk.io/account
- Used for vulnerability scanning
- Optional but recommended

## Environment Variables (Not Secrets)

These can be set in GitHub Actions workflow file directly:

```yaml
env:
  NODE_ENV: production
  SENTRY_ENVIRONMENT: production
  KYC_PROVIDER: smile_identity
```

## Supabase Environment Variables

Set these in Vercel/hosting platform (not GitHub):

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Get from: Supabase Dashboard → Project Settings → API

## Setting Secrets via GitHub CLI

```bash
# Install GitHub CLI
brew install gh  # macOS
# or
sudo apt install gh  # Linux

# Authenticate
gh auth login

# Set secrets
gh secret set JWT_SECRET < <(openssl rand -base64 32)
gh secret set SUPABASE_SERVICE_ROLE_KEY
gh secret set BLOCKCHAIN_ENGINE_API_KEY
gh secret set SMILE_IDENTITY_API_KEY
gh secret set SMILE_IDENTITY_PARTNER_ID
gh secret set UPSTASH_REDIS_REST_URL
gh secret set UPSTASH_REDIS_REST_TOKEN
gh secret set RESEND_API_KEY
gh secret set NEXT_PUBLIC_SENTRY_DSN
gh secret set SENTRY_AUTH_TOKEN
gh secret set SENTRY_ORG
gh secret set SENTRY_PROJECT
gh secret set VERCEL_TOKEN
gh secret set VERCEL_ORG_ID
gh secret set VERCEL_PROJECT_ID
```

## Vercel Environment Variables Setup

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all secrets for Production, Preview, and Development environments
3. Mark sensitive variables as "Sensitive" to encrypt them

Required Vercel Environment Variables:
- All secrets listed above
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL` (your production URL)
- `EMAIL_FROM`
- `EMAIL_REPLY_TO`

## Validation

### Test Secrets Locally

```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Fill in all values
# Run security audit
chmod +x scripts/security-audit.sh
./scripts/security-audit.sh

# Run build
npm run build

# Run tests
npm test
```

### Test in CI/CD

1. Push a test branch
2. Check GitHub Actions workflow status
3. Verify no secret-related errors
4. Check deployment preview

## Security Best Practices

### ✅ DO

- Rotate secrets regularly (quarterly)
- Use different secrets for development/staging/production
- Monitor secret access logs
- Use GitHub's secret scanning
- Enable required status checks
- Set up branch protection rules

### ❌ DON'T

- Commit secrets to version control
- Share secrets via Slack/email
- Use the same secrets across environments
- Give secrets overly broad permissions
- Ignore security audit warnings

## Troubleshooting

### "Secret not found" error

1. Check secret name matches exactly (case-sensitive)
2. Verify secret is set at repository level (not organization)
3. Re-add the secret if needed

### "Invalid credentials" error

1. Regenerate the API key/token
2. Update the secret in GitHub
3. Re-run the workflow

### Build fails with "environment variable not defined"

1. Check if variable is required in code
2. Add to GitHub secrets
3. Update workflow file if needed

## Support

For issues with:
- **GitHub Actions**: https://docs.github.com/actions
- **Vercel**: https://vercel.com/docs
- **Supabase**: https://supabase.com/docs
- **Upstash**: https://docs.upstash.com
- **Resend**: https://resend.com/docs
- **Sentry**: https://docs.sentry.io

## Checklist

Before going to production:

- [ ] All required secrets added to GitHub
- [ ] All required secrets added to Vercel
- [ ] Security audit passes
- [ ] Build succeeds in CI/CD
- [ ] Preview deployment works
- [ ] All API keys verified and working
- [ ] Sentry receiving events
- [ ] Email sending working
- [ ] KYC verification functional
- [ ] Rate limiting operational
- [ ] Redis connection successful

---

Last updated: 2025-01-06
