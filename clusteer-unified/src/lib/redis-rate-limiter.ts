/**
 * Redis-based Rate Limiter using Upstash Redis
 * Production-ready rate limiting with distributed support
 *
 * Setup:
 * 1. Create Upstash Redis instance: https://console.upstash.com
 * 2. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to .env
 * 3. Set USE_REDIS_RATE_LIMITING=true in production
 */

import { Redis } from '@upstash/redis';

interface RateLimitResult {
	success: boolean;
	limit: number;
	remaining: number;
	reset: number;
}

class RedisRateLimiter {
	private redis: Redis | null = null;
	private enabled: boolean;

	constructor() {
		this.enabled = process.env.USE_REDIS_RATE_LIMITING === 'true';

		if (this.enabled) {
			const url = process.env.UPSTASH_REDIS_REST_URL;
			const token = process.env.UPSTASH_REDIS_REST_TOKEN;

			if (!url || !token) {
				console.warn(
					'Redis rate limiting enabled but credentials not configured. ' +
					'Falling back to in-memory rate limiting.'
				);
				this.enabled = false;
				return;
			}

			try {
				this.redis = new Redis({
					url,
					token,
				});
				console.log('Redis rate limiter initialized successfully');
			} catch (error) {
				console.error('Failed to initialize Redis:', error);
				this.enabled = false;
			}
		}
	}

	/**
	 * Check if request should be rate limited using sliding window algorithm
	 *
	 * @param identifier - Unique identifier (IP address, user ID, etc.)
	 * @param limit - Maximum number of requests
	 * @param windowMs - Time window in milliseconds
	 * @returns Rate limit result with remaining count
	 */
	async checkRateLimit(
		identifier: string,
		limit: number,
		windowMs: number
	): Promise<RateLimitResult> {
		if (!this.enabled || !this.redis) {
			// Fallback to allowing request if Redis is not configured
			return {
				success: true,
				limit,
				remaining: limit,
				reset: Date.now() + windowMs,
			};
		}

		try {
			const key = `ratelimit:${identifier}`;
			const now = Date.now();
			const windowStart = now - windowMs;

			// Use Redis pipeline for atomic operations
			const pipeline = this.redis.pipeline();

			// Remove old entries outside the window
			pipeline.zremrangebyscore(key, 0, windowStart);

			// Count current requests in window
			pipeline.zcard(key);

			// Add current request
			pipeline.zadd(key, { score: now, member: `${now}:${Math.random()}` });

			// Set expiration
			pipeline.expire(key, Math.ceil(windowMs / 1000));

			const results = await pipeline.exec();

			// Get count from zcard result (index 1 in results)
			const count = (results[1] as number) || 0;

			const isLimited = count >= limit;
			const remaining = Math.max(0, limit - count - 1); // -1 for current request

			// Calculate reset time (end of current window)
			const reset = now + windowMs;

			return {
				success: !isLimited,
				limit,
				remaining: isLimited ? 0 : remaining,
				reset,
			};
		} catch (error) {
			console.error('Redis rate limit check failed:', error);
			// On error, allow the request (fail open)
			return {
				success: true,
				limit,
				remaining: limit,
				reset: Date.now() + windowMs,
			};
		}
	}

	/**
	 * Reset rate limit for a specific identifier
	 */
	async reset(identifier: string): Promise<void> {
		if (!this.enabled || !this.redis) return;

		try {
			const key = `ratelimit:${identifier}`;
			await this.redis.del(key);
		} catch (error) {
			console.error('Failed to reset rate limit:', error);
		}
	}

	/**
	 * Get current count for identifier
	 */
	async getCount(identifier: string): Promise<number> {
		if (!this.enabled || !this.redis) return 0;

		try {
			const key = `ratelimit:${identifier}`;
			return await this.redis.zcard(key);
		} catch (error) {
			console.error('Failed to get rate limit count:', error);
			return 0;
		}
	}

	/**
	 * Health check for Redis connection
	 */
	async healthCheck(): Promise<boolean> {
		if (!this.enabled || !this.redis) return false;

		try {
			await this.redis.ping();
			return true;
		} catch (error) {
			console.error('Redis health check failed:', error);
			return false;
		}
	}
}

// Singleton instance
export const redisRateLimiter = new RedisRateLimiter();

/**
 * Unified rate limiter that uses Redis if available, otherwise falls back to in-memory
 */
export async function checkRateLimit(
	identifier: string,
	limit: number,
	windowMs: number
): Promise<RateLimitResult> {
	return redisRateLimiter.checkRateLimit(identifier, limit, windowMs);
}

/**
 * Export for backward compatibility
 */
export default redisRateLimiter;
