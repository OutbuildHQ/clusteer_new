"use client";

import { Badge } from "@/components/ui/badge";
import { DotIcon, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/store/user";

export default function Page() {
	const user = useUser();
	const is2FAEnabled = user?.twoFactorEnabled || false;
	const isEmailVerified = user?.emailVerified || false;

	return (
		<section className="mt-5 lg:mt-10 pb-[113px] xl:pb-[140px]">
			<header>
				<h1 className="text-[#181D27] font-semibold text-xl lg:text-2xl">
					Security
				</h1>
				<p className="text-sm lg:mt-2">
					Please configure the following verification method(s) as soon as
					possible:
				</p>
			</header>
			<div className="mt-5 lg:mt-7">
				<span className="text-sm lg:font-medium lg:p-0 lg:text-lg font-semibold py-2">
					Two-Factor Authentication
				</span>
				<ul className="mt-5 lg:mt-6.5 flex flex-col flex-wrap lg:flex-row gap-y-7 gap-x-6">
					<Link href="/security/google-auth">
						<li className="bg-[#F2F2F0] rounded-2xl border border-[#21241D1A] p-5 xl:max-w-[435px] w-full shrink-0 md:space-y-2">
							<div className="flex items-center">
								<Image
									src="/assets/images/google-auth.png"
									alt="google auth logo"
									width={46}
									height={46}
								/>
								<Badge
									variant="secondary"
									className={`rounded-full ml-auto h-6 py-1 ${
										is2FAEnabled
											? "text-green-700 bg-green-100"
											: "text-[#344054] bg-[#E9E9E9]"
									}`}
								>
									<DotIcon
										stroke={is2FAEnabled ? "#15803d" : "#344054"}
										strokeWidth={8}
									/>
									{is2FAEnabled ? "Enabled" : "Disabled"}
								</Badge>
							</div>
							<p className="font-medium text-lg mt-2.5">
								Google Authenticator (recommended)
							</p>
							<p className="text-sm">
								Google Authenticator codes help guarantee account and
								transaction security. Changing your bound Google Authenticator
								will disable payment and withdrawal for 24 hours.
							</p>
							<span className="text-dark-green text-[15px] font-medium mt-1.5 inline-block">
								{is2FAEnabled ? "Manage" : "Bind"}
							</span>
						</li>
					</Link>
					<Link href="/security/change-email">
						<li className="bg-[#F2F2F0] rounded-2xl border border-[#21241D1A] p-5 xl:max-w-[435px] w-full shrink-0 md:space-y-2">
							<div className="flex items-center">
								<Mail size={46} />
								<Badge
									variant="secondary"
									className={`rounded-full ml-auto h-6 py-1 ${
										isEmailVerified
											? "text-green-700 bg-green-100"
											: "text-[#344054] bg-[#E9E9E9]"
									}`}
								>
									<DotIcon
										stroke={isEmailVerified ? "#15803d" : "#344054"}
										strokeWidth={8}
									/>
									{isEmailVerified ? "Enabled" : "Disabled"}
								</Badge>
							</div>
							<p className="font-medium text-lg mt-2.5">Email verification</p>
							<p className="text-sm">
								Email verification codes help guarantee account and transaction
								security. Changing your bound email will disable payment and
								withdrawal for 24 hours.
							</p>
							<span className="text-dark-green text-[15px] font-medium mt-1.5 inline-block">
								{isEmailVerified ? "Change" : "Bind"}
							</span>
						</li>
					</Link>
					<li className="bg-[#F2F2F0] rounded-2xl border border-[#21241D1A] p-5 xl:max-w-[435px] w-full shrink-0 md:space-y-2 opacity-60">
						<div className="flex items-center">
							<Image
								src="/assets/icons/phone.svg"
								alt="phone icon"
								width={46}
								height={46}
							/>
							<Badge
								variant="secondary"
								className="rounded-full ml-auto h-6 text-[#344054] bg-[#E9E9E9] py-1"
							>
								<DotIcon
									stroke="#344054"
									strokeWidth={8}
								/>
								Disabled
							</Badge>
						</div>
						<p className="font-medium text-lg mt-2.5">
							Phone number verification
						</p>
						<p className="text-sm">
							Phone verification codes help guarantee account and transaction
							security. Changing your bound phone number will disable payment
							and withdrawal for 24 hours.
						</p>
						<span className="text-[#667085] text-[15px] font-medium mt-1.5 inline-block">
							Coming soon
						</span>
					</li>
				</ul>
			</div>
			<div className="mt-5">
				<span className="text-sm font-semibold py-2">Advanced Security</span>
				<ul className="mt-5 flex flex-col gap-y-7">
					<Link href="/security/change-password">
						<li className="bg-[#F2F2F0] rounded-2xl border border-[#21241D1A] p-5 xl:max-w-[435px] w-full shrink-0 md:space-y-2">
							<div className="flex items-center">
								<Image
									src="/assets/icons/passcode.svg"
									alt="passcode icon"
									width={46}
									height={46}
								/>
								<Badge
									variant="secondary"
									className="rounded-full ml-auto h-6 text-green-700 bg-green-100 py-1"
								>
									<DotIcon
										stroke="#15803d"
										strokeWidth={8}
									/>
									Enabled
								</Badge>
							</div>
							<p className="font-medium text-lg mt-2.5">Login password</p>
							<p className="text-sm">
								The login password helps guarantee account and transaction
								security. Changing the login password will disable payment and
								withdrawal for 24 hours.
							</p>
							<span className="text-dark-green text-[15px] font-medium mt-1.5 inline-block">
								Change
							</span>
						</li>
					</Link>
				</ul>
			</div>
		</section>
	);
}
