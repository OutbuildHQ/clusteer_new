/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";

// Mock Firebase modules before importing the route
jest.mock("@/lib/firebase", () => ({
	isFirebaseConfigured: true,
}));

const mockLoginWithFirebase = jest.fn();
jest.mock("@/lib/auth-firebase", () => ({
	loginWithFirebase: (...args: any[]) => mockLoginWithFirebase(...args),
}));

jest.mock("@/lib/rate-limiter", () => ({
	rateLimit: jest.fn(() => null),
	RateLimitPresets: {
		strict: { maxRequests: 5, windowMs: 60000 },
	},
}));

import { POST } from "../route";

function makePostRequest(body?: any): NextRequest {
	return new NextRequest(new URL("/api/auth-firebase/login", "http://localhost:3000"), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});
}

describe("POST /api/auth-firebase/login", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("returns 503 when Firebase not configured", async () => {
		// Temporarily override the mock
		jest.resetModules();
		jest.doMock("@/lib/firebase", () => ({
			isFirebaseConfigured: false,
		}));
		jest.doMock("@/lib/auth-firebase", () => ({
			loginWithFirebase: mockLoginWithFirebase,
		}));
		jest.doMock("@/lib/rate-limiter", () => ({
			rateLimit: jest.fn(() => null),
			RateLimitPresets: { strict: {} },
		}));

		const { POST: POST2 } = require("../route");
		const response = await POST2(makePostRequest({ email: "test@test.com", password: "pass" }));
		expect(response.status).toBe(503);
	});

	it("returns 400 when email or password missing", async () => {
		const response = await POST(makePostRequest({ email: "test@test.com" }));
		expect(response.status).toBe(400);
		const body = await response.json();
		expect(body.message).toBe("Email and password are required");
	});

	it("returns 400 for empty body fields", async () => {
		const response = await POST(makePostRequest({ email: "", password: "" }));
		expect(response.status).toBe(400);
	});

	it("returns 200 with token on successful login", async () => {
		mockLoginWithFirebase.mockResolvedValue({
			user: { id: "uid-1", email: "test@test.com", username: "test" },
			token: "firebase-token-123",
		});

		const response = await POST(
			makePostRequest({ email: "test@test.com", password: "password123" })
		);
		expect(response.status).toBe(200);

		const body = await response.json();
		expect(body.status).toBe(true);
		expect(body.token).toBe("firebase-token-123");
		expect(body.data.email).toBe("test@test.com");
	});

	it("sets auth_token cookie on success", async () => {
		mockLoginWithFirebase.mockResolvedValue({
			user: { id: "uid-1", email: "test@test.com" },
			token: "firebase-token-123",
		});

		const response = await POST(
			makePostRequest({ email: "test@test.com", password: "password123" })
		);

		const setCookie = response.headers.get("set-cookie");
		expect(setCookie).toContain("auth_token=firebase-token-123");
	});

	it("returns 401 on Firebase auth failure", async () => {
		mockLoginWithFirebase.mockRejectedValue(new Error("Invalid credentials"));

		const errorSpy = jest.spyOn(console, "error").mockImplementation();
		const response = await POST(
			makePostRequest({ email: "test@test.com", password: "wrong" })
		);
		expect(response.status).toBe(401);
		const body = await response.json();
		expect(body.message).toBe("Invalid credentials");
		errorSpy.mockRestore();
	});
});
