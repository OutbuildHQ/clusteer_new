"use client";

import { ArrowLeft, CircleSmall } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { FormItem } from "./ui/form";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

type VerficationType = "NIN" | "BVN" | null;

export default function IdentityVerfication() {
	const [selectedOption, setSelectedOption] = useState<VerficationType>("BVN");
	const [step, setStep] = useState(1);

	const goBack = () => setStep(1);

	const goNext = () => setStep(2);

	return (
		<>
			{step === 1 && (
				<div className="w-full lg:max-w-[478px]">
					<header className="flex gap-x-5 items-center">
						<Link href="/identity-verification">
							<ArrowLeft className="shrink-0 size-6" />
						</Link>
						<h1 className="font-semibold text-3xl">Let’s get you verified</h1>
					</header>
					<p className="text-[#1A1A1C] mt-2.5">
						Select your residency and follow the steps
					</p>

					<div className="mt-4.5">
						<FormItem className="gap-1.5">
							<Label className="font-medium text-black">Residency</Label>
							<Select defaultValue="nigeria">
								<SelectTrigger className="w-full border-black shadow-[0px_1px_2px_0px_#1018280D">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="asia">Asia</SelectItem>
									<SelectItem value="nigeria">Nigeria</SelectItem>
								</SelectContent>
							</Select>
						</FormItem>

						<div className="mt-7">
							<p className="text-[#1A1A1C]">
								Complete the following steps to verify your account in{" "}
								<span className="font-bold">5 minutes</span>
							</p>
							<ul className="list-circle mt-7.5 text-[#1A1A1C]">
								<li className="flex items-center gap-x-2.5 p-2.5">
									<CircleSmall
										size={13}
										strokeWidth={3}
									/>
									Government-issued ID
								</li>
								<li className="flex items-center gap-x-2.5 p-2.5">
									<CircleSmall
										size={13}
										strokeWidth={3}
									/>
									Liveness check
								</li>
							</ul>
						</div>
						<Button
							type="button"
							variant="ghost"
							onClick={goNext}
							className="border-black bg-light-green font-semibold w-full h-11 text-base mt-[82px] border text-black"
						>
							Continue
						</Button>
					</div>
				</div>
			)}
			{step === 2 && (
				<div className="w-full lg:max-w-[478px]">
					<header className="flex gap-x-5 items-center">
						<Button
							variant="ghost"
							className="!p-0 size-6"
							onClick={goBack}
						>
							<ArrowLeft className="shrink-0 size-full" />
						</Button>
						<h1 className="font-semibold text-3xl">Document Verification</h1>
					</header>
					<p className="text-[#1A1A1C] mt-2.5">
						Your ID will be scanned for personal data extraction
					</p>

					<div className="mt-6">
						<RadioGroup
							className="gap-y-2.5"
							onValueChange={(value) =>
								setSelectedOption(value.toUpperCase() as VerficationType)
							}
							value={selectedOption}
						>
							<div className="bg-[#F3F3F3] border border-light-green rounded-sm p-5">
								<div className="flex items-center justify-between font-inter">
									<div>
										<Label
											className="text-[#344054]"
											htmlFor="bvn"
										>
											Bank Verification Number (BVN)
										</Label>
										<Badge
											variant="secondary"
											className="h-5 bg-pale-green px-3 text-dark-green rounded-none font-medium text-sm mt-1"
										>
											Recommended
										</Badge>
									</div>
									<RadioGroupItem
										className="ml-auto"
										indicatorClassName="fill-dark-green stroke-dark-green"
										value="BVN"
										id="bvn"
									/>
								</div>
							</div>

							<div className="bg-[#F3F3F3] border border-light-green rounded-sm p-5">
								<div className="flex items-center justify-between font-inter">
									<Label
										className="text-[#344054]"
										htmlFor="nin"
									>
										National Identity Number (NIN)
									</Label>
									<RadioGroupItem
										className="ml-auto"
										indicatorClassName="fill-dark-green stroke-dark-green"
										value="NIN"
										id="nin"
									/>
								</div>
							</div>
						</RadioGroup>

						<Link
							href={`/identity-verification/verify/${selectedOption?.toLocaleLowerCase()}`}
						>
							<Button className="border-black bg-light-green border text-black font-semibold text-base hover:bg-muted w-full h-11 mt-14.5">
								Continue
							</Button>
						</Link>
					</div>
				</div>
			)}
		</>
	);
}
