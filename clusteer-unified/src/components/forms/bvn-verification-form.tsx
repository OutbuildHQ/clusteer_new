"use client";

import { BVNVerificationFormSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pentagon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { useUser, useUserActions } from "@/store/user";

export type BVNVerificationFormData = z.infer<typeof BVNVerificationFormSchema>;

export default function BVNVerficationForm() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const user = useUser();
	const { setUser } = useUserActions();
	const form = useForm<BVNVerificationFormData>({
		mode: "onChange",
		resolver: zodResolver(BVNVerificationFormSchema),
		defaultValues: {
			bvn: "",
		},
	});

	const [isChecked, setIsChecked] = useState(false);
	const [isPending, setIsPending] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const bvnValue = form.watch("bvn");

	const handleCheckedChange = (checked: boolean) => {
		setIsChecked(!!checked);
	};

	const isFormValid = bvnValue.length === 11 && /^\d+$/.test(bvnValue) && isChecked;

	const onSubmit = async (data: BVNVerificationFormData) => {
		setIsPending(true);
		console.log("BVN submitted:", data);

		try {
			// Call KYC verification API
			const response = await fetch("/api/kyc/verify", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					verificationType: "BVN",
					data: {
						bvn: data.bvn,
						// TODO: In production, call a BVN verification service
					},
				}),
			});

			const result = await response.json();

			if (result.status) {
				// Success - show "Under Review" modal then navigate to dashboard
				setShowSuccessModal(true);

				// Immediately update user store with verified status
				if (user) {
					setUser({ ...user, is_verified: true });
				}

				// Invalidate user query to refresh user data
				queryClient.invalidateQueries({ queryKey: ["user"] });

				// Wait 3 seconds before navigating
				setTimeout(() => {
					router.push("/dashboard");
				}, 3000);
			} else {
				// Handle error
				console.error("Verification failed:", result.message);
				alert(result.message || "Verification failed. Please try again.");
				setIsPending(false);
			}
		} catch (error) {
			console.error("Error submitting verification:", error);
			alert("An error occurred. Please try again.");
			setIsPending(false);
		}
	};

	return (
		<Form {...form}>
			<form
				className="mt-10.5"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<FormField
					control={form.control}
					name="bvn"
					render={({ field }) => (
						<FormItem className="gap-1.5">
							<FormLabel className="font-medium">
								Enter your Bank Verification Number (BVN)
							</FormLabel>
							<FormControl>
								<Input
									className="h-11"
									placeholder="Enter your BVN"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="mt-12 space-y-4">
					<p>
						Clusteer wants to access your BVN information. By clicking Continue,
						you agree to allow Clusteer to:
					</p>
					<ul className="text-sm space-y-0.5">
						<li className="flex items-center gap-x-2.5 py-1 px-2.5">
							<Pentagon
								fill="#000"
								className="inline-block size-2"
							/>
							Process your personal details
						</li>
						<li className="flex items-center gap-x-2.5 py-1 px-2.5">
							<Pentagon
								fill="#000"
								className="inline-block size-2"
							/>
							Process your contact information
						</li>
						<li className="flex items-center gap-x-2.5 py-1 px-2.5">
							<Pentagon
								fill="#000"
								className="inline-block size-2"
							/>
							Process your document information
						</li>
					</ul>
					<div className="flex gap-x-2.5 p-2.5 rounded-md bg-[#F3F3F3]">
						<Checkbox
							id="privacy-policy"
							checked={isChecked}
							onCheckedChange={handleCheckedChange}
							className="data-[state=checked]:border-light-green data-[state=checked]:bg-light-green data-[state=checked]:text-white"
						/>
						<Label
							htmlFor="privacy-policy"
							className="font-normal gap-x-1"
						>
							I have read and accept Clusteer's
							<Link
								href="/privacy-policy"
								target="_blank"
								rel="noopener noreferrer"
								className="text-dark-green underline"
							>
								privacy policy
							</Link>
						</Label>
					</div>
				</div>

				<Button
					type="submit"
					disabled={!isFormValid || isPending}
					className="mt-10 font-mona border-black text-[#111111] bg-light-green border font-semibold text-base shadow-xs hover:bg-muted w-full h-11 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isPending ? "Submitting..." : "Continue"}
				</Button>
			</form>

			{/* Under Review Success Modal */}
			{showSuccessModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
					<div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
						<Image
							className="object-cover"
							src="/assets/icons/hour_glass.svg"
							alt="under review icon"
							width={150}
							height={150}
						/>
						<h2 className="text-3xl font-bold mt-8">Under Review</h2>
						<p className="font-medium text-lg text-gray-600 mt-6 leading-relaxed">
							You will receive an email/app notification once the review is completed.
						</p>
						<p className="font-medium text-lg text-gray-800 mt-4">
							Estimated review time:
						</p>
						<p className="font-bold text-2xl text-dark-green mt-2">1 Hour(s)</p>
					</div>
				</div>
			)}
		</Form>
	);
}
