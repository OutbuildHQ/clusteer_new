import { Sidebar } from "@/components/app/sidebar";
import { TopBar } from "@/components/app/topbar";
import { Breadcrumbs } from "@/components/app/breadcrumbs";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-screen bg-muted/40">
			<Sidebar />
			<div className="flex min-w-0 flex-1 flex-col">
				<TopBar />
				<main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-12 pt-6 md:px-6 lg:px-8">
					<Breadcrumbs />
					<div className="mt-3">{children}</div>
				</main>
			</div>
		</div>
	);
}
