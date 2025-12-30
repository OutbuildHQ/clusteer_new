# 🔥 Setup New Firebase Project

The old `outbuild-xchange` project doesn't exist or isn't accessible. Let's create a fresh one!

---

## 📋 Step-by-Step Firebase Setup

### Step 1: Create Firebase Project (3 minutes)

1. **Go to Firebase Console**
   ```
   https://console.firebase.google.com/
   ```

2. **Click "Add project" or "Create a project"**

3. **Enter Project Details:**
   - **Project name:** `Clusteer` (or `clusteer-app`, `clusteer-prod`, etc.)
   - Click **Continue**

4. **Google Analytics (Optional):**
   - You can **disable** Google Analytics for now (simpler setup)
   - Or enable it if you want analytics
   - Click **Continue** or **Create project**

5. **Wait for project creation** (30 seconds)

6. **Click "Continue"** when done

---

### Step 2: Enable Email/Password Authentication (1 minute)

1. **In your Firebase project, click "Authentication"** in the left sidebar

2. **Click "Get started"**

3. **Go to "Sign-in method" tab**

4. **Click "Email/Password"**

5. **Toggle "Enable"** for the first option (Email/Password)
   - Leave "Email link (passwordless sign-in)" disabled for now

6. **Click "Save"**

---

### Step 3: Get Your Firebase Configuration (1 minute)

1. **Click the gear icon (⚙️) next to "Project Overview"**

2. **Click "Project settings"**

3. **Scroll down to "Your apps"**

4. **Click the Web icon `</>`** (third icon)

5. **Register your app:**
   - **App nickname:** `Clusteer Web`
   - **Firebase Hosting:** Leave unchecked (we're using Vercel/other)
   - Click **Register app**

6. **Copy the firebaseConfig object**

   It will look like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123",
     measurementId: "G-ABC123"
   };
   ```

7. **Click "Continue to console"**

---

### Step 4: Enable Firebase Storage (1 minute)

1. **In the left sidebar, click "Storage"**

2. **Click "Get started"**

3. **Security rules:**
   - Choose **"Start in production mode"** for now
   - Click **Next**

4. **Choose location:**
   - Select the region closest to your users (e.g., `us-central1` or `europe-west1`)
   - Click **Done**

---

### Step 5: Update Your Environment File (2 minutes)

Now update `.env.local.firebase` with your new credentials:

```bash
cd /Users/saintlammy/Documents/Clusteer/Website/Clusteer\ App/clusteer-app/clusteer-unified

# Edit the environment file
nano .env.local.firebase
```

**Replace these values** with your new Firebase config:

```properties
# Firebase Configuration (Your NEW Project)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza... ← FROM STEP 3
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com ← FROM STEP 3
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id ← FROM STEP 3
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com ← FROM STEP 3
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789 ← FROM STEP 3
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123 ← FROM STEP 3
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123 ← FROM STEP 3 (optional)

# Leave these as is for now
NEXT_PUBLIC_FIREBASE_DATABASE_URL=

# Spring Boot API (keep as is)
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_SPRING_BOOT_API_KEY=your-secure-api-key-here

# Django Blockchain Engine (keep as is)
BLOCKCHAIN_ENGINE_URL=http://localhost:8000
BLOCKCHAIN_ENGINE_API_KEY=adHBFkoyv2KTENBWEAQXOqjm9GCYy0KFtt19RwURZKjnuP1M1GiePk09aapb4egG
NEXT_PUBLIC_BLOCKCHAIN_ENGINE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_BLOCKCHAIN_ENGINE_API_KEY=adHBFkoyv2KTENBWEAQXOqjm9GCYy0KFtt19RwURZKjnuP1M1GiePk09aapb4egG

# App Configuration (keep as is)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Save the file** (Ctrl+X, then Y, then Enter in nano)

---

## 🧪 Test Your New Firebase Setup

### Step 1: Start Dev Server

```bash
cd /Users/saintlammy/Documents/Clusteer/Website/Clusteer\ App/clusteer-app/clusteer-unified

# Copy Firebase config to .env.local (for testing)
cp .env.local .env.local.supabase.backup  # Backup current
cp .env.local.firebase .env.local

# Start dev server
npm run dev
```

### Step 2: Test Registration

**In another terminal:**

```bash
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

### Step 3: Verify in Firebase Console

1. **Go to your Firebase project:**
   ```
   https://console.firebase.google.com/project/YOUR-PROJECT-ID/authentication/users
   ```
   (Replace `YOUR-PROJECT-ID` with your actual project ID)

2. **You should see `test@example.com` in the users list!** ✅

---

## 🎯 What If You See Errors?

### Error: "Firebase: Error (auth/operation-not-allowed)"

**Solution:** Go back to Step 2 and make sure Email/Password is enabled

---

### Error: "Firebase: No Firebase App '[DEFAULT]' has been created"

**Solution:**
1. Make sure you restarted the dev server after updating `.env.local`
2. Check that all `NEXT_PUBLIC_FIREBASE_*` variables are set correctly

---

### Error: "Spring Boot backend not responding" or "Network Error"

**This is expected!** Spring Boot isn't set up yet.

**Temporary Workaround:**

Edit `src/lib/auth-firebase.ts` and comment out the Spring Boot call:

```typescript
// Around line 35-45, find this section:
export async function registerWithFirebase(data: RegisterData): Promise<LoginResponse> {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    await sendEmailVerification(userCredential.user);

    // COMMENT OUT THIS SECTION FOR NOW:
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

    // ADD THIS TEMPORARY CODE INSTEAD:
    const userProfile: UserProfile = {
      id: userCredential.user.uid,
      email: data.email,
      username: data.username,
      phone: data.phone,
      firebaseUid: userCredential.user.uid,
      isVerified: false,
    };

    // Rest of the code stays the same...
```

This allows you to test Firebase auth without needing Spring Boot running.

---

## 📧 Customize Email Templates (Optional)

Your Firebase project sends verification and password reset emails. You can customize them:

1. **Go to Firebase Console → Authentication → Templates**

2. **Customize:**
   - Email verification template
   - Password reset template
   - Change sender name to "Clusteer"
   - Customize the email text

---

## 🔐 Firebase Security Rules (For Later)

Once everything is working, you'll want to add security rules:

### Firestore Rules (if you use Firestore later)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## ✅ Checklist

- [ ] Created new Firebase project
- [ ] Enabled Email/Password authentication
- [ ] Registered web app
- [ ] Copied Firebase config
- [ ] Updated `.env.local.firebase`
- [ ] Tested registration with curl
- [ ] Verified user in Firebase Console
- [ ] (Optional) Customized email templates
- [ ] (Optional) Set up security rules

---

## 📞 Your Firebase Project URLs

After creating your project, bookmark these:

```
Console: https://console.firebase.google.com/project/YOUR-PROJECT-ID
Authentication: https://console.firebase.google.com/project/YOUR-PROJECT-ID/authentication
Users: https://console.firebase.google.com/project/YOUR-PROJECT-ID/authentication/users
Storage: https://console.firebase.google.com/project/YOUR-PROJECT-ID/storage
```

---

## 🎉 You're All Set!

Once you complete these steps:
- ✅ Firebase project created
- ✅ Authentication enabled
- ✅ Frontend configured
- ✅ Ready to test

**Next:** Test with the curl commands in Step "Test Your New Firebase Setup" above!
