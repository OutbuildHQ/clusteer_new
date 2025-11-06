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
      const verified = await verifyToken('invalid-token');

      expect(verified).toBeNull();
    });

    it('should return null for empty token', async () => {
      const verified = await verifyToken('');

      expect(verified).toBeNull();
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
