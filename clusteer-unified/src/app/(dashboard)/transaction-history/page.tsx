import { TransactionsTable } from "@/components/tables/transactions-table";

export default function Page() {
	return (
		<section className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8">
			<h1 className="text-[#181D27] font-semibold text-2xl">
				Transaction History
			</h1>
			<div className="mt-8">
				<TransactionsTable />
			</div>
		</section>
	);
}
