import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryClientProvider from "@/providers/ReactQueryClientProvider";
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
	title: "Clusteer Admin",
	description: "Clusteer administration dashboard",
	icons: {
		icon: [
			{ url: "/favicon.svg", type: "image/svg+xml" },
		],
		apple: "/apple-icon.svg",
	},
	robots: { index: false, follow: false },
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
				<ReactQueryClientProvider>{children}</ReactQueryClientProvider>
				<Toaster position="bottom-center" richColors closeButton />
			</body>
		</html>
	);
}
