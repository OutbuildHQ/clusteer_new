"use client";

import Banner from "@/components/banner";
import BuySellCrypto from "@/components/buy-sell-crypto";
import CompactWalletList from "@/components/compact-wallet-list";
import PortfolioSummary from "@/components/portfolio-summary";
import RecentActivity from "@/components/recent-activity";
import UserProfile from "@/components/user-profile";
import { useUser } from "@/store/user";

export default function Page() {
	const user = useUser();
	const isKycVerified = user?.is_verified || false;

	return (
		<div className="font-avenir-next pb-6 lg:pt-[50px]">
			{/* KYC Verification Banner */}
			{!isKycVerified && (
				<Banner
					title="Complete your Verification to proceed"
					description="Your security and trust are paramount to us, which is why we've
						implemented Identity Verification protocol. Verifying your identity
						ensures that Clusteer remains a safe and reliable platform for all users,
						and also enables you to enjoy an enhanced range of features and
						services."
					link="/identity-verification"
				/>
			)}

			{/* User Profile Header */}
			<section className={isKycVerified ? "mt-0 mb-6" : "mt-5 lg:mt-20 mb-6"}>
				<UserProfile />
			</section>

			{/* Portfolio Summary - Simple Wise style */}
			<PortfolioSummary />

			{/* Wallets Section */}
			<section className="mb-8">
				<CompactWalletList />
			</section>

			{/* Recent Activity */}
			<section className="mb-8">
				<RecentActivity />
			</section>

			{/* Quick Convert Widget */}
			<section className="mb-8">
				<BuySellCrypto />
			</section>
		</div>
	);
}
