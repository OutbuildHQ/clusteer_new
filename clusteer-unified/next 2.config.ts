import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
	typescript: {
		ignoreBuildErrors: false,
	},

	// Security headers
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-DNS-Prefetch-Control",
						value: "on",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains; preload",
					},
					{
						key: "X-Frame-Options",
						value: "SAMEORIGIN",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-XSS-Protection",
						value: "1; mode=block",
					},
					{
						key: "Referrer-Policy",
						value: "origin-when-cross-origin",
					},
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
					{
						key: "Content-Security-Policy",
						value: [
							"default-src 'self'",
							"script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval/inline
							"style-src 'self' 'unsafe-inline'",
							"img-src 'self' data: https:",
							"font-src 'self' data:",
							"connect-src 'self' https://*.supabase.co https://open.er-api.com https://api.coingecko.com",
							"frame-ancestors 'none'",
						].join("; "),
					},
				],
			},
		];
	},

	// Image optimization configuration
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*.supabase.co",
			},
		],
	},
};

// Sentry configuration options
const sentryWebpackPluginOptions = {
	// Suppresses source map uploading logs during build
	silent: true,
	org: process.env.SENTRY_ORG || "clusteer",
	project: process.env.SENTRY_PROJECT || "clusteer-frontend",
	// Auth token for uploading source maps
	authToken: process.env.SENTRY_AUTH_TOKEN,
};

// Export config wrapped with Sentry
export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
