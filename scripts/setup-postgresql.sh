#!/bin/bash

# Setup PostgreSQL for Clusteer Application
# This script installs PostgreSQL and creates the clusteer_api database

set -e  # Exit on error

echo "======================================"
echo "Clusteer PostgreSQL Setup Script"
echo "======================================"
echo ""

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "⚠️  This script is designed for macOS. For other OS, please install PostgreSQL manually."
    echo "Visit: https://www.postgresql.org/download/"
    exit 1
fi

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew is not installed. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

echo "✓ Homebrew is installed"
echo ""

# Install PostgreSQL
echo "📦 Installing PostgreSQL 16..."
if brew list postgresql@16 &> /dev/null; then
    echo "✓ PostgreSQL 16 is already installed"
else
    brew install postgresql@16
    echo "✓ PostgreSQL 16 installed successfully"
fi
echo ""

# Start PostgreSQL service
echo "🚀 Starting PostgreSQL service..."
brew services start postgresql@16
sleep 3  # Wait for service to start
echo "✓ PostgreSQL service started"
echo ""

# Add PostgreSQL to PATH for current session
export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
for i in {1..10}; do
    if psql postgres -c "SELECT 1" &> /dev/null; then
        echo "✓ PostgreSQL is ready"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "❌ PostgreSQL failed to start. Please check the logs."
        exit 1
    fi
    sleep 2
done
echo ""

# Generate secure password
DB_PASSWORD=$(openssl rand -base64 24 | tr -d "=+/" | cut -c1-24)

# Create database and user
echo "🗄️  Creating database and user..."

psql postgres <<EOF
-- Drop database if exists (for fresh start)
DROP DATABASE IF EXISTS clusteer_api;
DROP USER IF EXISTS clusteer_admin;

-- Create user
CREATE USER clusteer_admin WITH PASSWORD '$DB_PASSWORD';

-- Create database
CREATE DATABASE clusteer_api WITH OWNER clusteer_admin;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE clusteer_api TO clusteer_admin;

-- Connect to database and grant schema privileges
\c clusteer_api
GRANT ALL ON SCHEMA public TO clusteer_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO clusteer_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO clusteer_admin;
EOF

echo "✓ Database 'clusteer_api' created"
echo "✓ User 'clusteer_admin' created"
echo ""

# Test connection
echo "🔍 Testing database connection..."
if PGPASSWORD=$DB_PASSWORD psql -h localhost -U clusteer_admin -d clusteer_api -c "SELECT 1" &> /dev/null; then
    echo "✓ Database connection successful"
else
    echo "❌ Database connection failed"
    exit 1
fi
echo ""

# Save credentials to .env file
ENV_FILE="../Clusteer-Api/.env"

echo "💾 Saving database credentials to $ENV_FILE..."

# Generate encryption key
ENCRYPTION_KEY=$(openssl rand -base64 32)

# Generate API keys
BLOCKCHAIN_API_KEY=$(openssl rand -base64 48 | tr -d "=+/" | cut -c1-64)

cat > "$ENV_FILE" <<EOF
# PostgreSQL Database
POSTGRESQL_URL=jdbc:postgresql://localhost:5432/clusteer_api
POSTGRESQL_USER=clusteer_admin
POSTGRESQL_PASSWORD=$DB_PASSWORD

# Encryption
COLUMN_ENCRYPTION_ALGORITHM=PBEWithMD5AndDES
COLUMN_ENCRYPTION_KEY=$ENCRYPTION_KEY

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Firebase Configuration (UPDATE THESE WITH YOUR FIREBASE CREDENTIALS)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT=your-cert-url
FIREBASE_TYPE=service_account
FIREBASE_UNIVERSE_DOMAIN=googleapis.com
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
CLOUD_STORAGE_BUCKET=your-project.appspot.com

# Google Maps (Optional)
GOOGLE_API_KEY=your-google-maps-api-key

# Email Service (Optional - UPDATE WITH YOUR ZEPTO CREDENTIALS)
ZEPTO_API_KEY=your-zepto-mail-api-key

# Blockchain Engine
BLOCKCHAIN_BASE_URL=http://localhost:8000
BLOCKCHAIN_EX_API_KEY=$BLOCKCHAIN_API_KEY
BLOCKCHAIN_IN_API_KEY=$BLOCKCHAIN_API_KEY

# Application URLs
ADMIN_BASE_URL=http://localhost:3000
USER_BASE_URL=http://localhost:3000
EOF

echo "✓ Credentials saved to $ENV_FILE"
echo ""

# Update .zshrc or .bash_profile to add PostgreSQL to PATH
SHELL_RC="$HOME/.zshrc"
if [ ! -f "$SHELL_RC" ]; then
    SHELL_RC="$HOME/.bash_profile"
fi

if ! grep -q "postgresql@16/bin" "$SHELL_RC" 2>/dev/null; then
    echo "" >> "$SHELL_RC"
    echo "# PostgreSQL 16" >> "$SHELL_RC"
    echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> "$SHELL_RC"
    echo "✓ Added PostgreSQL to $SHELL_RC"
fi

echo ""
echo "======================================"
echo "✅ PostgreSQL Setup Complete!"
echo "======================================"
echo ""
echo "📋 Database Information:"
echo "   Database: clusteer_api"
echo "   User: clusteer_admin"
echo "   Host: localhost"
echo "   Port: 5432"
echo ""
echo "🔐 Credentials saved to: $ENV_FILE"
echo ""
echo "⚠️  IMPORTANT NEXT STEPS:"
echo "1. Update Firebase credentials in $ENV_FILE"
echo "2. Restart your terminal or run: source $SHELL_RC"
echo "3. Install Redis: brew install redis && brew services start redis"
echo "4. Proceed to Spring Boot setup"
echo ""
echo "🔧 Useful Commands:"
echo "   Connect to database: psql -h localhost -U clusteer_admin -d clusteer_api"
echo "   Check status: brew services list | grep postgresql"
echo "   Stop service: brew services stop postgresql@16"
echo ""
