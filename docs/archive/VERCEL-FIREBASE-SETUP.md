# Configure Firebase Environment Variables on Vercel

## Issue
Login and registration are failing on the Vercel deployment because Firebase environment variables are not configured.

## Solution

### Step 1: Get Firebase Credentials

You need the Firebase credentials from your `.env.local` file:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### Step 2: Add to Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** tab
3. Click on **Environment Variables** in the left sidebar
4. Add each variable one by one:
   - **Name**: `NEXT_PUBLIC_FIREBASE_API_KEY`
   - **Value**: Your API key from `.env.local`
   - **Environment**: Select all (Production, Preview, Development)
   - Click **Save**

5. Repeat for all 8 Firebase variables listed above

### Step 3: Redeploy

After adding all environment variables:

1. Go to **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**
4. Wait for the build to complete

### Step 4: Test

Once redeployed, test:
- Registration: Should create new users in Firebase
- Login: Should authenticate existing users

---

## Current Behavior Without Variables

- Login returns: "Firebase authentication is not configured" (503 error)
- Registration returns: "Firebase authentication is not configured" (503 error)

This is expected and safe - the app builds successfully but auth doesn't work until Firebase is configured.

---

## Alternative: Use Local Firebase Project

If you don't have Firebase credentials yet:

1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable Email/Password authentication
4. Register a web app
5. Copy the config values
6. Add them to Vercel as described above

Refer to `SETUP-NEW-FIREBASE.md` for detailed Firebase setup instructions.
