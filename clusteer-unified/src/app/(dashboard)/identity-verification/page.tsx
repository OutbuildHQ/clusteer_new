"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/store/user";

export default function Page() {
	const user = useUser();
	const isVerfified = user?.is_verified || false;

	return (
		<section className="mt-[52px] pb-[82px]">
			<header className="flex items-center gap-x-4.5">
				<h1 className="font-semibold text-2xl">Individual verification</h1>
				<Badge
					variant="secondary"
					className={cn("h-6 rounded-[100px] font-medium", {
						"text-destructive bg-[#FCEAEA]": !isVerfified,
						"bg-button text-dark-green": isVerfified,
					})}
				>
					{isVerfified && (
						<Image
							src="/assets/icons/check_small.svg"
							alt="small check icon"
							width={10}
							height={10}
						/>
					)}
					{isVerfified ? "Verified" : "Unverified"}
				</Badge>
			</header>
			<div className="lg:max-w-[512px]">
				<div className="mt-[52px] bg-[#F2F2F0] rounded-2xl border border-[#21241D1A] py-7.5 px-10 w-full">
					<div>
						<span className="font-medium text-lg">
							Account perks after verification
						</span>
						<ul className="mt-5 text-sm space-y-3">
							<li className="flex justify-between">
								<p>Identity verification</p>
								{isVerfified ? (
									<CheckCircle2
										size={16}
										className="stroke-dark-green"
									/>
								) : (
									<XCircle size={16} />
								)}
							</li>
							<li className="flex justify-between">
								<p>Crypto deposit</p>
								{isVerfified ? (
									<CheckCircle2
										size={16}
										className="stroke-dark-green"
									/>
								) : (
									<XCircle size={16} />
								)}
							</li>
							<li className="flex justify-between">
								<p>Higher transaction limits</p>
								{isVerfified ? (
									<CheckCircle2
										size={16}
										className="stroke-dark-green"
									/>
								) : (
									<XCircle size={16} />
								)}
							</li>
						</ul>
					</div>
					<div className="mt-[51px]">
						<span className="font-medium text-lg">
							Verification requirements
						</span>
						<ul className="mt-5 text-sm space-y-3 pl-5.5">
							<li className="list-disc font-medium text-[15px]">
								Government-issued documents
							</li>
							<li className="list-disc font-medium text-[15px]">
								{" "}
								Face recognition verification
							</li>
							<li className="list-disc font-medium text-[15px]">
								{" "}
								Estimated review time: 60m
							</li>
						</ul>
					</div>
				</div>
				<Link
					href="/identity-verification/verify"
					className="mt-[52px] w-full border border-black bg-light-green py-3.5 px-4.5 rounded-xl text-base flex items-center"
				>
					<p className="text-black font-semibold">Continue</p>
					<p className="px-2.5 py-1 bg-white rounded-full ml-auto">
						On-chain deposit
					</p>
				</Link>
			</div>
		</section>
	);
}
