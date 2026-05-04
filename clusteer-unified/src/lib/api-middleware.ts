import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/api-helpers";
import { rateLimit } from "@/lib/rate-limiter";
import { checkRateLimit as redisCheckRateLimit } from "@/lib/redis-rate-limiter";

export interface AuthenticatedRequest extends NextRequest {
	user?: {
		id: string;
		email?: string;
	};
}

export type ApiHandler = (
	request: NextRequest,
	context?: { params: Record<string, string> }
) => Promise<NextResponse>;

export interface MiddlewareOptions {
	requireAuth?: boolean;
	rateLimit?: {
		limit: number;
		windowMs: number;
	};
}

/**
 * Standard error response format
 */
export function errorResponse(message: string, status: number = 400) {
	return NextResponse.json(
		{ status: false, message },
		{ status }
	);
}

/**
 * Standard success response format
 */
export function successResponse(data: unknown, message: string = "Success") {
	return NextResponse.json({
		status: true,
		message,
		data,
	});
}

/**
 * Authenticate user from request
 */
export async function authenticateRequest(request: NextRequest) {
	const auth = getAuthFromRequest(request);

	if (!auth) {
		return { user: null, error: "Unauthorized" };
	}

	return { user: { id: auth.userId }, error: null };
}

/**
 * Apply rate limiting to request
 * Uses Redis if configured, otherwise falls back to in-memory
 */
async function applyRateLimit(
	request: NextRequest,
	limit: number,
	windowMs: number
): Promise<NextResponse | null> {
	const useRedis = process.env.USE_REDIS_RATE_LIMITING === 'true';

	if (useRedis) {
		// Get client identifier for Redis
		const forwarded = request.headers.get("x-forwarded-for");
		const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
		const path = new URL(request.url).pathname;
		const identifier = `${ip}:${path}`;

		// Use Redis-based rate limiting
		const result = await redisCheckRateLimit(identifier, limit, windowMs);

		if (!result.success) {
			const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);

			return NextResponse.json(
				{
					status: false,
					message: "Too many requests. Please try again later.",
					retryAfter,
				},
				{
					status: 429,
					headers: {
						"Retry-After": retryAfter.toString(),
						"X-RateLimit-Limit": result.limit.toString(),
						"X-RateLimit-Remaining": result.remaining.toString(),
						"X-RateLimit-Reset": Math.ceil(result.reset / 1000).toString(),
					},
				}
			);
		}

		return null;
	} else {
		// Use in-memory rate limiting (development/fallback)
		return rateLimit(request, { maxRequests: limit, windowMs });
	}
}

/**
 * Middleware wrapper for API routes
 * Handles authentication, rate limiting, and error handling
 */
export function withMiddleware(
	handler: ApiHandler,
	options: MiddlewareOptions = {}
) {
	return async (
		request: NextRequest,
		context?: { params: Record<string, string> }
	): Promise<NextResponse> => {
		try {
			// Apply rate limiting if configured
			if (options.rateLimit) {
				const rateLimitResponse = await applyRateLimit(
					request,
					options.rateLimit.limit,
					options.rateLimit.windowMs
				);

				if (rateLimitResponse) {
					return rateLimitResponse;
				}
			}

			// Apply authentication if required
			if (options.requireAuth) {
				const { user, error } = await authenticateRequest(request);

				if (error || !user) {
					return errorResponse(error || "Unauthorized", 401);
				}

				// Attach user to request for use in handler
				(request as AuthenticatedRequest).user = user;
			}

			// Call the actual handler
			const response = await handler(request, context);

			return response;
		} catch (error) {
			console.error("API Error:", error);
			return errorResponse("An unexpected error occurred", 500);
		}
	};
}

/**
 * Validate request body against schema
 */
export function validateBody<T>(
	body: unknown,
	requiredFields: string[]
): { valid: boolean; data?: T; error?: string } {
	if (!body || typeof body !== "object") {
		return { valid: false, error: "Invalid request body" };
	}

	const missingFields = requiredFields.filter(
		(field) => !(field in (body as Record<string, unknown>))
	);

	if (missingFields.length > 0) {
		return {
			valid: false,
			error: `Missing required fields: ${missingFields.join(", ")}`,
		};
	}

	return { valid: true, data: body as T };
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
	return input
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#x27;")
		.replace(/\//g, "&#x2F;");
}
