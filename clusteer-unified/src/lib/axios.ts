import axios from "axios";

const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	// withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

const getAuthToken = () => {
	// Check if we're in the browser (client-side)
	if (typeof window !== "undefined") {
		return document.cookie
			.split("; ")
			.find((row) => row.startsWith("auth_token="))
			?.split("=")[1];
	}
	return null; // Return null or handle as needed on server-side
};

// Request interceptor to add the Bearer token to headers
apiClient.interceptors.request.use(
	(config) => {
		const token = getAuthToken();
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor to handle auth errors globally
apiClient.interceptors.response.use(
	(response) => {
		// Pass through successful responses
		return response;
	},
	(error) => {
		// Check if we're in the browser
		if (typeof window !== "undefined") {
			// Handle 401 Unauthorized errors
			if (error.response?.status === 401) {
				const errorMessage = error.response?.data?.message || "";

				// Only redirect to login if it's a genuine auth error
				// Don't redirect on service unavailable errors
				if (!errorMessage.includes("temporarily unavailable")) {
					// Clear auth token
					document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

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
