/** @jest-environment node */
import type { NextRequest } from "next/server";
import { GET } from "../../apps/customer/src/app/api/order/route";
import { djangoFetch, getAuthFromRequest } from "../../packages/ui/src/lib/api-helpers";
jest.mock("../../packages/ui/src/lib/api-helpers", () => ({
	djangoFetch: jest.fn(),
	getAuthFromRequest: jest.fn(),
}));
jest.mock("next/server", () => ({
	NextResponse: {
		json: (body: unknown, init?: { status?: number }) => ({
			status: init?.status ?? 200,
			json: async () => body,
		}),
	},
}));
const request = { nextUrl: new URL("http://localhost/api/order?page=1") } as NextRequest;
beforeEach(() => {
	jest.resetAllMocks();
	(getAuthFromRequest as jest.Mock).mockReturnValue({ userId: "test-user" });
});
it("preserves unauthenticated access as unauthorized", async () => {
	(getAuthFromRequest as jest.Mock).mockReturnValue(null);
	const response = await GET(request);
	expect(response.status).toBe(401);
	expect(djangoFetch).not.toHaveBeenCalled();
});
it("distinguishes an upstream outage from a real empty order list", async () => {
	(djangoFetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });
	const response = await GET(request);
	expect(response.status).toBe(502);
	expect(await response.json()).toMatchObject({ status: false });
	(djangoFetch as jest.Mock).mockResolvedValue({
		ok: true,
		json: async () => ({ status: true, data: [] }),
	});
	const empty = await GET(request);
	expect(empty.status).toBe(200);
	expect(await empty.json()).toEqual({ status: true, data: [] });
});
it("returns a recoverable service error on connection failure", async () => {
	(djangoFetch as jest.Mock).mockRejectedValue(new Error("test outage"));
	const response = await GET(request);
	expect(response.status).toBe(503);
	expect(await response.json()).toMatchObject({ status: false });
});
