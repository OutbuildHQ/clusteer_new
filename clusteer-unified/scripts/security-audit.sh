#!/bin/bash
# Clusteer Security Audit Script
# Runs comprehensive security checks before deployment

set -e

echo "========================================="
echo "Clusteer Security Audit"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track issues
CRITICAL_ISSUES=0
HIGH_ISSUES=0
MEDIUM_ISSUES=0

# Function to report issue
report_issue() {
    local severity=$1
    local message=$2

    case $severity in
        CRITICAL)
            echo -e "${RED}[CRITICAL]${NC} $message"
            ((CRITICAL_ISSUES++))
            ;;
        HIGH)
            echo -e "${RED}[HIGH]${NC} $message"
            ((HIGH_ISSUES++))
            ;;
        MEDIUM)
            echo -e "${YELLOW}[MEDIUM]${NC} $message"
            ((MEDIUM_ISSUES++))
            ;;
        *)
            echo -e "${GREEN}[PASS]${NC} $message"
            ;;
    esac
}

# 1. Check environment variables
echo "1. Checking environment variables..."
if [ -f .env.local ]; then
    if grep -q "JWT_SECRET=your-secure" .env.local; then
        report_issue "CRITICAL" "Default JWT_SECRET detected in .env.local"
    else
        report_issue "PASS" "JWT_SECRET is configured"
    fi

    if grep -q "SUPABASE_SERVICE_ROLE_KEY=your-" .env.local; then
        report_issue "CRITICAL" "Default Supabase service key detected"
    else
        report_issue "PASS" "Supabase credentials configured"
    fi
else
    report_issue "HIGH" ".env.local file not found"
fi
echo ""

# 2. Check for secrets in code
echo "2. Scanning for hardcoded secrets..."
if grep -r "sk_live_" src/ 2>/dev/null; then
    report_issue "CRITICAL" "Live API keys found in source code"
else
    report_issue "PASS" "No live API keys in source code"
fi

if grep -r "password.*=.*[\"'][^$]" src/ 2>/dev/null; then
    report_issue "HIGH" "Potential hardcoded passwords found"
else
    report_issue "PASS" "No hardcoded passwords detected"
fi
echo ""

# 3. Dependency vulnerabilities
echo "3. Checking for dependency vulnerabilities..."
if command -v npm &> /dev/null; then
    if npm audit --audit-level=high | grep -q "found.*vulnerabilities"; then
        report_issue "HIGH" "High severity npm vulnerabilities found"
    else
        report_issue "PASS" "No high severity vulnerabilities"
    fi
else
    report_issue "MEDIUM" "npm not found, skipping dependency check"
fi
echo ""

# 4. Check security headers
echo "4. Checking security headers configuration..."
if grep -q "X-Frame-Options" next.config.ts; then
    report_issue "PASS" "Security headers configured"
else
    report_issue "MEDIUM" "Security headers not configured in next.config.ts"
fi
echo ""

# 5. Check authentication implementation
echo "5. Checking authentication implementation..."
if grep -rq "process.env.JWT_SECRET || 'default'" src/; then
    report_issue "CRITICAL" "Default JWT secret fallback detected"
else
    report_issue "PASS" "No JWT secret fallbacks"
fi

if grep -rq "httpOnly.*true" src/; then
    report_issue "PASS" "HTTP-only cookies implemented"
else
    report_issue "HIGH" "HTTP-only cookies not configured"
fi
echo ""

# 6. Check for private key transmission
echo "6. Checking for private key transmission..."
if grep -rq "privateKey.*:" src/app/api/; then
    report_issue "CRITICAL" "Private key transmission detected in API routes"
else
    report_issue "PASS" "No private key transmission"
fi
echo ""

# 7. Check rate limiting
echo "7. Checking rate limiting implementation..."
if [ -f src/lib/rate-limiter.ts ] || [ -f src/lib/redis-rate-limiter.ts ]; then
    report_issue "PASS" "Rate limiting implemented"
else
    report_issue "HIGH" "Rate limiting not implemented"
fi
echo ""

# 8. Check for console.logs in production
echo "8. Checking for console.log statements..."
CONSOLE_LOGS=$(grep -r "console.log" src/ | wc -l)
if [ "$CONSOLE_LOGS" -gt 50 ]; then
    report_issue "MEDIUM" "Many console.log statements found ($CONSOLE_LOGS). Consider using proper logging."
else
    report_issue "PASS" "Console logging under control"
fi
echo ""

# 9. Check TypeScript strictness
echo "9. Checking TypeScript configuration..."
if grep -q '"strict": true' tsconfig.json; then
    report_issue "PASS" "TypeScript strict mode enabled"
else
    report_issue "MEDIUM" "TypeScript strict mode not enabled"
fi
echo ""

# 10. Check for sensitive file exposure
echo "10. Checking for sensitive file exposure..."
if [ -f .env ] || [ -f .env.production ]; then
    report_issue "CRITICAL" "Environment files should not be in repository"
else
    report_issue "PASS" "No environment files in repository"
fi

if grep -q "\.env" .gitignore; then
    report_issue "PASS" ".env files in .gitignore"
else
    report_issue "HIGH" ".env files not in .gitignore"
fi
echo ""

# Summary
echo "========================================="
echo "Audit Summary"
echo "========================================="
echo -e "Critical Issues: ${RED}$CRITICAL_ISSUES${NC}"
echo -e "High Issues: ${RED}$HIGH_ISSUES${NC}"
echo -e "Medium Issues: ${YELLOW}$MEDIUM_ISSUES${NC}"
echo ""

# Exit code based on severity
if [ $CRITICAL_ISSUES -gt 0 ]; then
    echo -e "${RED}AUDIT FAILED: Critical issues must be resolved before deployment${NC}"
    exit 1
elif [ $HIGH_ISSUES -gt 0 ]; then
    echo -e "${YELLOW}WARNING: High severity issues found. Review before deployment.${NC}"
    exit 1
elif [ $MEDIUM_ISSUES -gt 0 ]; then
    echo -e "${YELLOW}WARNING: Medium severity issues found. Consider fixing.${NC}"
    exit 0
else
    echo -e "${GREEN}✓ Security audit passed!${NC}"
    exit 0
fi
