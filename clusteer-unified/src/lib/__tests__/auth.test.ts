/**
 * Auth Utilities Tests
 *
 * @jest-environment node
 */

// Mock jose to avoid ESM import issues with next/jest
const mockSign = jest.fn();
const mockJwtVerify = jest.fn();

jest.mock('jose', () => {
  class MockSignJWT {
    private payload: any;
    private header: any;
    constructor(payload: any) {
      this.payload = payload;
    }
    setProtectedHeader(header: any) {
      this.header = header;
      return this;
    }
    setIssuedAt() {
      return this;
    }
    setExpirationTime(_exp: string) {
      return this;
    }
    async sign(_secret: any) {
      const header = Buffer.from(JSON.stringify(this.header)).toString('base64');
      const payload = Buffer.from(
        JSON.stringify({
          ...this.payload,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 604800,
        })
      ).toString('base64');
      const signature = Buffer.from('test-signature').toString('base64');
      return `${header}.${payload}.${signature}`;
    }
  }

  return {
    SignJWT: MockSignJWT,
    jwtVerify: async (token: string, _secret: any) => {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid token');
      try {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        return { payload };
      } catch {
        throw new Error('Invalid token');
      }
    },
  };
});

import { generateToken, verifyToken, isTokenExpired } from '../auth';

describe('Auth Utilities', () => {
  describe('generateToken', () => {
    it('should generate a valid JWT token', async () => {
      const payload = {
        userId: 'test-user-id',
        email: 'test@example.com',
        username: 'testuser',
      };

      const token = await generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', async () => {
      const payload = {
        userId: 'test-user-id',
        email: 'test@example.com',
        username: 'testuser',
      };

      const token = await generateToken(payload);
      const verified = await verifyToken(token);

      expect(verified).toBeDefined();
      expect(verified?.userId).toBe(payload.userId);
      expect(verified?.email).toBe(payload.email);
      expect(verified?.username).toBe(payload.username);
    });

    it('should return null for invalid token', async () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();
      const verified = await verifyToken('invalid-token');
      expect(verified).toBeNull();
      errorSpy.mockRestore();
    });

    it('should return null for empty token', async () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();
      const verified = await verifyToken('');
      expect(verified).toBeNull();
      errorSpy.mockRestore();
    });
  });

  describe('isTokenExpired', () => {
    it('should return true for expired timestamp', () => {
      const pastTimestamp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      expect(isTokenExpired(pastTimestamp)).toBe(true);
    });

    it('should return false for future timestamp', () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      expect(isTokenExpired(futureTimestamp)).toBe(false);
    });

    it('should return true for undefined timestamp', () => {
      expect(isTokenExpired(undefined)).toBe(true);
    });
  });
});
