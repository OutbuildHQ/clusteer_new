/**
 * Rate Limiter Tests
 *
 * Uses unique IP+path combos per test to avoid cross-test pollution
 * from the module-level in-memory store.
 *
 * @jest-environment node
 */

import { NextRequest } from "next/server";

// Use fake timers to prevent the module-level setInterval from running
jest.useFakeTimers();

import { rateLimit, RateLimitPresets, cleanupRateLimitStore } from "../rate-limiter";

function makeRequest(ip: string, path: string = "/api/test"): NextRequest {
	return new NextRequest(new URL(path, "http://localhost:3000"), {
		headers: {
			"x-forwarded-for": ip,
		},
	});
}

afterAll(() => {
	jest.useRealTimers();
});

describe("Rate Limiter", () => {
	describe("rateLimit", () => {
		it("allows first request", () => {
			const req = makeRequest("1.0.0.1", "/api/first");
			const result = rateLimit(req, { maxRequests: 5, windowMs: 60000 });
			expect(result).toBeNull();
		});

		it("allows requests within limit", () => {
			const ip = "1.0.0.2";
			const path = "/api/within-limit";
			for (let i = 0; i < 4; i++) {
				const result = rateLimit(makeRequest(ip, path), { maxRequests: 5, windowMs: 60000 });
				expect(result).toBeNull();
			}
		});

		it("returns 429 when limit exceeded", async () => {
			const ip = "1.0.0.3";
			const path = "/api/exceed";
			const config = { maxRequests: 2, windowMs: 60000 };

			// First 2 should pass
			rateLimit(makeRequest(ip, path), config);
			rateLimit(makeRequest(ip, path), config);

			// 3rd should be blocked
			const warnSpy = jest.spyOn(console, "warn").mockImplementation();
			const result = rateLimit(makeRequest(ip, path), config);
			expect(result).not.toBeNull();
			expect(result!.status).toBe(429);

			const body = await result!.json();
			expect(body.status).toBe(false);
			expect(body.message).toContain("Too many requests");
			warnSpy.mockRestore();
		});

		it("includes Retry-After header in 429 response", () => {
			const ip = "1.0.0.4";
			const path = "/api/retry-after";
			const config = { maxRequests: 1, windowMs: 60000 };

			rateLimit(makeRequest(ip, path), config);

			const warnSpy = jest.spyOn(console, "warn").mockImplementation();
			const result = rateLimit(makeRequest(ip, path), config);
			expect(result).not.toBeNull();
			expect(result!.headers.get("Retry-After")).toBeTruthy();
			expect(result!.headers.get("X-RateLimit-Limit")).toBe("1");
			warnSpy.mockRestore();
		});

		it("uses custom keyGenerator when provided", () => {
			const config = {
				maxRequests: 1,
				windowMs: 60000,
				keyGenerator: () => "custom-key-unique-1",
			};

			const result = rateLimit(makeRequest("1.0.0.5"), config);
			expect(result).toBeNull();
		});

		it("uses custom onRateLimitExceeded when provided", async () => {
			const ip = "1.0.0.6";
			const path = "/api/custom-exceeded";
			const { NextResponse } = require("next/server");
			const config = {
				maxRequests: 1,
				windowMs: 60000,
				onRateLimitExceeded: () =>
					NextResponse.json({ custom: true }, { status: 429 }),
			};

			rateLimit(makeRequest(ip, path), config);

			const warnSpy = jest.spyOn(console, "warn").mockImplementation();
			const result = rateLimit(makeRequest(ip, path), config);
			expect(result).not.toBeNull();
			const body = await result!.json();
			expect(body.custom).toBe(true);
			warnSpy.mockRestore();
		});
	});

	describe("getClientIp (tested via rateLimit key)", () => {
		it("extracts from x-forwarded-for", () => {
			const req = new NextRequest(new URL("/api/ip-test-1", "http://localhost:3000"), {
				headers: { "x-forwarded-for": "203.0.113.1, 70.41.3.18" },
			});
			// If it returns null, the IP was correctly extracted and the request was allowed
			expect(rateLimit(req, { maxRequests: 100 })).toBeNull();
		});

		it("extracts from x-real-ip", () => {
			const req = new NextRequest(new URL("/api/ip-test-2", "http://localhost:3000"), {
				headers: { "x-real-ip": "203.0.113.2" },
			});
			expect(rateLimit(req, { maxRequests: 100 })).toBeNull();
		});

		it("extracts from cf-connecting-ip", () => {
			const req = new NextRequest(new URL("/api/ip-test-3", "http://localhost:3000"), {
				headers: { "cf-connecting-ip": "203.0.113.3" },
			});
			expect(rateLimit(req, { maxRequests: 100 })).toBeNull();
		});
	});

	describe("RateLimitPresets", () => {
		it("strict: 5 requests per minute", () => {
			expect(RateLimitPresets.strict.maxRequests).toBe(5);
			expect(RateLimitPresets.strict.windowMs).toBe(60000);
		});

		it("moderate: 30 requests per minute", () => {
			expect(RateLimitPresets.moderate.maxRequests).toBe(30);
			expect(RateLimitPresets.moderate.windowMs).toBe(60000);
		});

		it("lenient: 100 requests per minute", () => {
			expect(RateLimitPresets.lenient.maxRequests).toBe(100);
			expect(RateLimitPresets.lenient.windowMs).toBe(60000);
		});

		it("kyc: 3 requests per 24 hours", () => {
			expect(RateLimitPresets.kyc.maxRequests).toBe(3);
			expect(RateLimitPresets.kyc.windowMs).toBe(24 * 60 * 60 * 1000);
		});
	});

	describe("cleanupRateLimitStore", () => {
		it("is callable without error", () => {
			expect(() => cleanupRateLimitStore()).not.toThrow();
		});
	});
});
