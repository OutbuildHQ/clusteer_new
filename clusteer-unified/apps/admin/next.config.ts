import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
	transpilePackages: ["@clusteer/ui"],

	// Standalone output for Firebase App Hosting. The monorepo lives in a
	// subdirectory of the deploy repo, and a stray lockfile at the repo root
	// makes Next infer the wrong workspace root — pin it to the monorepo root
	// so the standalone bundle nests at .next/standalone/apps/admin/.next/
	// where the App Hosting adapter expects it.
	output: "standalone",
	outputFileTracingRoot: path.resolve(__dirname, "../../"),

	typescript: {
		ignoreBuildErrors: false,
	},

	turbopack: {
		root: path.resolve(__dirname, "../../"),
		resolveAlias: {
			"@clusteer/ui/*": path.resolve(__dirname, "../../packages/ui/src/*"),
		},
	},

	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{ key: "X-DNS-Prefetch-Control", value: "on" },
					{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
					{ key: "X-Frame-Options", value: "DENY" },
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{ key: "X-XSS-Protection", value: "1; mode=block" },
					{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
					{ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
					{
						key: "Content-Security-Policy",
						value: [
							"default-src 'self'",
							"script-src 'self' 'unsafe-inline'",
							"style-src 'self' 'unsafe-inline'",
							"img-src 'self' data: https:",
							"font-src 'self' data:",
							"connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://*.firebaseapp.com",
							"frame-ancestors 'none'",
						].join("; "),
					},
				],
			},
		];
	},
};

export default nextConfig;
