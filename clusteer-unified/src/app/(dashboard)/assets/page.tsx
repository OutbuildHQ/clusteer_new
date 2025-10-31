import WalletList from "@/components/wallet-list";
import Link from "next/link";

export default function Page() {
	return (
		<div className="font-avenir-next pb-6 lg:pt-[50px]">
			<header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
				<div>
					<h1 className="text-2xl lg:text-[32px] font-bold text-[#0D0D0D]">
						Assets
					</h1>
					<p className="text-sm lg:text-base text-[#667085] mt-1">
						Manage your crypto portfolio
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Link
						href="/send"
						className="px-6 py-2 bg-[#9FE870] text-custom-black hover:bg-[#8DD659] font-medium rounded-lg transition-colors"
					>
						Send
					</Link>
					<Link
						href="/receive"
						className="px-6 py-2 bg-[#E8F5E9] text-custom-black hover:bg-[#D0EBD6] font-medium rounded-lg transition-colors"
					>
						Add money
					</Link>
				</div>
			</header>

			<section>
				<WalletList />
			</section>
		</div>
	);
}
