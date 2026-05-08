# Frontend Migration Guide: Supabase → Firebase + Spring Boot

**Status:** ✅ Ready to Execute
**Estimated Time:** 1-2 days
**Risk Level:** Low (parallel implementation, easy rollback)

---

## 📋 What's Been Created

### New Files Created (9 files)

#### Authentication & API (3 files)
1. `src/lib/firebase.ts` - Firebase initialization
2. `src/lib/spring-boot-api.ts` - Axios client for Spring Boot
3. `src/lib/auth-firebase.ts` - Firebase auth helpers

#### API Routes (4 files)
4. `src/app/api/auth-firebase/login/route.ts`
5. `src/app/api/auth-firebase/register/route.ts`
6. `src/app/api/auth-firebase/logout/route.ts`
7. `src/app/api/auth-firebase/reset-password/route.ts`

#### Configuration (1 file)
8. `.env.firebase.example` - Environment template

#### Documentation (1 file)
9. `FRONTEND-MIGRATION-GUIDE.md` - This file

---

## 🚀 Quick Start (Testing Firebase Auth)

### Step 1: Setup Firebase Project

1. **Create Firebase Project**
   ```
   Go to: https://console.firebase.google.com/
   Click: Add Project
   Name: Clusteer (or your choice)
   Disable Google Analytics (optional)
   ```

2. **Enable Email/Password Authentication**
   ```
   In Firebase Console:
   → Authentication
   → Sign-in method
   → Email/Password (Enable)
   → Save
   ```

3. **Get Firebase Config**
   ```
   In Firebase Console:
   → Project Settings (gear icon)
   → General tab
   → Your apps → Web app
   → Copy the firebaseConfig object
   ```

### Step 2: Update Environment Variables

```bash
cd clusteer-unified

# Backup current .env.local (IMPORTANT!)
cp .env.local .env.local.supabase.backup

# Copy Firebase template
cp .env.firebase.example .env.local.firebase

# Edit .env.local.firebase with your Firebase credentials
nano .env.local.firebase
```

**Add your Firebase values:**
```properties
NEXT_PUBLIC_FIREBASE_API_KEY=AIza... (from Firebase console)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123

# Spring Boot API (use localhost for now, change later)
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_SPRING_BOOT_API_KEY=test-key-for-development
```

### Step 3: Test Firebase Auth Routes

**Option A: Test with existing Supabase backend**
```bash
# Keep current .env.local (Supabase)
# Just test the new Firebase routes in isolation

# Start dev server
npm run dev

# Test in browser or with curl:
curl -X POST http://localhost:3000/api/auth-firebase/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "phone": "08012345678",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "status": true,
  "message": "Registration successful! Please check your email to verify your account.",
  "data": {
    "username": "testuser",
    "email": "test@example.com",
    "phone": "08012345678"
  }
}
```

**Option B: Switch to Firebase completely**
```bash
# Replace .env.local with Firebase version
cp .env.local.firebase .env.local

# Restart dev server
npm run dev
```

---

## 📝 Migration Strategy (Recommended)

### Strategy: Parallel Implementation

Keep Supabase running while testing Firebase. This allows safe testing without breaking production.

**Steps:**

1. **Keep current auth routes** (`/api/auth/*`) using Supabase
2. **Test new Firebase routes** (`/api/auth-firebase/*`) in parallel
3. **Once verified**, update pages to use new routes
4. **Then** remove old Supabase routes

**Benefits:**
- ✅ Zero downtime
- ✅ Easy rollback
- ✅ Can test thoroughly before switching
- ✅ Compare behavior side-by-side

---

## 🔧 How to Use the New Files

### 1. Firebase Authentication

```typescript
// Import the auth helpers
import {
  registerWithFirebase,
  loginWithFirebase,
  logoutFirebase,
  resetPassword,
  getCurrentUser,
} from '@/lib/auth-firebase';

// Register a new user
try {
  const { user, token } = await registerWithFirebase({
    username: 'johndoe',
    email: 'john@example.com',
    phone: '08012345678',
    password: 'securePassword123',
  });

  console.log('User registered:', user);
  console.log('Firebase token:', token);
} catch (error) {
  console.error('Registration failed:', error.message);
}

// Login
try {
  const { user, token } = await loginWithFirebase(
    'john@example.com',
    'securePassword123'
  );

  console.log('Logged in:', user);
} catch (error) {
  console.error('Login failed:', error.message);
}

// Logout
await logoutFirebase();

// Reset password
await resetPassword('john@example.com');

// Get current user
const currentUser = getCurrentUser();
if (currentUser) {
  console.log('User is logged in:', currentUser.email);
}
```

### 2. Spring Boot API Client

```typescript
// Import the API client
import apiClient from '@/lib/spring-boot-api';

// Make API calls (automatically includes Firebase token)
const { data } = await apiClient.get('/users/profile');
const { data } = await apiClient.post('/transactions', { amount: 100 });
const { data } = await apiClient.put('/users/profile', { username: 'newname' });
```

---

## 🔄 Updating Existing Pages

### Example: Update Login Page

**Current (Supabase):**
```typescript
// src/app/login/page.tsx
const handleLogin = async (data: LoginFormData) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  // ...
};
```

**New (Firebase):**
```typescript
// src/app/login/page.tsx
import { loginWithFirebase } from '@/lib/auth-firebase';

const handleLogin = async (data: LoginFormData) => {
  try {
    const { user, token } = await loginWithFirebase(data.email, data.password);

    // Store user in state/context
    setUser(user);

    // Redirect to dashboard
    router.push('/dashboard');
  } catch (error) {
    toast.error(error.message);
  }
};
```

