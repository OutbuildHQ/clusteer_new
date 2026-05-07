import { AdminSidebar } from "@/components/app/admin-sidebar";
import { TopBar } from "@/components/app/topbar";
import { Breadcrumbs } from "@/components/app/breadcrumbs";
import { ToastProvider } from "@/components/admin/Toast";
import { ThemeProvider } from "@/providers/ThemeProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider>
		<ToastProvider>
			<div className="flex h-screen overflow-hidden" style={{ background: "var(--c-bg)" }}>
				<AdminSidebar />
				<div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
					<TopBar />
					<main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-12 pt-6 md:px-6 lg:px-8">
						<Breadcrumbs />
						<div className="mt-3">{children}</div>
					</main>
				</div>
			</div>
		</ToastProvider>
		</ThemeProvider>
	);
}
