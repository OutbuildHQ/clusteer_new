import axios from "axios";

// NEXT_PUBLIC_API_URL is "/api" — same-origin, so the browser already sends the
// httpOnly auth_token cookie automatically on every request below. The receiving
// Next.js route reads it server-side (see getAuthFromRequest in api-helpers.ts).
// A client-side Bearer-token interceptor here would be both unreadable (httpOnly
// blocks document.cookie) and redundant (cookies are already forwarded same-origin).
const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Response interceptor to handle auth errors globally
apiClient.interceptors.response.use(
	(response) => {
		// Pass through successful responses
		return response;
	},
	async (error) => {
		// Check if we're in the browser
		if (typeof window !== "undefined") {
			// Handle 401 Unauthorized errors
			if (error.response?.status === 401) {
				const errorMessage = error.response?.data?.message || "";

				// Only redirect to login if it's a genuine auth error
				// Don't redirect on service unavailable errors
				if (!errorMessage.includes("temporarily unavailable")) {
					// auth_token is httpOnly — client JS can't clear it via document.cookie
					// (that line used to be here and was a silent no-op). Clearing it for
					// real requires a server route that can send a Set-Cookie header.
					try {
						await fetch("/api/auth-firebase/logout", { method: "POST" });
					} catch {
						// best-effort — still redirect to /login below even if this fails
					}

					// Redirect to login page if not already there
					if (!window.location.pathname.includes("/login")) {
						window.location.href = "/login";
					}
				}
			}

			// Handle 503 Service Unavailable errors
			if (error.response?.status === 503) {
				console.warn("Service temporarily unavailable:", error.response?.data?.message);
				// You could show a toast notification here
			}
		}

		return Promise.reject(error);
	}
);

export default apiClient;
