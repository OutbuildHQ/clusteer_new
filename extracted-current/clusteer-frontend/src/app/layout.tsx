import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryClientProvider from "@/providers/ReactQueryClientProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
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
		"Buy, sell, swap and hold crypto with Naira. Licensed, audited, and built for Nigeria.",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${inter.variable} ${sora.variable} ${jetbrains.variable} antialiased min-h-screen`}
			>
				<ThemeProvider>
					<ReactQueryClientProvider>{children}</ReactQueryClientProvider>
					<Toaster position="bottom-right" richColors closeButton />
				</ThemeProvider>
			</body>
		</html>
	);
}
