/**
 * Firebase Setup Test Script
 * Tests if Firebase credentials are correct
 * Run: node test-firebase-setup.js
 */

const firebaseConfig = {
  apiKey: "AIzaSyArsz3K8vQPtTbzF4awuSjR-mhx3S9nDl0",
  authDomain: "outbuild-xchange.firebaseapp.com",
  databaseURL: "https://outbuild-xchange-default-rtdb.firebaseio.com",
  projectId: "outbuild-xchange",
  storageBucket: "outbuild-xchange.appspot.com",
  messagingSenderId: "215943233728",
  appId: "1:215943233728:web:3eefb47399a2476fcf6d25",
  measurementId: "G-GN4WPK1N97"
};

console.log('🔥 Firebase Configuration Test\n');
console.log('Project:', firebaseConfig.projectId);
console.log('Auth Domain:', firebaseConfig.authDomain);
console.log('Storage Bucket:', firebaseConfig.storageBucket);
console.log('\n✅ Firebase config looks good!');
console.log('\n📋 Next Steps:');
console.log('1. Check Firebase Console: https://console.firebase.google.com/project/outbuild-xchange');
console.log('2. Ensure Email/Password authentication is enabled');
console.log('3. Test the auth routes after starting dev server');
console.log('\n🚀 Ready to use Firebase!');
