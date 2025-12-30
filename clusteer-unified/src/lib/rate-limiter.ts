/**
 * Rate Limiting Implementation
 * Protects API endpoints from abuse and DDoS attacks
 */

import { NextRequest, NextResponse } from "next/server";

// In-memory store for development (use Redis for production)
const rateLimitStore = new Map<
	string,
	{
		requests: number[];
		resetTime: number;
	}
>();

export interface RateLimitConfig {
	/**
	 * Maximum number of requests allowed in the time window
	 * @default 100
	 */
	maxRequests?: number;

	/**
	 * Time window in milliseconds
	 * @default 60000 (1 minute)
	 */
	windowMs?: number;

	/**
	 * Custom key generator function
	 * @default Uses IP address + path
	 */
	keyGenerator?: (request: NextRequest) => string;

	/**
	 * Custom response when rate limit is exceeded
	 */
	onRateLimitExceeded?: (request: NextRequest) => NextResponse;
}

/**
 * Get client IP address from request
 */
function getClientIp(request: NextRequest): string {
	// Try to get IP from various headers (for proxies/load balancers)
	const forwarded = request.headers.get("x-forwarded-for");
	const realIp = request.headers.get("x-real-ip");
	const cfConnectingIp = request.headers.get("cf-connecting-ip");

	if (forwarded) {
		// x-forwarded-for can contain multiple IPs, take the first one
		return forwarded.split(",")[0].trim();
	}

	if (realIp) {
		return realIp;
	}

	if (cfConnectingIp) {
		return cfConnectingIp;
	}

	// Fallback to localhost for development
	return "127.0.0.1";
}

/**
 * Default key generator: combines IP address and request path
 */
function defaultKeyGenerator(request: NextRequest): string {
	const ip = getClientIp(request);
	const path = new URL(request.url).pathname;
	return `${ip}:${path}`;
}

/**
 * Rate limiting middleware
 * 
 * @example
 * ```typescript
 * export async function GET(request: NextRequest) {
 *   const rateLimitResponse = rateLimit(request, {
 *     maxRequests: 10,
 *     windowMs: 60000 // 10 requests per minute
 *   });
 *   
 *   if (rateLimitResponse) {
 *     return rateLimitResponse;
 *   }
 *   
 *   // Continue with normal request handling...
 * }
 * ```
 */
export function rateLimit(
	request: NextRequest,
	config: RateLimitConfig = {}
): NextResponse | null {
	const {
		maxRequests = 100,
		windowMs = 60000, // 1 minute default
		keyGenerator = defaultKeyGenerator,
		onRateLimitExceeded,
	} = config;

	const key = keyGenerator(request);
	const now = Date.now();

	// Get or create rate limit entry
	let rateLimitEntry = rateLimitStore.get(key);

	if (!rateLimitEntry || now > rateLimitEntry.resetTime) {
		// Create new entry or reset expired entry
		rateLimitEntry = {
			requests: [now],
			resetTime: now + windowMs,
		};
		rateLimitStore.set(key, rateLimitEntry);
		return null; // Allow request
	}

	// Remove old requests outside the window
	rateLimitEntry.requests = rateLimitEntry.requests.filter(
		(timestamp) => timestamp > now - windowMs
	);

	// Check if limit exceeded
	if (rateLimitEntry.requests.length >= maxRequests) {
		const resetInSeconds = Math.ceil((rateLimitEntry.resetTime - now) / 1000);

		// Log rate limit violation
		console.warn(`Rate limit exceeded for ${key}`);

		// Return custom response if provided
		if (onRateLimitExceeded) {
			return onRateLimitExceeded(request);
		}

		// Default rate limit response
		return NextResponse.json(
			{
				status: false,
				message: "Too many requests. Please try again later.",
				retryAfter: resetInSeconds,
			},
			{
				status: 429,
				headers: {
					"Retry-After": resetInSeconds.toString(),
					"X-RateLimit-Limit": maxRequests.toString(),
					"X-RateLimit-Remaining": "0",
					"X-RateLimit-Reset": rateLimitEntry.resetTime.toString(),
				},
			}
		);
	}

	// Add current request
	rateLimitEntry.requests.push(now);

	// Update headers for successful request
	const remaining = maxRequests - rateLimitEntry.requests.length;

	// Return null to indicate request should proceed
	// Note: Next.js doesn't support modifying response headers in middleware easily
	// So we can't add rate limit headers to successful responses
	return null;
}

/**
 * Preset rate limit configurations for common use cases
 */
export const RateLimitPresets = {
	/**
	 * Strict rate limiting for sensitive endpoints (e.g., login, registration)
	 * 5 requests per minute
	 */
	strict: {
		maxRequests: 5,
		windowMs: 60000,
	} as RateLimitConfig,

	/**
	 * Moderate rate limiting for API endpoints
	 * 30 requests per minute
	 */
	moderate: {
		maxRequests: 30,
		windowMs: 60000,
	} as RateLimitConfig,

	/**
	 * Lenient rate limiting for public endpoints
	 * 100 requests per minute
	 */
	lenient: {
		maxRequests: 100,
		windowMs: 60000,
	} as RateLimitConfig,

	/**
	 * KYC submission rate limiting
	 * 3 requests per 24 hours
	 */
	kyc: {
		maxRequests: 3,
		windowMs: 24 * 60 * 60 * 1000, // 24 hours
	} as RateLimitConfig,
};

/**
 * Clean up old entries from rate limit store (call periodically)
 * This prevents memory leaks in production
 */
export function cleanupRateLimitStore(): void {
	const now = Date.now();
	for (const [key, entry] of rateLimitStore.entries()) {
		if (now > entry.resetTime) {
			rateLimitStore.delete(key);
		}
	}
}

// Auto-cleanup every 5 minutes
if (typeof window === "undefined") {
	// Server-side only
	setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}
