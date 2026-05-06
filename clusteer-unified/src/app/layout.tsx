import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryClientProvider from "@/providers/ReactQueryClientProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import CookieConsent from "@/components/app/cookie-consent";
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
	title: "Clusteer — Bridge your Naira into the global digital economy",
	description:
		"Buy, sell and hold stablecoins with Naira. Built for Nigeria.",
	keywords: [
		"USDT to Naira",
		"Buy USDT Nigeria",
		"Sell USDT",
		"Stablecoin exchange Nigeria",
		"P2P trading Nigeria",
		"stablecoin exchange",
		"USDT to Naira exchange",
		"stablecoin exchange Nigeria",
	],
	authors: [{ name: "Clusteer" }],
	openGraph: {
		title: "Clusteer — Bridge your Naira into the global digital economy",
		description:
			"Buy, sell and hold stablecoins with Naira. Built for Nigeria.",
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
		title: "Clusteer — Bridge your Naira into the global digital economy",
		description:
			"Buy, sell and hold stablecoins with Naira. Built for Nigeria.",
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
	maximumScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${inter.variable} ${sora.variable} ${jetbrains.variable} antialiased min-h-screen`}
				suppressHydrationWarning
			>
				<ThemeProvider>
					<ReactQueryClientProvider>{children}</ReactQueryClientProvider>
					<Toaster position="bottom-center" richColors closeButton />
					<CookieConsent />
				</ThemeProvider>
			</body>
		</html>
	);
}
