import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  User as FirebaseUser,
  UserCredential,
} from 'firebase/auth';
import { auth } from './firebase';
import apiClient, { handleApiError } from './spring-boot-api';

/**
 * Firebase Authentication Helper
 * Integrates Firebase Auth with Spring Boot backend
 */

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  phone: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  phone: string;
  isVerified: boolean;
  avatarUrl?: string;
  firebaseUid: string;
}

export interface LoginResponse {
  user: UserProfile;
  firebaseUser: FirebaseUser;
  token: string;
}

/**
 * Register a new user with Firebase and create profile in Spring Boot
 */
export async function registerWithFirebase(data: RegisterData): Promise<LoginResponse> {
  if (!auth) {
    throw new Error('Firebase is not configured');
  }

  try {
    // Create user in Firebase Auth
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    // Send email verification
    await sendEmailVerification(userCredential.user);

    // TEMPORARY: Create user profile locally (Spring Boot not running yet)
    // TODO: Uncomment when Spring Boot is ready
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

    // Temporary local user profile
    const userProfile: UserProfile = {
      id: userCredential.user.uid,
      email: data.email,
      username: data.username,
      phone: data.phone,
      firebaseUid: userCredential.user.uid,
      isVerified: false,
    };

    // Get Firebase ID token
    const token = await userCredential.user.getIdToken();

    return {
      user: userProfile,
      firebaseUser: userCredential.user,
      token,
    };
  } catch (error: any) {
    // Handle Firebase Auth errors
    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('This email is already registered');
        case 'auth/invalid-email':
          throw new Error('Invalid email address');
        case 'auth/weak-password':
          throw new Error('Password is too weak. Use at least 6 characters');
        default:
          throw new Error(error.message || 'Registration failed');
      }
    }

    throw new Error(error.message || 'Registration failed');
  }
}

/**
 * Login with Firebase and fetch user profile from Spring Boot
 */
export async function loginWithFirebase(
  email: string,
  password: string
): Promise<LoginResponse> {
  if (!auth) {
    throw new Error('Firebase is not configured');
  }

  try {
    // Sign in with Firebase
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // TEMPORARY: Create user profile locally (Spring Boot not running yet)
    // TODO: Uncomment when Spring Boot is ready
    /*
    const { data: userProfile } = await apiClient.get<UserProfile>(
      `/users/${userCredential.user.uid}`
    );
    */

    // Temporary local user profile
    const userProfile: UserProfile = {
      id: userCredential.user.uid,
      email: userCredential.user.email || email,
      username: userCredential.user.displayName || email.split('@')[0],
      phone: userCredential.user.phoneNumber || '',
      firebaseUid: userCredential.user.uid,
      isVerified: userCredential.user.emailVerified,
    };

    // Get Firebase ID token
    const token = await userCredential.user.getIdToken();

    return {
      user: userProfile,
      firebaseUser: userCredential.user,
      token,
    };
  } catch (error: any) {
    // Handle Firebase Auth errors
    if (error.code) {
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          throw new Error('Invalid email or password');
        case 'auth/user-disabled':
          throw new Error('This account has been disabled');
        case 'auth/too-many-requests':
          throw new Error('Too many failed login attempts. Please try again later');
        default:
          throw new Error(error.message || 'Login failed');
      }
    }

    throw new Error(error.message || 'Login failed');
  }
}

/**
 * Logout from Firebase
 */
export async function logoutFirebase(): Promise<void> {
  if (!auth) {
    throw new Error('Firebase is not configured');
  }

  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Failed to logout');
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  if (!auth) {
    throw new Error('Firebase is not configured');
  }

  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      throw new Error('No account found with this email');
    }
    throw new Error(error.message || 'Failed to send password reset email');
  }
}

/**
 * Get current Firebase user
 */
export function getCurrentUser(): FirebaseUser | null {
  return auth?.currentUser || null;
}

/**
 * Get current user's ID token
 */
export async function getCurrentUserToken(): Promise<string | null> {
  const user = getCurrentUser();
  if (!user) return null;

  try {
    return await user.getIdToken();
  } catch (error) {
    console.error('Failed to get user token:', error);
    return null;
  }
}

/**
 * Check if current user's email is verified
 */
export function isEmailVerified(): boolean {
  const user = getCurrentUser();
  return user?.emailVerified || false;
}

/**
 * Send email verification to current user
 */
export async function sendVerificationEmail(): Promise<void> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('No user logged in');
  }

  try {
    await sendEmailVerification(user);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send verification email');
  }
}

/**
 * Refresh user's ID token
 */
export async function refreshToken(): Promise<string | null> {
  const user = getCurrentUser();
  if (!user) return null;

  try {
    return await user.getIdToken(true); // Force refresh
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return null;
  }
}
