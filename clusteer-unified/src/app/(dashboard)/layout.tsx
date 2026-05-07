import { Sidebar } from "@/components/app/sidebar";
import { TopBar } from "@/components/app/topbar";
import { MobileTabBar } from "@/components/app/mobile-tab-bar";
import { CommandPalette } from "@/components/app/command-palette";
import { ThemeProvider } from "@/providers/ThemeProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider>
			<div className="flex min-h-[100dvh]" style={{ background: "var(--c-bg)" }}>
				{/* Desktop sidebar — hidden on mobile */}
				<Sidebar />
				<div className="flex min-w-0 flex-1 flex-col" style={{ height: "100dvh", overflow: "hidden" }}>
					<TopBar />
					<main className="flex-1 overflow-auto px-4 py-4 pb-24 lg:px-6 lg:py-6 lg:pb-12">
						{children}
					</main>
					{/* Mobile bottom tab bar — hidden on desktop */}
					<MobileTabBar />
				</div>
				<CommandPalette />
			</div>
		</ThemeProvider>
	);
}
