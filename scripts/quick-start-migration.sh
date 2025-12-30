#!/bin/bash

# Clusteer Migration Quick Start
# This script helps you get started with the migration process

set -e

echo "======================================"
echo "Clusteer Migration Quick Start"
echo "======================================"
echo ""

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "📁 Project root: $PROJECT_ROOT"
echo ""

# Function to prompt user
prompt_continue() {
    read -p "$1 (y/n): " choice
    case "$choice" in
        y|Y ) return 0;;
        n|N ) return 1;;
        * ) echo "Invalid choice"; prompt_continue "$1";;
    esac
}

echo "This script will guide you through the migration from Supabase to Spring Boot."
echo ""
echo "⚠️  IMPORTANT: This is a major migration. Please ensure:"
echo "   1. You have backups of all data"
echo "   2. You have read MIGRATION-GUIDE.md"
echo "   3. You have 3-4 weeks for complete migration"
echo ""

if ! prompt_continue "Do you want to continue?"; then
    echo "Migration cancelled."
    exit 0
fi

echo ""
echo "======================================"
echo "Step 1: Prerequisites Check"
echo "======================================"
echo ""

# Check Java
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
    if [ "$JAVA_VERSION" -ge "21" ]; then
        echo "✓ Java $JAVA_VERSION found"
    else
        echo "❌ Java 21+ required. Found: $JAVA_VERSION"
        echo "Install: brew install openjdk@21"
        exit 1
    fi
else
    echo "❌ Java not found"
    echo "Install: brew install openjdk@21"
    exit 1
fi

# Check Maven
if command -v mvn &> /dev/null; then
    echo "✓ Maven found"
else
    echo "❌ Maven not found"
    echo "Install: brew install maven"
    exit 1
fi

# Check Node.js
if command -v node &> /dev/null; then
    echo "✓ Node.js found"
else
    echo "❌ Node.js not found"
    echo "Install: brew install node"
    exit 1
fi

echo ""
echo "======================================"
echo "Step 2: Install PostgreSQL"
echo "======================================"
echo ""

if command -v psql &> /dev/null; then
    echo "✓ PostgreSQL already installed"
    if ! prompt_continue "Do you want to recreate the database?"; then
        echo "Skipping PostgreSQL setup..."
    else
        echo "Running PostgreSQL setup..."
        bash "$SCRIPT_DIR/setup-postgresql.sh"
    fi
else
    echo "PostgreSQL not found. Installing..."
    if prompt_continue "Install PostgreSQL now?"; then
        bash "$SCRIPT_DIR/setup-postgresql.sh"
    else
        echo "Please install PostgreSQL manually and run this script again."
        exit 1
    fi
fi

echo ""
echo "======================================"
echo "Step 3: Install Redis"
echo "======================================"
echo ""

if command -v redis-cli &> /dev/null; then
    echo "✓ Redis already installed"
else
    echo "Redis not found."
    if prompt_continue "Install Redis now?"; then
        brew install redis
        brew services start redis
        echo "✓ Redis installed and started"
    else
        echo "⚠️  Redis is optional but recommended for caching"
    fi
fi

echo ""
echo "======================================"
echo "Step 4: Export Supabase Data"
echo "======================================"
echo ""

if [ -d "$PROJECT_ROOT/data-exports" ] && [ "$(ls -A $PROJECT_ROOT/data-exports)" ]; then
    echo "✓ Data exports directory exists with files"
    if ! prompt_continue "Do you want to re-export data from Supabase?"; then
        echo "Using existing exports..."
    else
        echo "Exporting data from Supabase..."
        cd "$PROJECT_ROOT/scripts"

        # Check if ts-node is available
        if ! command -v ts-node &> /dev/null; then
            echo "Installing ts-node..."
            npm install -g ts-node typescript
        fi

        # Check if Supabase client is installed
        if [ ! -d "$PROJECT_ROOT/scripts/node_modules/@supabase" ]; then
            echo "Installing dependencies..."
            npm install @supabase/supabase-js dotenv
        fi

        ts-node export-supabase-data.ts
    fi
