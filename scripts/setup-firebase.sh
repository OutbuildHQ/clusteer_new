#!/bin/bash

# 🔥 Firebase Configuration Setup Script
# This script helps you configure Firebase for Clusteer after creating your Firebase project

set -e

echo "🔥 Firebase Configuration Setup for Clusteer"
echo "=============================================="
echo ""
echo "Before running this script, make sure you have:"
echo "1. Created a new Firebase project at https://console.firebase.google.com"
echo "2. Enabled Email/Password authentication"
echo "3. Registered a web app and copied the configuration"
echo ""
read -p "Have you completed these steps? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please complete the setup steps in SETUP-NEW-FIREBASE.md first"
    exit 1
fi

echo ""
echo "📝 Please enter your Firebase configuration values:"
echo "(You can find these in Firebase Console → Project Settings → Your apps → Web app config)"
echo ""

# Prompt for each Firebase config value
read -p "NEXT_PUBLIC_FIREBASE_API_KEY (starts with AIza...): " FIREBASE_API_KEY
read -p "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN (*.firebaseapp.com): " FIREBASE_AUTH_DOMAIN
read -p "NEXT_PUBLIC_FIREBASE_DATABASE_URL (https://*.firebaseio.com): " FIREBASE_DATABASE_URL
read -p "NEXT_PUBLIC_FIREBASE_PROJECT_ID: " FIREBASE_PROJECT_ID
read -p "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET (*.appspot.com): " FIREBASE_STORAGE_BUCKET
read -p "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: " FIREBASE_MESSAGING_SENDER_ID
read -p "NEXT_PUBLIC_FIREBASE_APP_ID (1:*:web:*): " FIREBASE_APP_ID
read -p "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID (G-*) [optional, press Enter to skip]: " FIREBASE_MEASUREMENT_ID

# Navigate to clusteer-unified directory
cd "$(dirname "$0")/../clusteer-unified" || exit 1

# Backup existing .env.local if it exists
if [ -f .env.local ]; then
    BACKUP_FILE=".env.local.backup.$(date +%Y%m%d_%H%M%S)"
    echo ""
    echo "📦 Backing up existing .env.local to $BACKUP_FILE"
    cp .env.local "$BACKUP_FILE"
fi

# Create .env.local with Firebase configuration
echo ""
echo "✍️  Writing Firebase configuration to .env.local..."
cat > .env.local << EOF
# ========================================
# Firebase Configuration (Your New Project)
# ========================================
NEXT_PUBLIC_FIREBASE_API_KEY=$FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_DATABASE_URL=$FIREBASE_DATABASE_URL
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=$FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=$FIREBASE_MEASUREMENT_ID

# ========================================
# Spring Boot API Configuration
# ========================================
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_SPRING_BOOT_API_KEY=your-secure-api-key-here

# ========================================
# Django Blockchain Engine Configuration
# ========================================
BLOCKCHAIN_ENGINE_URL=http://localhost:8000
BLOCKCHAIN_ENGINE_API_KEY=adHBFkoyv2KTENBWEAQXOqjm9GCYy0KFtt19RwURZKjnuP1M1GiePk09aapb4egG
NEXT_PUBLIC_BLOCKCHAIN_ENGINE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_BLOCKCHAIN_ENGINE_API_KEY=adHBFkoyv2KTENBWEAQXOqjm9GCYy0KFtt19RwURZKjnuP1M1GiePk09aapb4egG

# ========================================
# Application Configuration
# ========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

echo "✅ Firebase configuration written to .env.local"
echo ""
echo "🧪 Testing Firebase Configuration..."
echo ""

# Test if the configuration is valid by starting the dev server temporarily
echo "Starting dev server to verify Firebase configuration..."
npm run dev &
DEV_SERVER_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 10

# Test the registration endpoint
echo ""
echo "Testing Firebase authentication endpoint..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth-firebase/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser_$(date +%s)\",\"email\":\"test_$(date +%s)@example.com\",\"phone\":\"08012345678\",\"password\":\"TestPass123\"}")

# Kill the dev server
kill $DEV_SERVER_PID 2>/dev/null || true

echo ""
echo "Response from server:"
echo "$RESPONSE"
echo ""

# Check if the response contains "status":true or indicates Firebase is working
if echo "$RESPONSE" | grep -q '"status":true\|Firebase\|registered'; then
    echo "✅ Firebase configuration appears to be working!"
else
    echo "⚠️  Warning: The test didn't return expected response. Please verify your configuration."
    echo "You may need to:"
    echo "  1. Check that Email/Password authentication is enabled in Firebase Console"
    echo "  2. Verify all configuration values are correct"
    echo "  3. Check Firebase Console → Authentication → Users to see if test user was created"
fi

echo ""
echo "🎉 Firebase Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "  1. Start the dev server: npm run dev"
echo "  2. Test registration: curl -X POST http://localhost:3000/api/auth-firebase/register \\"
echo "       -H 'Content-Type: application/json' \\"
echo "       -d '{\"username\":\"myuser\",\"email\":\"my@email.com\",\"phone\":\"08012345678\",\"password\":\"MyPass123\"}'"
echo "  3. Check Firebase Console → Authentication → Users to verify"
echo ""
echo "📖 For more details, see SETUP-NEW-FIREBASE.md"
echo ""
