# 🔥 Quick Start: Test Firebase Integration

**Your Firebase Project:** `outbuild-xchange`

---

## ✅ What's Already Done

1. ✅ Firebase project exists (`outbuild-xchange`)
2. ✅ Firebase credentials configured
3. ✅ Frontend code ready
4. ✅ Auth routes created

---

## 🚀 Start Testing in 3 Steps

### Step 1: Enable Firebase Email Authentication (2 minutes)

1. Go to Firebase Console:
   ```
   https://console.firebase.google.com/project/outbuild-xchange/authentication
   ```

2. Click **"Get Started"** (if not already done)

3. Go to **"Sign-in method"** tab

4. Click **"Email/Password"**

5. **Enable** the toggle

6. Click **Save**

### Step 2: Use Firebase Environment (30 seconds)

```bash
cd /Users/saintlammy/Documents/Clusteer/Website/Clusteer\ App/clusteer-app/clusteer-unified

# OPTION A: Test without breaking Supabase (Recommended)
# Keep current .env.local, just test the new routes
npm run dev

# OPTION B: Switch to Firebase completely
# Backup current config first!
cp .env.local .env.local.supabase.backup
cp .env.local.firebase .env.local
npm run dev
```

### Step 3: Test Firebase Auth Routes (2 minutes)

**Open new terminal and run:**

```bash
# Test Registration
curl -X POST http://localhost:3000/api/auth-firebase/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "phone": "08012345678",
    "password": "TestPass123"
  }'
```

**Expected Success Response:**
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

**Then test login:**
```bash
curl -X POST http://localhost:3000/api/auth-firebase/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

---

## 🎯 What Each Option Does

### Option A: Test Without Breaking Supabase ✅ RECOMMENDED

**Current routes (Supabase):** Keep working
- `/api/auth/login`
- `/api/auth/register`
- `/api/auth/logout`

**New routes (Firebase):** Test in parallel
- `/api/auth-firebase/login` ← Test this
- `/api/auth-firebase/register` ← Test this
- `/api/auth-firebase/logout` ← Test this

**Benefits:**
- ✅ No risk to current system
- ✅ Can compare behavior
- ✅ Easy rollback
- ✅ Test thoroughly before switching

### Option B: Switch to Firebase Completely

**All routes use Firebase**
- Replace `.env.local` with Firebase config
- Everything uses Firebase
- Can't use Supabase until you switch back

**Benefits:**
- ✅ Clean switch
- ✅ Test real experience
- ⚠️ Can rollback by restoring `.env.local.supabase.backup`

---

## 📊 Testing Checklist

### Basic Auth Tests
- [ ] Register new user works
- [ ] Verification email sent (check inbox)
- [ ] Login with email/password works
- [ ] Login returns valid token
- [ ] Logout works
- [ ] Password reset email sent

### Error Handling Tests
- [ ] Duplicate email shows error
- [ ] Wrong password shows error
- [ ] Invalid email format shows error
- [ ] Weak password shows error

### Integration Tests
- [ ] Token stored in cookie
- [ ] Cookie is HttpOnly
- [ ] 401 redirects to login
- [ ] Token works with Spring Boot API (when ready)

---

## 🔍 Verify in Firebase Console

After testing, check Firebase Console:

1. **View Registered Users:**
   ```
   https://console.firebase.google.com/project/outbuild-xchange/authentication/users
   ```

   Should see `test@example.com` listed

2. **Check Email Templates:**
   ```
   https://console.firebase.google.com/project/outbuild-xchange/authentication/emails
   ```

   Customize verification and password reset emails

3. **Monitor Activity:**
   ```
   https://console.firebase.google.com/project/outbuild-xchange/authentication/activity
   ```

   See login attempts and registrations

---

## 🐛 Troubleshooting

### Error: "Firebase: Error (auth/email-already-in-use)"

**Meaning:** User already registered

**Solution:** Use different email or delete user from Firebase Console

---

### Error: "Firebase: Error (auth/weak-password)"

**Meaning:** Password too short

**Solution:** Use at least 6 characters

---

### Error: "Firebase: Error (auth/operation-not-allowed)"

**Meaning:** Email/Password auth not enabled

**Solution:** Go to Step 1 above and enable Email/Password authentication

---

### Error: "Network request failed"

**Meaning:** Firebase can't connect

**Solution:**
1. Check internet connection
2. Verify Firebase config in `.env.local.firebase`
3. Make sure dev server is running: `npm run dev`

---

### Error: Spring Boot backend not responding

**Expected!** Spring Boot isn't set up yet.

**What works now:**
- ✅ Firebase authentication
- ✅ User registration/login in Firebase
- ⚠️ User profile creation in Spring Boot will fail (that's okay for now)

**Workaround for testing:**
Comment out Spring Boot API call temporarily:

```typescript
// In src/lib/auth-firebase.ts, line ~40
// Temporarily comment out:
// const { data: userProfile } = await apiClient.post<UserProfile>('/users', {
//   id: userCredential.user.uid,
//   ...
// });

