/**
 * Test helpers for constructing NextRequest/NextResponse objects
 */

interface MockRequestOptions {
	method?: string;
	body?: Record<string, any>;
	headers?: Record<string, string>;
	cookies?: Record<string, string>;
	searchParams?: Record<string, string>;
}

/**
 * Create a mock NextRequest for testing API routes
 */
export function createMockRequest(
	path: string = "/api/test",
	options: MockRequestOptions = {}
): Request {
	const { method = "GET", body, headers = {}, cookies = {}, searchParams = {} } = options;

	const url = new URL(path, "http://localhost:3000");
	Object.entries(searchParams).forEach(([key, value]) => {
		url.searchParams.set(key, value);
	});

	const allHeaders: Record<string, string> = {
		"Content-Type": "application/json",
		...headers,
	};

	// Set cookies via Cookie header
	const cookieEntries = Object.entries(cookies);
	if (cookieEntries.length > 0) {
		allHeaders["Cookie"] = cookieEntries
			.map(([k, v]) => `${k}=${v}`)
			.join("; ");
	}

	const requestInit: RequestInit = {
		method,
		headers: allHeaders,
	};

	if (body && method !== "GET") {
		requestInit.body = JSON.stringify(body);
	}

	return new Request(url.toString(), requestInit);
}

/**
 * Parse a Response object for assertions
 */
export async function parseResponse(response: Response): Promise<{
	status: number;
	body: any;
	headers: Headers;
}> {
	const body = await response.json();
	return {
		status: response.status,
		body,
		headers: response.headers,
	};
}

/**
 * Create a mock Firebase-like JWT token for cookie testing
 */
export function createMockFirebaseToken(
	payload: Record<string, any> = {}
): string {
	const defaultPayload = {
		user_id: "test-uid-123",
		sub: "test-uid-123",
		email: "test@example.com",
		email_verified: true,
		iat: Math.floor(Date.now() / 1000),
		exp: Math.floor(Date.now() / 1000) + 3600,
	};

	const mergedPayload = { ...defaultPayload, ...payload };

	const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64");
	const payloadStr = Buffer.from(JSON.stringify(mergedPayload)).toString("base64");
	const signature = Buffer.from("fake-signature").toString("base64");

	return `${header}.${payloadStr}.${signature}`;
}
