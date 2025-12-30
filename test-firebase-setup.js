#!/usr/bin/env node

/**
 * Quick Firebase Setup Verification Script
 * Run this to verify your Firebase project is accessible and configured correctly
 */

const https = require('https');

console.log('🔥 Firebase Setup Verification\n');
console.log('Project: outbuild-xchange');
console.log('═══════════════════════════════════════\n');

// Firebase credentials from .env.local.firebase
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyArsz3K8vQPtTbzF4awuSjR-mhx3S9nDl0',
  authDomain: 'outbuild-xchange.firebaseapp.com',
  databaseURL: 'https://outbuild-xchange-default-rtdb.firebaseio.com',
  projectId: 'outbuild-xchange',
  storageBucket: 'outbuild-xchange.appspot.com',
  messagingSenderId: '215943233728',
  appId: '1:215943233728:web:3eefb47399a2476fcf6d25',
  measurementId: 'G-GN4WPK1N97'
};

console.log('📋 Configuration Found:');
console.log(`  Project ID: ${FIREBASE_CONFIG.projectId}`);
console.log(`  Auth Domain: ${FIREBASE_CONFIG.authDomain}`);
console.log(`  Storage Bucket: ${FIREBASE_CONFIG.storageBucket}\n`);

// Test 1: Check if Firebase Auth domain is accessible
console.log('🧪 Test 1: Checking Firebase Auth Domain...');
https.get(`https://${FIREBASE_CONFIG.authDomain}/__/auth/handler`, (res) => {
  if (res.statusCode === 200 || res.statusCode === 404) {
    console.log('  ✅ Auth domain is accessible\n');

    // Test 2: Check if Storage bucket is accessible
    console.log('🧪 Test 2: Checking Firebase Storage...');
    https.get(`https://firebasestorage.googleapis.com/v0/b/${FIREBASE_CONFIG.storageBucket}/o`, (res2) => {
      if (res2.statusCode === 200 || res2.statusCode === 401 || res2.statusCode === 403) {
        console.log('  ✅ Storage bucket is accessible\n');

        console.log('═══════════════════════════════════════');
        console.log('✅ Firebase Project is Accessible!\n');
        console.log('📋 Next Steps:\n');
        console.log('1. Verify Email/Password auth is enabled:');
        console.log('   https://console.firebase.google.com/project/outbuild-xchange/authentication/providers\n');
        console.log('2. Start the dev server:');
        console.log('   cd clusteer-unified && npm run dev\n');
        console.log('3. Test registration:');
        console.log('   curl -X POST http://localhost:3000/api/auth-firebase/register \\');
        console.log('     -H "Content-Type: application/json" \\');
        console.log('     -d \'{"username":"test","email":"test@example.com","phone":"08012345678","password":"Test123"}\'');
        console.log('\n🎉 Ready to test!\n');
      } else {
        console.log(`  ⚠️  Storage returned status: ${res2.statusCode}`);
        console.log('  This might be okay - check Firebase Console to verify Storage is enabled.\n');
      }
    }).on('error', (err) => {
      console.log(`  ❌ Error accessing storage: ${err.message}\n`);
    });

  } else {
    console.log(`  ❌ Auth domain returned status: ${res.statusCode}`);
    console.log('  Please verify your Firebase project exists and is accessible.\n');
  }
}).on('error', (err) => {
  console.log(`  ❌ Error: ${err.message}`);
  console.log('\n⚠️  Cannot reach Firebase. Please check:');
  console.log('  1. Your internet connection');
  console.log('  2. Firebase project exists at: https://console.firebase.google.com/project/outbuild-xchange');
  console.log('  3. You have permission to access the project\n');
});