// Return Firebase user instead:
const userProfile = {
  id: userCredential.user.uid,
  email: data.email,
  username: data.username,
  phone: data.phone,
  firebaseUid: userCredential.user.uid,
  isVerified: false,
};
```

---

## 📱 Test in Browser

**Option 1: Use existing pages (when ready)**

Once you update login/register pages, test normally:
1. Go to `http://localhost:3000/login`
2. Try to login
3. Should work with Firebase

**Option 2: Create test page now**

Create `src/app/test-firebase/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { loginWithFirebase, registerWithFirebase } from '@/lib/auth-firebase';

export default function TestFirebase() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      await registerWithFirebase({
        username: 'testuser',
        email,
        phone: '08012345678',
        password,
      });
      setMessage('✅ Registration successful!');
    } catch (error: any) {
      setMessage('❌ ' + error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const { user, token } = await loginWithFirebase(email, password);
      setMessage('✅ Login successful! User: ' + user.email);
    } catch (error: any) {
      setMessage('❌ ' + error.message);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Firebase Auth Test</h1>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ margin: '0.5rem', padding: '0.5rem' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ margin: '0.5rem', padding: '0.5rem' }}
        />
      </div>
      <div>
        <button onClick={handleRegister} style={{ margin: '0.5rem', padding: '0.5rem' }}>
          Register
        </button>
        <button onClick={handleLogin} style={{ margin: '0.5rem', padding: '0.5rem' }}>
          Login
        </button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}
```

Then visit: `http://localhost:3000/test-firebase`

---

## ✅ Success Criteria

You'll know it's working when:

1. ✅ Can register new user
2. ✅ Verification email received
3. ✅ Can login with email/password
4. ✅ User appears in Firebase Console
5. ✅ Token stored in browser cookie
6. ✅ Logout clears cookie

---

## 🎯 What to Do Next

### Immediate (Today)
1. [ ] Enable Email/Password auth in Firebase Console
2. [ ] Test registration with curl
3. [ ] Test login with curl
4. [ ] Verify user in Firebase Console

### Short-term (This Week)
1. [ ] Update login page to use Firebase
2. [ ] Update register page to use Firebase
3. [ ] Test with real UI
4. [ ] Configure email templates in Firebase

### Later (When Backend is Ready)
1. [ ] Setup Spring Boot backend
2. [ ] Import Supabase data to PostgreSQL
3. [ ] Connect Firebase auth to Spring Boot
4. [ ] Full end-to-end testing

---

## 📞 Quick Links

- **Firebase Console:** https://console.firebase.google.com/project/outbuild-xchange
- **Authentication Users:** https://console.firebase.google.com/project/outbuild-xchange/authentication/users
- **Email Templates:** https://console.firebase.google.com/project/outbuild-xchange/authentication/emails
- **Frontend Guide:** See `FRONTEND-MIGRATION-GUIDE.md`
- **Full Migration:** See `MIGRATION-GUIDE.md`

---

**🎉 You're ready to test Firebase! Start with Step 1 above.**
