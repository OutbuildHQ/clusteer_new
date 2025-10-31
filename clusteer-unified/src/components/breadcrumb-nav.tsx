"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumbs, useBreadcrumbActions } from "@/store/breadcrumb";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Fragment, useEffect } from "react";

const routeLabels: Record<string, string> = {
	dashboard: "Dashboard",
	profile: "Profile",
	security: "Security",
	"identity-verification": "Identity Verification",
	"transaction-history": "Transaction History",
	assets: "Assets",
	receive: "Receive",
	send: "Send",
	verify: "Verify",
	"google-auth": "Google Authenticator",
	"change-email": "Change Email",
	"change-password": "Change Password",
	bvn: "BVN Verification",
	nin: "NIN Verification",
	trade: "Trade",
	orders: "Orders",
};

export default function BreadcrumbNav() {
	const pathname = usePathname();
	const breadcrumbs = useBreadcrumbs();
	const { setBreadcrumbs } = useBreadcrumbActions();

	// Update breadcrumbs based on pathname
	useEffect(() => {
		// Don't show breadcrumb on dashboard home
		if (pathname === "/dashboard") {
			setBreadcrumbs([]);
			return;
		}

		// Split pathname and filter out empty strings
		const pathSegments = pathname.split("/").filter(Boolean);

		// Don't show breadcrumb if only one segment or on root
		if (pathSegments.length <= 1) {
			setBreadcrumbs([]);
			return;
		}

		// Build breadcrumb items from path
		const items = pathSegments
			.map((segment, index) => {
				// Skip first segment if it's 'dashboard'
				if (segment === "dashboard") return null;

				const href = "/" + pathSegments.slice(0, index + 1).join("/");
				const label =
					routeLabels[segment] ||
					segment.charAt(0).toUpperCase() + segment.slice(1);

				return { label, href };
			})
			.filter((item) => item !== null);

		setBreadcrumbs(items);
	}, [pathname, setBreadcrumbs]);

	// Don't render if no breadcrumbs
	if (breadcrumbs.length === 0) {
		return null;
	}

	return (
		<Breadcrumb className="py-2">
			<BreadcrumbList className="!gap-3">
				<BreadcrumbItem>
					<BreadcrumbLink
						className="text-[#98A2B3] hover:text-[#0D0D0D] transition-colors"
						href="/dashboard"
					>
						Dashboard
					</BreadcrumbLink>
				</BreadcrumbItem>

				{breadcrumbs.map((breadcrumb, index) => {
					const isLast = index === breadcrumbs.length - 1;

					return (
						<Fragment key={breadcrumb.href}>
							<BreadcrumbSeparator>
								<Image
									src="/assets/icons/slash-divider.svg"
									alt="slash icon"
									width={20}
									height={20}
								/>
							</BreadcrumbSeparator>
							<BreadcrumbItem>
								{isLast ? (
									<BreadcrumbPage className="text-[#0D0D0D] font-semibold">
										{breadcrumb.label}
									</BreadcrumbPage>
								) : (
									<BreadcrumbLink
										className="text-[#98A2B3] hover:text-[#0D0D0D] transition-colors"
										href={breadcrumb.href}
									>
										{breadcrumb.label}
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
