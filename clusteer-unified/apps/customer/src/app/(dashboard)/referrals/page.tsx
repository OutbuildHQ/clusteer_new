import { Gift } from "lucide-react";

export default function ReferralsPage() {
	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-[32px] font-semibold text-ds-text tracking-[-0.03em] m-0 font-display">
				Referrals &amp; rewards
			</h1>

			{/* Hero card — vision framing, honestly labeled as not yet live */}
			<div className="bg-onyx-900 text-cream rounded-[14px] border-none p-8">
				<div className="inline-flex items-center h-[22px] px-2.5 rounded-full text-[11px] font-semibold bg-lime-500 text-onyx-900 mb-4">
					Coming soon
				</div>
				<div className="font-display text-[13px] opacity-70 uppercase tracking-[0.08em]">
					Earn ₦2,000 per referral
				</div>
				<div className="font-display text-[42px] font-semibold leading-none mt-2 tracking-[-0.025em]">
					Invite friends.<br />Both get rewarded.
				</div>
				<p className="mt-4 text-[14px] text-cream/60 max-w-[440px]">
					We&apos;re building referral rewards for Clusteer. There&apos;s no referral link or reward
					history yet — check back once this launches.
				</p>
			</div>

			{/* Empty state */}
			<div className="bg-ds-surface border border-ds-line rounded-[14px] py-16 px-8 flex flex-col items-center text-center gap-3">
				<div className="w-12 h-12 rounded-full bg-ds-surface-2 flex items-center justify-center">
					<Gift size={20} className="text-ds-text-3" />
				</div>
				<h3 className="text-[16px] font-semibold text-ds-text m-0">No referrals yet</h3>
				<p className="text-[13.5px] text-ds-text-3 max-w-[360px] m-0">
					Referral tracking isn&apos;t live yet. Once it launches, invited friends and their
					reward status will show up here.
				</p>
			</div>
		</div>
	);
}
