import { jwtVerify, SignJWT } from 'jose';

// SECURITY: Require JWT_SECRET to be set - fail fast if missing
if (!process.env.JWT_SECRET) {
  throw new Error(
    'CRITICAL: JWT_SECRET environment variable is not set. ' +
    'Generate a secure secret with: openssl rand -base64 32'
  );
}

// Validate JWT_SECRET strength
if (process.env.JWT_SECRET.length < 32) {
  throw new Error(
    'CRITICAL: JWT_SECRET must be at least 32 characters long. ' +
    'Current length: ' + process.env.JWT_SECRET.length + '. ' +
    'Generate a secure secret with: openssl rand -base64 32'
  );
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export interface JWTPayload {
  userId: string;
  email: string;
  username?: string;
  exp?: number;
  iat?: number;
}

/**
 * Verify JWT token and return payload
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });

    return payload as JWTPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Generate JWT token
 */
export async function generateToken(payload: Omit<JWTPayload, 'exp' | 'iat'>): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  return token;
}

/**
 * Check if token is expired
 */
export function isTokenExpired(exp?: number): boolean {
  if (!exp) return true;
  return Date.now() >= exp * 1000;
}
