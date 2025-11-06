import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// IMPORTANT: These should be removed after fixing all TypeScript/ESLint errors
	// Temporarily disabled for development - must be fixed before production
	eslint: {
		ignoreDuringBuilds: false, // Changed from true - fix ESLint errors
	},
	typescript: {
		ignoreBuildErrors: false, // Changed from true - fix TypeScript errors
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
		domains: ["supabase.co"], // Add your Supabase storage domain
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*.supabase.co",
			},
		],
	},
};

export default nextConfig;
