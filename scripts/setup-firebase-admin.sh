#!/bin/bash

# Firebase Admin SDK Setup Script
# This script helps you add Firebase Admin credentials to .env.local

echo "🔥 Firebase Admin SDK Setup"
echo "================================"
echo ""
echo "First, you need to download the service account key from Firebase Console:"
echo ""
echo "1. Go to: https://console.firebase.google.com/project/outbuild-xchange/settings/serviceaccounts/adminsdk"
echo "2. Click 'Generate new private key'"
echo "3. Save the JSON file"
echo ""
read -p "Press Enter once you've downloaded the JSON file..."

echo ""
echo "📂 Please provide the path to the downloaded JSON file:"
read -p "Path: " JSON_FILE_PATH

# Check if file exists
if [ ! -f "$JSON_FILE_PATH" ]; then
    echo "❌ Error: File not found at $JSON_FILE_PATH"
    exit 1
fi

echo ""
echo "✅ Found JSON file!"
echo ""

# Extract values from JSON
PROJECT_ID=$(grep -o '"project_id": "[^"]*' "$JSON_FILE_PATH" | sed 's/"project_id": "//')
CLIENT_EMAIL=$(grep -o '"client_email": "[^"]*' "$JSON_FILE_PATH" | sed 's/"client_email": "//')
PRIVATE_KEY=$(grep -o '"private_key": "[^"]*' "$JSON_FILE_PATH" | sed 's/"private_key": "//')

echo "📋 Extracted credentials:"
echo "  Project ID: $PROJECT_ID"
echo "  Client Email: $CLIENT_EMAIL"
echo "  Private Key: ${PRIVATE_KEY:0:50}..." # Show first 50 chars
echo ""

# Navigate to clusteer-unified directory
cd "/Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app/clusteer-unified"

# Backup existing .env.local if it exists
if [ -f .env.local ]; then
    BACKUP_FILE=".env.local.backup.$(date +%Y%m%d_%H%M%S)"
    cp .env.local "$BACKUP_FILE"
    echo "📦 Backed up existing .env.local to $BACKUP_FILE"
fi

# Check if credentials already exist in .env.local
if grep -q "FIREBASE_CLIENT_EMAIL" .env.local 2>/dev/null; then
    echo ""
    echo "⚠️  Firebase Admin credentials already exist in .env.local"
    read -p "Do you want to replace them? (y/n): " REPLACE

    if [ "$REPLACE" != "y" ]; then
        echo "❌ Setup cancelled"
        exit 0
    fi

    # Remove old credentials
    sed -i '' '/FIREBASE_CLIENT_EMAIL/d' .env.local
    sed -i '' '/FIREBASE_PRIVATE_KEY/d' .env.local
fi

# Add credentials to .env.local
echo "" >> .env.local
echo "# Firebase Admin SDK (Server-side)" >> .env.local
echo "FIREBASE_CLIENT_EMAIL=$CLIENT_EMAIL" >> .env.local
echo "FIREBASE_PRIVATE_KEY=\"$PRIVATE_KEY\"" >> .env.local

echo ""
echo "✅ Firebase Admin credentials added to .env.local"
echo ""
echo "🔒 Security reminder:"
echo "  - Never commit .env.local to git"
echo "  - Keep the service account JSON file secure"
echo "  - You can delete the JSON file after setup (credentials are in .env.local)"
echo ""
echo "🧪 Test the connection:"
echo "  1. Restart your dev server: npm run dev"
echo "  2. Try accessing: http://localhost:3000/admin/users"
echo "  3. Check console for any Firebase Admin errors"
echo ""
echo "✅ Setup complete!"
