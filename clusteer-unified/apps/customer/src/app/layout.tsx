import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryClientProvider from "@/providers/ReactQueryClientProvider";
import CookieConsent from "@/components/app/cookie-consent";
import { ConsentScripts } from "@/components/app/consent-scripts";
import "./globals.css";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

const sora = Sora({
	variable: "--font-sora",
	subsets: ["latin"],
	display: "swap",
	weight: ["400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
	variable: "--font-jetbrains",
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Clusteer — Stablecoins and naira, connected",
	description:
		"Buy stablecoins to your own wallet or sell to your Nigerian bank account. Clusteer is preparing for public launch.",
	icons: {
		icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
		apple: "/apple-icon.svg",
	},
	keywords: [
		"USDT to Naira",
		"Buy USDT Nigeria",
		"Sell USDT",
		"Stablecoin exchange Nigeria",
		"stablecoin conversion Nigeria",
		"stablecoin exchange",
		"USDT to Naira exchange",
		"stablecoin exchange Nigeria",
	],
	authors: [{ name: "Clusteer" }],
	openGraph: {
		title: "Clusteer — Stablecoins and naira, connected",
		description:
			"Buy stablecoins to your own wallet or sell to your Nigerian bank account. Clusteer is preparing for public launch.",
		url: "https://clusteer.com",
		siteName: "Clusteer",
		type: "website",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Clusteer — Stablecoin Exchange Nigeria",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Clusteer — Stablecoins and naira, connected",
		description:
			"Buy stablecoins to your own wallet or sell to your Nigerian bank account. Clusteer is preparing for public launch.",
		images: ["/og-image.png"],
	},
	robots: {
		index: true,
		follow: true,
	},
};

export const viewport = {
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${inter.variable} ${sora.variable} ${jetbrains.variable} antialiased min-h-screen`}
				suppressHydrationWarning
			>
				<ReactQueryClientProvider>
					{children}
					<Toaster position="bottom-center" richColors closeButton />
					<CookieConsent />
					<ConsentScripts />
				</ReactQueryClientProvider>
			</body>
		</html>
	);
}