else
    echo "No existing exports found."
    if prompt_continue "Export data from Supabase now?"; then
        mkdir -p "$PROJECT_ROOT/data-exports"
        cd "$PROJECT_ROOT/scripts"

        # Install dependencies
        if ! command -v ts-node &> /dev/null; then
            npm install -g ts-node typescript
        fi

        npm install @supabase/supabase-js dotenv
        ts-node export-supabase-data.ts
    else
        echo "⚠️  You'll need to export data later. Run:"
        echo "   cd scripts && ts-node export-supabase-data.ts"
    fi
fi

echo ""
echo "======================================"
echo "Step 5: Configure Spring Boot"
echo "======================================"
echo ""

ENV_FILE="$PROJECT_ROOT/Clusteer-Api/.env"

if [ -f "$ENV_FILE" ]; then
    echo "✓ Spring Boot .env file exists"
    echo ""
    echo "⚠️  IMPORTANT: You need to configure Firebase credentials in .env"
    echo ""
    echo "Required Firebase setup:"
    echo "1. Go to https://console.firebase.google.com/"
    echo "2. Create a new project (or use existing)"
    echo "3. Enable Authentication → Email/Password"
    echo "4. Get service account key from Project Settings"
    echo "5. Update $ENV_FILE with Firebase credentials"
    echo ""

    if prompt_continue "Open .env file now for editing?"; then
        ${EDITOR:-nano} "$ENV_FILE"
    fi
else
    echo "❌ Spring Boot .env file not found"
    echo "The setup-postgresql.sh script should have created it."
    echo "Please run: ./scripts/setup-postgresql.sh"
    exit 1
fi

echo ""
echo "======================================"
echo "Step 6: Build Spring Boot"
echo "======================================"
echo ""

cd "$PROJECT_ROOT/Clusteer-Api"

if prompt_continue "Build Spring Boot application now?"; then
    echo "Building..."
    ./mvnw clean install

    if [ $? -eq 0 ]; then
        echo "✓ Build successful"
    else
        echo "❌ Build failed. Please check errors above."
        exit 1
    fi
else
    echo "Skipping build. You can run later:"
    echo "   cd Clusteer-Api && ./mvnw clean install"
fi

echo ""
echo "======================================"
echo "✅ Quick Start Complete!"
echo "======================================"
echo ""
echo "📋 What's been done:"
echo "   ✓ PostgreSQL installed and configured"
echo "   ✓ Redis installed (if selected)"
echo "   ✓ Supabase data exported"
echo "   ✓ Spring Boot configured"
echo "   ✓ Spring Boot built (if selected)"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Configure Firebase (if not done):"
echo "   - Create Firebase project"
echo "   - Enable Email/Password authentication"
echo "   - Get service account key"
echo "   - Update Clusteer-Api/.env"
echo ""
echo "2. Start Spring Boot:"
echo "   cd Clusteer-Api"
echo "   ./mvnw spring-boot:run"
echo ""
echo "3. Import data (in another terminal):"
echo "   curl -X POST 'http://localhost:8080/api/admin/import/users?csvPath=$PROJECT_ROOT/data-exports/users.csv'"
echo ""
echo "4. Follow the complete guide:"
echo "   cat MIGRATION-GUIDE.md"
echo ""
echo "5. Test the migration:"
echo "   - Verify data imported correctly"
echo "   - Test authentication"
echo "   - Update frontend"
echo ""
echo "🔗 Helpful Links:"
echo "   Firebase Console: https://console.firebase.google.com/"
echo "   Spring Boot Actuator: http://localhost:8080/api/actuator/health"
echo "   Database: psql -h localhost -U clusteer_admin -d clusteer_api"
echo ""
echo "⚠️  Remember: Keep Supabase running until migration is 100% verified!"
echo ""
