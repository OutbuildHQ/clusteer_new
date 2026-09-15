"use client";

import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUserId } from "@/hooks/use-user-id";
import { getKYCVerification } from "@/lib/api/settings";
import { SidebarFrame } from "./sidebar-frame";

interface SidebarProps {
	mobile?: boolean;
	onNavClick?: () => void;
}

export function Sidebar({ mobile, onNavClick }: SidebarProps) {
	const pathname = usePathname();
	const userId = useUserId();
	const { data: kycData } = useQuery({
		queryKey: ["kyc-status", userId],
		queryFn: () => getKYCVerification(userId!),
		enabled: !!userId,
		staleTime: 300_000,
	});

	const tierLabel = (() => {
		const status = kycData?.status;
		if (status === "approved") return "Tier 2";
		if (status === "pending" || status === "under_review") return "Pending";
		return "Tier 1";
	})();

	return (
		<SidebarFrame
			mobile={mobile}
			onNavClick={onNavClick}
			pathname={pathname}
			tierLabel={tierLabel}
		/>
	);
}
