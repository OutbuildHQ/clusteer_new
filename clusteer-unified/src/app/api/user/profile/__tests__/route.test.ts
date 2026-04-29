/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { createMockFirebaseToken } from "@/test-helpers/mock-next-request";
import { GET } from "../route";

function makeGetRequest(cookies: Record<string, string> = {}): NextRequest {
	const cookieHeader = Object.entries(cookies)
		.map(([k, v]) => `${k}=${v}`)
		.join("; ");

	return new NextRequest(new URL("/api/user/profile", "http://localhost:3000"), {
		method: "GET",
		headers: cookieHeader ? { Cookie: cookieHeader } : {},
	});
}

describe("GET /api/user/profile", () => {
	it("returns 401 when no auth_token cookie", async () => {
		const response = await GET(makeGetRequest());
		expect(response.status).toBe(401);
		const body = await response.json();
		expect(body.status).toBe(false);
		expect(body.message).toBe("Unauthorized");
	});

	it("returns 401 for invalid token format (not 3 parts)", async () => {
		const response = await GET(makeGetRequest({ auth_token: "invalid-token" }));
		expect(response.status).toBe(401);
		const body = await response.json();
		expect(body.message).toBe("Invalid token format");
	});

	it("returns 401 for undecodable base64 payload", async () => {
		const response = await GET(
			makeGetRequest({ auth_token: "header.!!!invalid-base64!!!.signature" })
		);
		expect(response.status).toBe(401);
		const body = await response.json();
		expect(body.message).toBe("Invalid token");
	});

	it("returns 200 with user profile from JWT", async () => {
		const token = createMockFirebaseToken({
			user_id: "uid-123",
			email: "test@example.com",
			email_verified: true,
		});
		const response = await GET(makeGetRequest({ auth_token: token }));
		expect(response.status).toBe(200);

		const body = await response.json();
		expect(body.status).toBe(true);
		expect(body.data.id).toBe("uid-123");
		expect(body.data.email).toBe("test@example.com");
		expect(body.data.is_verified).toBe(true);
	});

	it("username defaults to email prefix", async () => {
		const token = createMockFirebaseToken({
			email: "johndoe@gmail.com",
		});
		const response = await GET(makeGetRequest({ auth_token: token }));
		const body = await response.json();
		expect(body.data.username).toBe("johndoe");
	});
});
