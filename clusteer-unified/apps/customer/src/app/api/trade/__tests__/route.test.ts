/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { createMockFirebaseToken } from "@/test-helpers/mock-next-request";

jest.mock("@/lib/rate-limiter", () => ({
	rateLimit: jest.fn(() => null),
	RateLimitPresets: {
		moderate: { maxRequests: 30, windowMs: 60000 },
	},
}));

import { POST } from "../route";

const mockFetch = jest.fn();
global.fetch = mockFetch;

function makePostRequest(
	body?: any,
	cookies: Record<string, string> = {}
): NextRequest {
	const cookieHeader = Object.entries(cookies)
		.map(([k, v]) => `${k}=${v}`)
		.join("; ");

	return new NextRequest(new URL("/api/trade", "http://localhost:3000"), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...(cookieHeader ? { Cookie: cookieHeader } : {}),
		},
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});
}

describe("POST /api/trade", () => {
	const validToken = createMockFirebaseToken();

	beforeEach(() => {
		jest.clearAllMocks();
		process.env.BLOCKCHAIN_ENGINE_API_KEY = "test-api-key";
		process.env.BLOCKCHAIN_ENGINE_URL = "http://localhost:8000";
	});

	it("returns 401 when no auth_token cookie", async () => {
		const response = await POST(makePostRequest({ side: "buy", amount: 100, chain: "solana" }));
		expect(response.status).toBe(401);
	});

	it("returns 401 for invalid token", async () => {
		const response = await POST(
			makePostRequest(
				{ side: "buy", amount: 100, chain: "solana" },
				{ auth_token: "bad" }
			)
		);
		expect(response.status).toBe(401);
	});

	it("returns 400 for invalid JSON body", async () => {
		const req = new NextRequest(new URL("/api/trade", "http://localhost:3000"), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Cookie: `auth_token=${validToken}`,
			},
			body: "not-json{{{",
		});
		const response = await POST(req);
		expect(response.status).toBe(400);
	});

	it("returns 400 when required fields missing", async () => {
		const response = await POST(
			makePostRequest({ side: "buy" }, { auth_token: validToken })
		);
		expect(response.status).toBe(400);
		const body = await response.json();
		expect(body.message).toBe("Missing required fields");
	});

	it("returns 400 for non-positive amount", async () => {
		const response = await POST(
			makePostRequest(
				{ side: "buy", amount: -10, chain: "solana", walletAddress: "0x1" },
				{ auth_token: validToken }
			)
		);
		expect(response.status).toBe(400);
		const body = await response.json();
		expect(body.message).toContain("positive");
	});

	it("returns 400 for amount > 1,000,000", async () => {
		const response = await POST(
			makePostRequest(
				{ side: "buy", amount: 1000001, chain: "solana", walletAddress: "0x1" },
				{ auth_token: validToken }
			)
		);
		expect(response.status).toBe(400);
		const body = await response.json();
		expect(body.message).toContain("exceeds");
	});

	it("returns 400 for invalid side", async () => {
		const response = await POST(
			makePostRequest(
				{ side: "trade", amount: 100, chain: "solana" },
				{ auth_token: validToken }
			)
		);
		expect(response.status).toBe(400);
		const body = await response.json();
		expect(body.message).toContain("Invalid side");
	});

	it("returns 400 for invalid chain", async () => {
		const response = await POST(
			makePostRequest(
				{ side: "buy", amount: 100, chain: "dogecoin", walletAddress: "0x1" },
				{ auth_token: validToken }
			)
		);
		expect(response.status).toBe(400);
		const body = await response.json();
		expect(body.message).toContain("Invalid chain");
	});

	it("returns 400 when sell order missing signedTransaction", async () => {
		const response = await POST(
			makePostRequest(
				{ side: "sell", amount: 100, chain: "solana" },
				{ auth_token: validToken }
			)
		);
		expect(response.status).toBe(400);
		const body = await response.json();
		expect(body.message).toContain("Signed transaction");
	});

	it("returns 400 when buy order missing walletAddress", async () => {
		const response = await POST(
			makePostRequest(
				{ side: "buy", amount: 100, chain: "solana" },
				{ auth_token: validToken }
			)
		);
		expect(response.status).toBe(400);
		const body = await response.json();
		expect(body.message).toContain("Wallet address");
	});

	it("returns 503 when BLOCKCHAIN_ENGINE_API_KEY not set", async () => {
		process.env.BLOCKCHAIN_ENGINE_API_KEY = undefined as any;
		const response = await POST(
			makePostRequest(
				{ side: "buy", amount: 100, chain: "solana", walletAddress: "0x1" },
				{ auth_token: validToken }
			)
		);
		expect(response.status).toBe(503);
	});

	it("returns 200 with trade data on success", async () => {
		mockFetch.mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({ order_id: "order-123", status: "created" }),
		});

		const response = await POST(
			makePostRequest(
				{ side: "buy", amount: 100, chain: "solana", walletAddress: "0x1" },
				{ auth_token: validToken }
			)
		);
		expect(response.status).toBe(200);

		const body = await response.json();
		expect(body.status).toBe(true);
		expect(body.data.order_id).toBe("order-123");
	});
});
