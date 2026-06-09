"use client";

import dynamic from "next/dynamic";
import { AdminSidebar } from "@/components/app/admin-sidebar";
import { AdminHeader } from "@/components/app/admin-header";
import { ToastProvider } from "@/components/admin/Toast";
import { ThemeProvider } from "@/providers/ThemeProvider";

const FlowHost = dynamic(() => import("@/components/flow-host").then(m => m.FlowHost), { ssr: false });

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider>
		<ToastProvider>
			<div className="flex h-screen overflow-hidden" style={{ background: "var(--c-bg)" }}>
				<AdminSidebar />
				<div className="flex min-w-0 flex-1 flex-col" style={{ height: "100vh", overflow: "hidden" }}>
					<AdminHeader />
					<div className="flex-1 overflow-y-auto" style={{ padding: "24px 24px 48px" }}>
						<div className="mx-auto w-full max-w-[1400px]">
							{children}
						</div>
					</div>
				</div>
				<FlowHost />
			</div>
		</ToastProvider>
		</ThemeProvider>
	);
}
