/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { createMockFirebaseToken } from "@/test-helpers/mock-next-request";
import { GET } from "../route";

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

function makeGetRequest(cookies: Record<string, string> = {}): NextRequest {
	const cookieHeader = Object.entries(cookies)
		.map(([k, v]) => `${k}=${v}`)
		.join("; ");

	return new NextRequest(new URL("/api/wallet", "http://localhost:3000"), {
		method: "GET",
		headers: cookieHeader ? { Cookie: cookieHeader } : {},
	});
}

describe("GET /api/wallet", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		process.env.BLOCKCHAIN_ENGINE_API_KEY = "test-api-key";
		process.env.BLOCKCHAIN_ENGINE_URL = "http://localhost:8000";
	});

	it("returns 401 when no auth_token cookie", async () => {
		const response = await GET(makeGetRequest());
		expect(response.status).toBe(401);
	});

	it("returns 401 for invalid token format", async () => {
		const response = await GET(makeGetRequest({ auth_token: "bad-token" }));
		expect(response.status).toBe(401);
		const body = await response.json();
		expect(body.message).toBe("Invalid token format");
	});

	it("returns 401 for undecodable base64 payload", async () => {
		const response = await GET(
			makeGetRequest({ auth_token: "a.!!!.b" })
		);
		expect(response.status).toBe(401);
	});

	it("returns 500 when BLOCKCHAIN_ENGINE_API_KEY not set", async () => {
		process.env.BLOCKCHAIN_ENGINE_API_KEY = undefined as any;
		const token = createMockFirebaseToken();
		const response = await GET(makeGetRequest({ auth_token: token }));
		expect(response.status).toBe(500);

		const errorSpy = jest.spyOn(console, "error").mockImplementation();
		const body = await response.json();
		expect(body.message).toContain("not configured");
		errorSpy.mockRestore();
	});

	it("returns fallback wallets when Django is unreachable", async () => {
		const token = createMockFirebaseToken();
		// Wallet create and balance fetch both fail
		mockFetch.mockRejectedValue(new Error("ECONNREFUSED"));

		const logSpy = jest.spyOn(console, "log").mockImplementation();
		const response = await GET(makeGetRequest({ auth_token: token }));
		expect(response.status).toBe(200);

		const body = await response.json();
		expect(body.status).toBe(true);
		expect(body.walletAssets).toHaveLength(3);
		expect(body.walletAssets[0].balance).toBe(0);
		logSpy.mockRestore();
	});

	it("returns empty wallets when Django returns 404", async () => {
		const token = createMockFirebaseToken();
		// First call: wallet create (OK)
		mockFetch.mockResolvedValueOnce({ ok: true });
		// Second call: balance returns 404
		mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

		const logSpy = jest.spyOn(console, "log").mockImplementation();
		const response = await GET(makeGetRequest({ auth_token: token }));
		const body = await response.json();
		expect(body.walletAssets).toEqual([]);
		logSpy.mockRestore();
	});

	it("returns aggregated wallet balances from Django response", async () => {
		const token = createMockFirebaseToken();
		// First call: wallet create
		mockFetch.mockResolvedValueOnce({ ok: true });
		// Second call: balance
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				balances: {
					sol_usdt: "50.5",
					tron_usdt: "30.0",
					sol_usdc: "20.0",
				},
			}),
		});

		const logSpy = jest.spyOn(console, "log").mockImplementation();
		const response = await GET(makeGetRequest({ auth_token: token }));
		const body = await response.json();

		expect(body.status).toBe(true);
		const usdtWallet = body.walletAssets.find((w: any) => w.currency === "USDT");
		expect(usdtWallet).toBeDefined();
		expect(usdtWallet.balance).toBe(80.5); // 50.5 + 30.0
		logSpy.mockRestore();
	});
});
