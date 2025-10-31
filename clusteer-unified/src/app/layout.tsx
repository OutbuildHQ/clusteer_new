import { Toaster } from "@/components/ui/sonner";
import ReactQueryClientProvider from "@/providers/ReactQueryClientProvider";
import type { Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const lexend = Lexend({
	variable: "--font-lexend",
	subsets: ["latin"],
	display: "swap",
});

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

const avenirNext = localFont({
	variable: "--font-avenir-next",
	display: "swap",
	src: [
		{
			path: "./../fonts/avenir-next/AvenirNext-UltraLight-11.ttf",
			weight: "200",
			style: "normal",
		},
		{
			path: "./../fonts/avenir-next/AvenirNext-Medium-06.ttf",
			weight: "500",
			style: "normal",
		},
		{
			path: "./../fonts/avenir-next/AvenirNext-DemiBold-03.ttf",
			weight: "600",
			style: "normal",
		},
		{
			path: "./../fonts/avenir-next/AvenirNext-Regular-08.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "./../fonts/avenir-next/AvenirNext-Bold-01.ttf",
			weight: "700",
			style: "normal",
		},
		{
			path: "./../fonts/avenir-next/AvenirNext-Heavy-09.ttf",
			weight: "800",
			style: "normal",
		},
	],
});

export const metadata: Metadata = {
	title: "Clusteer - Buy & Sell USDT to Naira Instantly | Fast Crypto Exchange Nigeria",
	description: "Convert USDT to Naira in 5 minutes. Trusted by 1,000+ Nigerian traders. Real-time rates, transparent fees, secure escrow, and 24/7 support. Start trading cryptocurrency now!",
	keywords: ["USDT to Naira", "Buy USDT Nigeria", "Sell USDT", "Crypto exchange Nigeria", "P2P trading Nigeria", "stablecoin exchange", "Bitcoin to Naira", "cryptocurrency Nigeria"],
	authors: [{ name: "Clusteer" }],
	openGraph: {
		title: "Clusteer - Buy & Sell USDT to Naira Instantly",
		description: "Convert USDT to Naira in 5 minutes. Trusted by 1,000+ Nigerian traders. Real-time rates, transparent fees, and secure escrow.",
		url: "https://clusteer.com",
		siteName: "Clusteer",
		type: "website",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Clusteer - USDT to Naira Exchange",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Clusteer - Buy & Sell USDT to Naira Instantly",
		description: "Convert USDT to Naira in 5 minutes. Trusted by 1,000+ Nigerian traders.",
		images: ["/og-image.png"],
	},
	robots: {
		index: true,
		follow: true,
	},
};
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${lexend.variable} ${inter.variable} ${avenirNext.variable} antialiased`}
			>
				<ReactQueryClientProvider>{children}</ReactQueryClientProvider>
				<Toaster
					position="bottom-center"
					toastOptions={{
						classNames: {
							toast: "w-full",
						},
					}}
				/>
			</body>
		</html>
	);
}
