import { Sidebar } from "@/components/app/sidebar";
import { TopBar } from "@/components/app/topbar";
import { Breadcrumbs } from "@/components/app/breadcrumbs";
import { DashboardContent } from "@/components/app/dashboard-content";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-[100dvh] bg-background">
			<Sidebar />
			<div className="flex min-w-0 flex-1 flex-col">
				<TopBar />
				<main className="mx-auto w-full max-w-7xl flex-1 px-3 sm:px-4 pb-8 sm:pb-12 pt-4 sm:pt-6 md:px-6 lg:px-8">
					<Breadcrumbs />
					<DashboardContent><div className="mt-4">{children}</div></DashboardContent>
				</main>
			</div>
		</div>
	);
}
