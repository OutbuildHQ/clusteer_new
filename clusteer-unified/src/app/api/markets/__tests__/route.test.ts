/**
 * Markets route tests
 *
 * Each test that needs fresh cache state uses jest.isolateModules.
 *
 * @jest-environment node
 */

import { NextRequest } from "next/server";

const mockCoinGeckoData = [
	{
		id: "bitcoin",
		name: "Bitcoin",
		symbol: "btc",
		image: "https://example.com/btc.png",
		current_price: 50000,
		price_change_percentage_24h: 2.5,
		total_volume: 30000000000,
		market_cap: 900000000000,
		high_24h: 51000,
		low_24h: 49000,
		ath: 69000,
		atl: 67,
	},
];

function makeGetRequest(params: Record<string, string> = {}): NextRequest {
	const url = new URL("/api/markets", "http://localhost:3000");
	Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
	return new NextRequest(url, { method: "GET" });
}

describe("GET /api/markets", () => {
	it("returns 200 with transformed market data", async () => {
		const mockGet = jest.fn().mockResolvedValue({ data: mockCoinGeckoData });
		jest.doMock("axios", () => ({ __esModule: true, default: { get: mockGet } }));

		// Fresh import with fresh cache
		const { GET } = require("../route");
		const response = await GET(makeGetRequest());
		expect(response.status).toBe(200);

		const body = await response.json();
		expect(body.status).toBe(true);
		expect(body.data).toHaveLength(1);
		expect(body.data[0].name).toBe("Bitcoin");
		expect(body.data[0].symbol).toBe("BTC");
		expect(body.data[0].price).toBe(50000);
		expect(body.data[0].rank).toBe(1);
		expect(body.cached).toBe(false);

		jest.restoreAllMocks();
	});

	it("respects limit and currency query params", async () => {
		jest.resetModules();
		const mockGet = jest.fn().mockResolvedValue({ data: mockCoinGeckoData });
		jest.doMock("axios", () => ({ __esModule: true, default: { get: mockGet } }));

		const { GET } = require("../route");
		await GET(makeGetRequest({ limit: "10", currency: "eur" }));

		expect(mockGet).toHaveBeenCalledWith(
			expect.stringContaining("/coins/markets"),
			expect.objectContaining({
				params: expect.objectContaining({
					vs_currency: "eur",
					per_page: 10,
				}),
			})
		);

		jest.restoreAllMocks();
	});

	it("returns 429 when CoinGecko rate limits", async () => {
		jest.resetModules();
		const mockGet = jest.fn().mockRejectedValue({
			response: { status: 429 },
			code: undefined,
		});
		jest.doMock("axios", () => ({ __esModule: true, default: { get: mockGet } }));

		const { GET } = require("../route");
		const errorSpy = jest.spyOn(console, "error").mockImplementation();
		const response = await GET(makeGetRequest());
		errorSpy.mockRestore();

		expect(response.status).toBe(429);
		const body = await response.json();
		expect(body.message).toContain("Rate limit");

		jest.restoreAllMocks();
	});

	it("returns 503 on network connection error", async () => {
		jest.resetModules();
		const mockGet = jest.fn().mockRejectedValue({
			code: "ECONNREFUSED",
			response: undefined,
		});
		jest.doMock("axios", () => ({ __esModule: true, default: { get: mockGet } }));

		const { GET } = require("../route");
		const errorSpy = jest.spyOn(console, "error").mockImplementation();
		const response = await GET(makeGetRequest());
		errorSpy.mockRestore();

		expect(response.status).toBe(503);

		jest.restoreAllMocks();
	});
});
