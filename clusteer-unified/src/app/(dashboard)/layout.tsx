import BreadcrumbNav from "@/components/breadcrumb-nav";
import DashboardNav from "@/components/dashboard-nav";
import InitializeApp from "@/components/initialize-app";
import Modals from "@/components/modals";
import UserBanner from "@/components/user-banner";
import NotificationBell from "@/components/notification-bell";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<InitializeApp>
			<div className="relative h-full min-h-[100dvh] lg:grid lg:grid-cols-[250px_auto] xl:grid-cols-[292px_auto] gap-x-9 xl:gap-14.5 lg:pr-4">
				<DashboardNav />
				<div className="lg:max-w-[953px] xl:max-w-[1024px] px-4">
					<div className="mt-1.5 lg:mt-10 mb-5 lg:mb-0">
						<div className="flex items-center justify-between">
							<UserBanner />
							<div className="hidden lg:block ml-auto">
								<NotificationBell />
							</div>
						</div>
						<BreadcrumbNav />
					</div>
					{children}
				</div>
			</div>
			<Modals />
		</InitializeApp>
	);
}