**Or use the new API route:**
```typescript
const handleLogin = async (data: LoginFormData) => {
  const response = await fetch('/api/auth-firebase/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (result.status) {
    router.push('/dashboard');
  } else {
    toast.error(result.message);
  }
};
```

---

## 🧪 Testing Checklist

### Firebase Authentication Tests

- [ ] **Register new user**
  - [ ] Firebase account created
  - [ ] Verification email sent
  - [ ] User profile created in Spring Boot (when backend is ready)
  - [ ] Error handling works (duplicate email, weak password)

- [ ] **Login**
  - [ ] Can login with email/password
  - [ ] Token stored in cookie
  - [ ] User redirected to dashboard
  - [ ] Error handling works (wrong password, user not found)

- [ ] **Logout**
  - [ ] User logged out from Firebase
  - [ ] Cookie cleared
  - [ ] Redirected to login page

- [ ] **Password Reset**
  - [ ] Reset email sent
  - [ ] User can reset password via email link
  - [ ] Can login with new password

### API Client Tests

- [ ] **Automatic token injection**
  - [ ] Firebase token added to Authorization header
  - [ ] API key added to X-API-KEY header

- [ ] **Error handling**
  - [ ] 401 redirects to login
  - [ ] Network errors handled gracefully
  - [ ] Error messages displayed to user

---

## 🚨 Common Issues & Solutions

### Issue 1: Firebase not initialized

**Error:** `Firebase: No Firebase App '[DEFAULT]' has been created`

**Solution:**
```typescript
// Make sure Firebase is imported before use
import { auth } from '@/lib/firebase';

// Check if running on server (Firebase only works client-side)
if (typeof window !== 'undefined') {
  // Firebase operations here
}
```

### Issue 2: CORS errors

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Ensure Spring Boot allows your frontend origin
- Check `CORS_ALLOWED_ORIGINS` in Spring Boot `.env`
- For development, allow `http://localhost:3000`

### Issue 3: Token not being sent

**Error:** API returns 401 even when logged in

**Solution:**
```typescript
// Ensure user is logged in before API call
import { getCurrentUser } from '@/lib/auth-firebase';

const user = getCurrentUser();
if (!user) {
  router.push('/login');
  return;
}

// Make API call
const response = await apiClient.get('/users/profile');
```

### Issue 4: Environment variables not loaded

**Error:** `undefined` when accessing `process.env.NEXT_PUBLIC_FIREBASE_API_KEY`

**Solution:**
- Restart dev server: `npm run dev`
- Check `.env.local` exists and has correct values
- Ensure variable names start with `NEXT_PUBLIC_` for client-side access

---

## 📦 Required Dependencies

All required dependencies are already in `package.json`:

```json
{
  "firebase": "^12.1.0", ✅ Already installed
  "axios": "^1.11.0" ✅ Already installed
}
```

No additional installations needed!

---

## 🔐 Security Considerations

### Environment Variables
- ✅ Never commit `.env.local` to git
- ✅ Use `.env.firebase.example` as template
- ✅ Firebase API key is safe to expose (protected by Firebase security rules)
- ⚠️ Spring Boot API key should be kept secure

### Authentication
- ✅ Firebase ID tokens expire after 1 hour (auto-refresh handled)
- ✅ HttpOnly cookies prevent XSS attacks
- ✅ SameSite=strict prevents CSRF
- ✅ Tokens are validated on every request

### API Security
- ✅ All requests include Firebase ID token
- ✅ Spring Boot validates token with Firebase Admin SDK
- ✅ 401 errors redirect to login automatically

---

## 📊 Migration Progress

### Completed ✅
- [x] Firebase configuration
- [x] Spring Boot API client
- [x] Auth helpers (login, register, logout, reset)
- [x] API routes for authentication
- [x] Error handling
- [x] Token management

### Pending ⏳
- [ ] Update login page
- [ ] Update register page
- [ ] Update password reset page
- [ ] Replace Supabase calls in components
- [ ] Update middleware for Firebase
- [ ] Test all features end-to-end

---

## 🎯 Next Steps

### Immediate (Today)
1. Create Firebase project
2. Copy `.env.firebase.example` to `.env.local.firebase`
3. Add Firebase credentials
4. Test new auth routes with curl/Postman

### Short-term (This Week)
1. Update login page to use Firebase
2. Update register page to use Firebase
3. Test authentication flows
4. Update other pages gradually

### Medium-term (Next Week)
1. Replace all Supabase calls
2. Update middleware
3. Test all features
4. Deploy to staging

---

## 🔄 Rollback Plan

If something goes wrong:

```bash
# Restore Supabase configuration
cp .env.local.supabase.backup .env.local

# Restart dev server
npm run dev

# Everything back to normal!
```

**Keep `.env.local.supabase.backup` until migration is 100% complete.**

---

## 📞 Support

### Documentation
- **This guide:** Frontend migration steps
- **MIGRATION-GUIDE.md:** Full backend + frontend migration
- **claude.md:** Session progress and notes

### External Resources
- **Firebase Docs:** https://firebase.google.com/docs/auth
- **Firebase Console:** https://console.firebase.google.com/
- **Next.js Docs:** https://nextjs.org/docs

---

## ✨ Summary

You now have:
- ✅ **Firebase integration** ready to use
- ✅ **Spring Boot API client** with auto token injection
- ✅ **Auth helpers** for all authentication operations
- ✅ **Parallel implementation** - test without breaking current setup
- ✅ **Complete documentation** with examples

**Ready to start testing!** 🚀

Begin with Step 1: Setup Firebase Project (above)
