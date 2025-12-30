#!/bin/bash

# Clusteer Production Deployment Checklist
# This script validates environment and configuration before deployment

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

echo "========================================"
echo "  CLUSTEER DEPLOYMENT CHECKLIST"
echo "========================================"
echo ""

# Function to print success
success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Function to print error
error() {
    echo -e "${RED}✗${NC} $1"
    ((ERRORS++))
}

# Function to print warning
warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "=== 1. CHECKING REQUIRED TOOLS ==="
echo ""

if command_exists python3; then
    success "Python3 installed"
else
    error "Python3 not installed"
fi

if command_exists node; then
    success "Node.js installed"
else
    error "Node.js not installed"
fi

if command_exists psql; then
    success "PostgreSQL client installed"
else
    warning "PostgreSQL client not installed"
fi

if command_exists git; then
    success "Git installed"
else
    error "Git not installed"
fi

echo ""
echo "=== 2. CHECKING DJANGO CONFIGURATION ==="
echo ""

cd "$(dirname "$0")/../Clusteer-Blockchain-Engine"

# Check if .env exists
if [ -f ".env" ]; then
    success ".env file exists"

    # Source the .env file
    set -a
    source .env
    set +a

    # Check critical environment variables
    if [ ! -z "$DJANGO_SECRET_KEY" ] && [ "$DJANGO_SECRET_KEY" != "django-insecure-dev-key-change-in-production" ]; then
        success "DJANGO_SECRET_KEY is set"
    else
        error "DJANGO_SECRET_KEY not set or using default"
    fi

    if [ "$DEBUG" = "False" ] || [ "$DEBUG" = "false" ]; then
        success "DEBUG mode is disabled"
    else
        error "DEBUG mode is enabled (must be False for production)"
    fi

    if [ ! -z "$DB_PASSWORD" ]; then
        success "DB_PASSWORD is set"
    else
        error "DB_PASSWORD not set"
    fi

    if [ ! -z "$CUSTODIAL_WALLET_ENCRYPTION_KEY" ]; then
        success "CUSTODIAL_WALLET_ENCRYPTION_KEY is set"
    else
        error "CUSTODIAL_WALLET_ENCRYPTION_KEY not set"
    fi

    if [ ! -z "$VAULT_WALLET_ENCRYPTION_KEY" ]; then
        success "VAULT_WALLET_ENCRYPTION_KEY is set"
    else
        error "VAULT_WALLET_ENCRYPTION_KEY not set"
    fi

    if [ "$USE_POSTGRES" = "True" ] || [ "$USE_POSTGRES" = "true" ]; then
        success "PostgreSQL is configured"
    else
        warning "Using SQLite (not recommended for production)"
    fi

else
    error ".env file not found"
fi

# Check Django deployment readiness
echo ""
if python3 manage.py check --deploy 2>/dev/null; then
    success "Django deployment checks passed"
else
    error "Django deployment checks failed"
fi

# Validate environment
if python3 p2p/env_validator.py --validate --production 2>/dev/null; then
    success "Environment validation passed"
else
    error "Environment validation failed"
fi

echo ""
echo "=== 3. CHECKING NEXT.JS CONFIGURATION ==="
echo ""

cd "../clusteer-unified"

if [ -f ".env.local" ]; then
    success ".env.local file exists"

    # Source the .env file
    set -a
    source .env.local
    set +a

    if [ ! -z "$JWT_SECRET" ] && [ ${#JWT_SECRET} -ge 32 ]; then
        success "JWT_SECRET is set and sufficient length"
    else
        error "JWT_SECRET not set or too short (min 32 chars)"
    fi

    if [ ! -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
        success "NEXT_PUBLIC_SUPABASE_URL is set"
    else
        error "NEXT_PUBLIC_SUPABASE_URL not set"
    fi

    if [ ! -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
        success "NEXT_PUBLIC_SUPABASE_ANON_KEY is set"
    else
        error "NEXT_PUBLIC_SUPABASE_ANON_KEY not set"
    fi

    if [ "$NODE_ENV" = "production" ]; then
        success "NODE_ENV is set to production"
    else
        warning "NODE_ENV not set to production"
    fi

else
    error ".env.local file not found"
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    success "node_modules directory exists"
else
    warning "node_modules not found - run npm install"
fi

echo ""
echo "=== 4. CHECKING GIT STATUS ==="
echo ""

cd ..

# Check for uncommitted changes
if [ -z "$(git status --porcelain)" ]; then
    success "No uncommitted changes"
else
    warning "Uncommitted changes detected"
    git status --short
fi

# Check current branch
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
    success "On main/master branch"
else
    warning "Not on main/master branch (current: $BRANCH)"
fi

echo ""
echo "=== 5. SECURITY CHECKS ==="
echo ""

# Check for exposed secrets in git history
if git log --all --pretty=format: --name-only | grep -q ".env"; then
    error ".env file found in git history - SECURITY RISK!"
else
    success "No .env files in git history"
fi

# Check if .gitignore exists and contains .env
if [ -f ".gitignore" ] && grep -q ".env" ".gitignore"; then
    success ".env is in .gitignore"
else
    error ".env not found in .gitignore"
fi

echo ""
echo "=== 6. DATABASE CHECKS ==="
echo ""

cd "Clusteer-Blockchain-Engine"

# Test database connection
if python3 -c "from django.db import connection; connection.ensure_connection(); print('OK')" 2>/dev/null | grep -q "OK"; then
    success "Database connection successful"
else
    error "Cannot connect to database"
fi

# Check for pending migrations
PENDING=$(python3 manage.py showmigrations --plan | grep "\[ \]" | wc -l)
if [ $PENDING -eq 0 ]; then
    success "No pending migrations"
else
    warning "$PENDING pending migration(s)"
fi

echo ""
echo "========================================"
echo "  SUMMARY"
echo "========================================"
echo ""
echo -e "Errors:   ${RED}$ERRORS${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ Deployment checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Review SECURITY.md for final checks"
    echo "2. Test in staging environment"
    echo "3. Set up monitoring and alerting"
    echo "4. Create database backup"
    echo "5. Deploy to production"
    exit 0
else
    echo -e "${RED}✗ Deployment checks failed!${NC}"
    echo ""
    echo "Please fix the errors above before deploying."
    echo "See SECURITY.md and CRITICAL-FIXES-APPLIED.md for guidance."
    exit 1
fi
