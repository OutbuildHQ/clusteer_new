/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";

const mockRegisterWithFirebase = jest.fn();

jest.mock("@/lib/firebase", () => ({
	isFirebaseConfigured: true,
}));

jest.mock("@/lib/auth-firebase", () => ({
	registerWithFirebase: (...args: any[]) => mockRegisterWithFirebase(...args),
}));

jest.mock("@/lib/rate-limiter", () => ({
	rateLimit: jest.fn(() => null),
	RateLimitPresets: {
		strict: { maxRequests: 5, windowMs: 60000 },
	},
}));

import { POST } from "../route";

function makePostRequest(body?: any): NextRequest {
	return new NextRequest(new URL("/api/auth-firebase/register", "http://localhost:3000"), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});
}

describe("POST /api/auth-firebase/register", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("returns 400 when required fields missing", async () => {
		const response = await POST(makePostRequest({ email: "test@test.com" }));
		expect(response.status).toBe(400);
		const body = await response.json();
		expect(body.message).toBe("All fields are required");
	});

	it("returns 400 for invalid JSON body", async () => {
		const req = new NextRequest(new URL("/api/auth-firebase/register", "http://localhost:3000"), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: "not-json{{{",
		});
		const response = await POST(req);
		expect(response.status).toBe(400);
		const body = await response.json();
		expect(body.message).toBe("Invalid request body");
	});

	it("returns 200 with user data on success", async () => {
		mockRegisterWithFirebase.mockResolvedValue({
			user: {
				username: "newuser",
				email: "new@test.com",
				phone: "08012345678",
			},
			token: "firebase-token",
		});

		const response = await POST(
			makePostRequest({
				username: "newuser",
				email: "new@test.com",
				phone: "08012345678",
				password: "password123",
			})
		);
		expect(response.status).toBe(200);

		const body = await response.json();
		expect(body.status).toBe(true);
		expect(body.data.username).toBe("newuser");
		expect(body.data.email).toBe("new@test.com");
	});

	it("returns 400 on Firebase registration failure", async () => {
		mockRegisterWithFirebase.mockRejectedValue(
			new Error("Email already in use")
		);

		const errorSpy = jest.spyOn(console, "error").mockImplementation();
		const response = await POST(
			makePostRequest({
				username: "existing",
				email: "existing@test.com",
				phone: "08012345678",
				password: "password123",
			})
		);
		expect(response.status).toBe(400);
		const body = await response.json();
		expect(body.message).toBe("Email already in use");
		errorSpy.mockRestore();
	});
});
