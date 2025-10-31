/**
 * Simple in-memory rate limiter for API routes
 * For production, consider using Redis-based rate limiting
 */

interface RateLimitEntry {
	count: number;
	resetTime: number;
}

class RateLimiter {
	private requests: Map<string, RateLimitEntry> = new Map();
	private cleanupInterval: NodeJS.Timeout;

	constructor() {
		// Clean up expired entries every minute
		this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
	}

	/**
	 * Check if request should be rate limited
	 * @param identifier - Unique identifier (IP address, user ID, etc.)
	 * @param limit - Maximum number of requests
	 * @param windowMs - Time window in milliseconds
	 * @returns true if rate limit exceeded
	 */
	isRateLimited(identifier: string, limit: number, windowMs: number): boolean {
		const now = Date.now();
		const entry = this.requests.get(identifier);

		if (!entry || now > entry.resetTime) {
			// New window - allow request
			this.requests.set(identifier, {
				count: 1,
				resetTime: now + windowMs,
			});
			return false;
		}

		if (entry.count >= limit) {
			// Rate limit exceeded
			return true;
		}

		// Increment count
		entry.count++;
		this.requests.set(identifier, entry);
		return false;
	}

	/**
	 * Get remaining requests for identifier
	 */
	getRemaining(identifier: string, limit: number): number {
		const entry = this.requests.get(identifier);
		if (!entry) return limit;

		const now = Date.now();
		if (now > entry.resetTime) return limit;

		return Math.max(0, limit - entry.count);
	}

	/**
	 * Get reset time for identifier
	 */
	getResetTime(identifier: string): number | null {
		const entry = this.requests.get(identifier);
		if (!entry) return null;

		const now = Date.now();
		if (now > entry.resetTime) return null;

		return entry.resetTime;
	}

	/**
	 * Clean up expired entries
	 */
	private cleanup(): void {
		const now = Date.now();
		for (const [key, entry] of this.requests.entries()) {
			if (now > entry.resetTime) {
				this.requests.delete(key);
			}
		}
	}

	/**
	 * Clear all entries (for testing)
	 */
	clear(): void {
		this.requests.clear();
	}

	/**
	 * Cleanup interval on shutdown
	 */
	destroy(): void {
		clearInterval(this.cleanupInterval);
	}
}

// Singleton instance
const rateLimiter = new RateLimiter();

export default rateLimiter;

// Rate limit configurations
export const RATE_LIMITS = {
	// Auth endpoints - stricter limits
	LOGIN: { limit: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
	REGISTER: { limit: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
	VERIFY_OTP: { limit: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
	FORGOT_PASSWORD: { limit: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour

	// API endpoints - moderate limits
	API_DEFAULT: { limit: 100, windowMs: 60 * 1000 }, // 100 requests per minute

	// Wallet operations - moderate limits
	WALLET_OPERATIONS: { limit: 10, windowMs: 60 * 1000 }, // 10 per minute
};

/**
 * Helper function to get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
	// Try to get IP from headers (works with proxies)
	const forwarded = request.headers.get("x-forwarded-for");
	const realIp = request.headers.get("x-real-ip");

	if (forwarded) {
		return forwarded.split(",")[0].trim();
	}

	if (realIp) {
		return realIp;
	}

	// Fallback - not ideal but works for basic rate limiting
	return "unknown";
}

/**
 * Rate limit middleware wrapper for API routes
 */
export function withRateLimit(
	handler: (request: Request) => Promise<Response>,
	config: { limit: number; windowMs: number }
) {
	return async (request: Request): Promise<Response> => {
		const identifier = getClientIdentifier(request);

		if (rateLimiter.isRateLimited(identifier, config.limit, config.windowMs)) {
			const resetTime = rateLimiter.getResetTime(identifier);
			const retryAfter = resetTime ? Math.ceil((resetTime - Date.now()) / 1000) : 60;

			return new Response(
				JSON.stringify({
					status: false,
					message: "Too many requests. Please try again later.",
					retryAfter,
				}),
				{
					status: 429,
					headers: {
						"Content-Type": "application/json",
						"Retry-After": retryAfter.toString(),
						"X-RateLimit-Limit": config.limit.toString(),
						"X-RateLimit-Remaining": "0",
						"X-RateLimit-Reset": resetTime?.toString() || "",
					},
				}
			);
		}

		// Call the actual handler
		const response = await handler(request);

		// Add rate limit headers to successful responses
		const remaining = rateLimiter.getRemaining(identifier, config.limit);
		const resetTime = rateLimiter.getResetTime(identifier);

		if (response.headers) {
			response.headers.set("X-RateLimit-Limit", config.limit.toString());
			response.headers.set("X-RateLimit-Remaining", remaining.toString());
			if (resetTime) {
				response.headers.set("X-RateLimit-Reset", resetTime.toString());
			}
		}

		return response;
	};
}
