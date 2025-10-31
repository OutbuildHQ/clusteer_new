"use client";

import GoogleAuthForm from "@/components/forms/google-otp-form";
import GoogleAuthQRCode from "@/components/google-auth-qrcode";
import SecurityAlert from "@/components/security-alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

type FormStage =
	| "bind-new-authenticator"
	| "security-verfification"
	| "success";

const formStages: FormStage[] = [
	"bind-new-authenticator",
	"security-verfification",
	"success",
];

export default function Page() {
	const [stage, setStage] = useState<FormStage>(formStages[0]);
	const router = useRouter();

	const idx = useMemo(() => formStages.indexOf(stage), [stage]);

	const goNext = useCallback(() => {
		if (idx < formStages.length - 1) {
			setStage(formStages[idx + 1]);
		} else {
			router.push("/dashboard");
		}
	}, [idx, router]);

	const goBack = useCallback(() => {
		if (idx === 0) {
			router.push("/security");
		} else {
			setStage(formStages[idx - 1]);
		}
	}, [idx, router]);

	const forms = useMemo(
		() => ({
			"bind-new-authenticator": (
				<div className="lg:max-w-[533px] mt-5">
					<SecurityAlert content="For your assets security, it won’t be able to Withdraw or Sell in P2P within 24 hours of after setting up or changing the Google Authentication" />
					<div className="mt-5">
						<span className="font-medium text-lg">
							Add key in Google Authenticator and backup
						</span>
						<p className="text-sm mt-2.5">
							Open Google Authenticator, scan the QR code below or manually
							enter the following key to add a verification token. The key is
							used to retrieve your Google Authenticator if you change or lose
							your phone. Make sure to back up the key before binding.
						</p>
					</div>
					<GoogleAuthQRCode />
					<Button
						onClick={goNext}
						className="mt-7.5 h-11 font-semibold border-black text-[#111111] bg-light-green border text-base shadow-xs hover:bg-muted w-full"
					>
						Next
					</Button>
				</div>
			),
			"security-verfification": (
				<div className="md:max-w-[533px] mt-5 lg:mt-[87px]">
					<GoogleAuthForm onVerificationComplete={goNext} />
				</div>
			),
			success: (
				<div className="mt-5 lg:mt-[73px] w-fit">
					<p className="font-bold text-2xl">
						Your account is secured with Google Authenticator
					</p>

					<Button
						onClick={goNext}
						className="mt-7.5 h-11 font-semibold border-black text-[#111111] bg-light-green border text-base shadow-xs hover:bg-muted w-full"
					>
						Make a transaction
					</Button>
				</div>
			),
		}),
		[goNext]
	);

	return (
		<section className="mt-5 lg:mt-10 pb-[113px] xl:pb-[140px]">
			<header>
				<div className="flex gap-x-5 items-center py-5 border-b lg:py-0 lg:border-b-0 border-[#21241D33]">
					<Button
						variant="ghost"
						className="!p-0 size-6 hover:bg-transparent"
						onClick={goBack}
					>
						<ArrowLeft className="shrink-0 size-full" />
					</Button>
					<h1 className="text-[#181D27] font-semibold text-xl sm:text2xl">
						Configure Google Authenticator
					</h1>
				</div>

				{/* Modern Progress Stepper */}
				<div className="hidden lg:block mt-8 mb-6">
					<div className="flex items-center">
						{formStages.map((s, index) => {
							const isActive = idx === index;
							const isCompleted = idx > index;
							const stepNumber = index + 1;

							return (
								<div key={s} className="flex items-center flex-1 last:flex-none">
									<div className="flex flex-col items-start">
										{/* Step Circle */}
										<div
											className={`
												relative flex items-center justify-center w-6 h-6 rounded-full border transition-all duration-300
												${isCompleted ? 'bg-[#9FE870] border-[#9FE870]' : ''}
												${isActive ? 'bg-white border-[#9FE870] shadow-[0_0_0_2px_rgba(159,232,112,0.15)]' : ''}
												${!isActive && !isCompleted ? 'bg-white border-[#E9EAEB]' : ''}
											`}
										>
											{isCompleted ? (
												<svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
												</svg>
											) : (
												<span className={`text-[10px] font-semibold ${isActive ? 'text-[#9FE870]' : 'text-[#667085]'}`}>
													{stepNumber}
												</span>
											)}
										</div>

										{/* Step Label */}
										<p className={`
											mt-2.5 text-sm font-medium max-w-[140px] transition-colors duration-300
											${isActive ? 'text-[#0D0D0D]' : 'text-[#667085]'}
										`}>
											{s === "bind-new-authenticator"
												? "Bind authenticator"
												: s === "security-verfification"
												? "Verify code"
												: "Complete"}
										</p>
									</div>

									{/* Connector Line */}
									{index < formStages.length - 1 && (
										<div className="flex-1 h-[2px] mx-4 -mt-7">
											<div className={`
												h-full transition-all duration-300
												${isCompleted ? 'bg-[#9FE870]' : 'bg-[#E9EAEB]'}
											`} />
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>

				{/* Mobile Progress Bar */}
				<div className="lg:hidden mt-4">
					<div className="flex items-center gap-2 mb-2">
						<span className="text-sm font-medium text-[#667085]">
							Step {idx + 1} of {formStages.length}
						</span>
					</div>
					<div className="w-full h-2 bg-[#E9EAEB] rounded-full overflow-hidden">
						<div
							className="h-full bg-[#9FE870] transition-all duration-300 ease-out"
							style={{ width: `${((idx + 1) / formStages.length) * 100}%` }}
						/>
					</div>
				</div>
			</header>

			{forms[stage]}
		</section>
	);
}
