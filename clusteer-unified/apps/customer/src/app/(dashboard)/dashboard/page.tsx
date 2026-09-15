"use client";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@/lib/api/user/queries";
import { CustomerOverview } from "@/components/brand/customer-overview";
import type { QxOrder } from "@/lib/types";
export default function DashboardPage() {
	const { data: user } = useQuery({ queryKey: ["user-info"], queryFn: getUserInfo });
	const { data: rates } = useQuery({
		queryKey: ["overview-exchange-rate", "sell"],
		queryFn: async () => {
			const r = await fetch("/api/system/exchange-rate?targetCurrency=NGN&amount=1&type=sell");
			if (!r.ok) throw new Error("Rate unavailable");
			return r.json();
		},
		refetchInterval: 30000,
	});
	const orders = useQuery({
		queryKey: ["orders"],
		queryFn: async () => {
			const r = await fetch("/api/order?page=1&size=10");
			if (!r.ok) throw new Error("Orders unavailable");
			const d = await r.json();
			if (d.status === false) throw new Error("Orders unavailable");
			return (d.data || []) as QxOrder[];
		},
		refetchInterval: 15000,
	});
	return (
		<CustomerOverview
			name={user?.firstName || user?.username}
			orders={orders.data}
			rate={rates?.sellRate}
			rateSource={rates?.source}
			loading={orders.isLoading}
			error={orders.isError}
			onRetry={() => void orders.refetch()}
		/>
	);
}
