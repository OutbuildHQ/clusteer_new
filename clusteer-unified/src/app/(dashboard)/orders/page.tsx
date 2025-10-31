import { OrdersTable } from "@/components/tables/orders-table";

export default function Page() {
	return (
		<div className="font-avenir-next pb-6 lg:pt-[50px]">
			<header className="mb-6">
				<h1 className="text-2xl lg:text-[32px] font-bold text-[#0D0D0D]">
					Orders
				</h1>
				<p className="text-sm lg:text-base text-[#667085] mt-1">
					View and manage your active and completed orders
				</p>
			</header>

			<section>
				<OrdersTable />
			</section>
		</div>
	);
}
