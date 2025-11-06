import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import rateLimiter, { getClientIdentifier } from "@/lib/rate-limiter";

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
	const token = request.cookies.get("auth_token")?.value;

	if (!token) {
		return { user: null, error: "Unauthorized" };
	}

	try {
		const { data: { user }, error } = await supabase.auth.getUser(token);

		if (error || !user) {
			return { user: null, error: "Invalid or expired token" };
		}

		return { user, error: null };
	} catch (error) {
		console.error("Authentication error:", error);
		return { user: null, error: "Authentication failed" };
	}
}

/**
 * Apply rate limiting to request
 */
function applyRateLimit(
	request: NextRequest,
	limit: number,
	windowMs: number
): NextResponse | null {
	const identifier = getClientIdentifier(request);

	if (rateLimiter.isRateLimited(identifier, limit, windowMs)) {
		const resetTime = rateLimiter.getResetTime(identifier);
		const retryAfter = resetTime ? Math.ceil((resetTime - Date.now()) / 1000) : 60;

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
					"X-RateLimit-Limit": limit.toString(),
					"X-RateLimit-Remaining": "0",
				},
			}
		);
	}

	return null;
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
				const rateLimitResponse = applyRateLimit(
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

			// Add rate limit headers if configured
			if (options.rateLimit) {
				const identifier = getClientIdentifier(request);
				const remaining = rateLimiter.getRemaining(identifier, options.rateLimit.limit);
				const resetTime = rateLimiter.getResetTime(identifier);

				response.headers.set("X-RateLimit-Limit", options.rateLimit.limit.toString());
				response.headers.set("X-RateLimit-Remaining", remaining.toString());
				if (resetTime) {
					response.headers.set("X-RateLimit-Reset", Math.ceil(resetTime / 1000).toString());
				}
			}

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
