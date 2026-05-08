"use client";

import dynamic from "next/dynamic";
import { Sidebar } from "@/components/app/sidebar";
import { TopBar } from "@/components/app/topbar";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { DashboardContent } from "@/components/app/dashboard-content";

const MobileTabBar = dynamic(() => import("@/components/app/mobile-tab-bar").then(m => m.MobileTabBar), { ssr: false });
const CommandPalette = dynamic(() => import("@/components/app/command-palette").then(m => m.CommandPalette), { ssr: false });

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider>
			<div className="flex min-h-[100dvh]" style={{ background: "var(--c-bg)" }}>
				<Sidebar />
				<div className="flex min-w-0 flex-1 flex-col" style={{ height: "100dvh", overflow: "hidden" }}>
					<TopBar />
					<main className="flex-1 overflow-auto px-4 py-4 pb-28 lg:px-6 lg:py-6 lg:pb-12">
						<DashboardContent>{children}</DashboardContent>
					</main>
				</div>
				<MobileTabBar />
				<CommandPalette />
			</div>
		</ThemeProvider>
	);
}
