import { jwtVerify, SignJWT } from 'jose';

// Lazy getter — validated at request time, not module load time.
// This prevents Next.js build from crashing when JWT_SECRET is absent
// during static page data collection.
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      'CRITICAL: JWT_SECRET environment variable is not set. ' +
      'Generate a secure secret with: openssl rand -base64 32'
    );
  }
  if (secret.length < 32) {
    throw new Error(
      'CRITICAL: JWT_SECRET must be at least 32 characters long. ' +
      'Current length: ' + secret.length
    );
  }
  return new TextEncoder().encode(secret);
}

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
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: ['HS256'],
    });

    // Validate that payload has required fields
    if (typeof payload.userId === 'string' && typeof payload.email === 'string') {
      return payload as unknown as JWTPayload;
    }

    return null;
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
    .sign(getJwtSecret());

  return token;
}

/**
 * Check if token is expired
 */
export function isTokenExpired(exp?: number): boolean {
  if (!exp) return true;
  return Date.now() >= exp * 1000;
}

/**
 * Sign a short-lived "pending" token (for 2FA challenge, email verification gate, etc.)
 * Scope field distinguishes these from full auth tokens.
 */
export async function signPendingToken(
  payload: Record<string, unknown>,
  expiresIn: string = "5m"
): Promise<string> {
  return new SignJWT({ ...payload, scope: "pending" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getJwtSecret());
}

/**
 * Verify a pending token. Returns the decoded payload or null.
 */
export async function verifyPendingToken(
  token: string
): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), { algorithms: ["HS256"] });
    if (payload.scope !== "pending") return null;
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}
