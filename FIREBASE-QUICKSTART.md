# 🚀 Firebase Quick Start (5 Minutes)

**Problem**: Your old Firebase project "outbuild-xchange" doesn't exist or is inaccessible.

**Solution**: Create a fresh Firebase project in 5 minutes using this guide.

---

## ⚡ Super Quick Method (Recommended)

### Step 1: Create Firebase Project (2 minutes)

1. **Open**: https://console.firebase.google.com/
2. **Click**: "Add project" or "Create a project"
3. **Enter name**: `Clusteer` (or any name you prefer)
4. **Click**: Continue
5. **Google Analytics**: Disable (simpler) or Enable (if you want analytics)
6. **Click**: "Create project"
7. **Wait** 30 seconds for project creation
8. **Click**: "Continue"

### Step 2: Enable Email/Password Auth (30 seconds)

1. **Click**: "Authentication" in left sidebar
2. **Click**: "Get started"
3. **Click**: "Sign-in method" tab
4. **Click**: "Email/Password"
5. **Toggle**: Enable the first option
6. **Click**: "Save"

### Step 3: Register Web App (30 seconds)

1. **Click**: Gear icon ⚙️ next to "Project Overview"
2. **Click**: "Project settings"
3. **Scroll down** to "Your apps"
4. **Click**: Web icon `</>`
5. **App nickname**: `Clusteer Web`
6. **Firebase Hosting**: Leave unchecked
7. **Click**: "Register app"

### Step 4: Enable Storage (30 seconds)

1. **Click**: "Storage" in left sidebar
2. **Click**: "Get started"
3. **Security rules**: Choose "Start in production mode"
4. **Click**: "Next"
5. **Location**: Choose closest region (e.g., `us-central1`)
6. **Click**: "Done"

### Step 5: Run Setup Script (1 minute)

**Copy your Firebase config** (from Step 3 above, should still be visible), then:

```bash
cd "/Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app"
./scripts/setup-firebase.sh
```

The script will:
- ✅ Prompt you for your Firebase config values
- ✅ Create `.env.local` with your configuration
- ✅ Backup your old `.env.local` (if exists)
- ✅ Test the Firebase connection
- ✅ Verify authentication is working

---

## 🧪 Test Your Setup

After running the setup script, test manually:

```bash
cd clusteer-unified
npm run dev
```

In another terminal:

```bash
# Test registration
curl -X POST http://localhost:3000/api/auth-firebase/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "phone": "08012345678",
    "password": "TestPass123"
  }'
```

**Expected Response**:
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

**Verify in Firebase Console**:
1. Go to: https://console.firebase.google.com/project/YOUR-PROJECT-ID/authentication/users
2. You should see `test@example.com` in the users list ✅

---

## 🔧 If You Get Errors

### Error: "Firebase: Error (auth/operation-not-allowed)"
**Fix**: Go back to Step 2 and enable Email/Password authentication

### Error: "Firebase: No Firebase App '[DEFAULT]' has been created"
**Fix**:
1. Restart dev server after updating `.env.local`
2. Check all `NEXT_PUBLIC_FIREBASE_*` variables are set

### Error: "ECONNREFUSED" or "Network Error"
**Fix**: This is about Spring Boot (backend), which isn't running yet. You can:

**Option A** (Test Firebase Only - Recommended):
Edit `clusteer-unified/src/lib/auth-firebase.ts`:

```typescript
// Around line 35-45, find this:
export async function registerWithFirebase(data: RegisterData): Promise<LoginResponse> {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    await sendEmailVerification(userCredential.user);

    // COMMENT OUT this Spring Boot call:
    /*
    const { data: userProfile } = await apiClient.post<UserProfile>('/users', {
      id: userCredential.user.uid,
      email: data.email,
      username: data.username,
      phone: data.phone,
      firebaseUid: userCredential.user.uid,
      isVerified: false,
    });
    */

    // ADD this instead (temporary):
    const userProfile: UserProfile = {
      id: userCredential.user.uid,
      email: data.email,
      username: data.username,
      phone: data.phone,
      firebaseUid: userCredential.user.uid,
      isVerified: false,
    };

    const token = await userCredential.user.getIdToken();
    return {
      status: true,
      message: "Registration successful! Please check your email to verify your account.",
      user: userProfile,
      firebaseUser: userCredential.user,
      token,
    };
  } catch (error: any) {
    throw new Error(error.message || "Registration failed");
  }
}
```

**Option B** (Setup Spring Boot):
See `MIGRATION-GUIDE.md` for Spring Boot setup instructions.

---

## 📋 Checklist

- [ ] Created new Firebase project
- [ ] Enabled Email/Password authentication
- [ ] Registered web app
- [ ] Enabled Firebase Storage
- [ ] Ran `./scripts/setup-firebase.sh`
- [ ] Tested registration with curl
- [ ] Verified user in Firebase Console

---

## 🎯 Your Firebase URLs

Bookmark these (replace `YOUR-PROJECT-ID` with your actual project ID):

```
Console: https://console.firebase.google.com/project/YOUR-PROJECT-ID
Authentication: https://console.firebase.google.com/project/YOUR-PROJECT-ID/authentication
Users: https://console.firebase.google.com/project/YOUR-PROJECT-ID/authentication/users
Storage: https://console.firebase.google.com/project/YOUR-PROJECT-ID/storage
```

---

## 📚 More Details

For detailed explanations and troubleshooting, see:
- **SETUP-NEW-FIREBASE.md** - Complete step-by-step guide with screenshots description
- **MIGRATION-GUIDE.md** - Full migration from Supabase to Spring Boot + Firebase

---

## ✅ What's Ready

Once Firebase is configured, you have:
- ✅ Firebase Authentication (Email/Password)
- ✅ Firebase Storage (for avatars, KYC documents)
- ✅ Frontend integration (`/api/auth-firebase/*` routes)
- ✅ Automatic token management
- ✅ HttpOnly cookie security
- ✅ Ready to test without Spring Boot (using temporary workaround)

**Next**: Test Firebase auth, then proceed with Spring Boot setup when ready.
