"use client";

import { resendOTP, verifyOTP } from "@/lib/api/auth";
import { OTPFormSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ChevronRight, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

type VerifyOTPFormData = z.infer<typeof OTPFormSchema>;

export default function VerifyOTPForm() {
	const [username, setUsername] = useState("");
	const form = useForm<VerifyOTPFormData>({
		resolver: zodResolver(OTPFormSchema),
		mode: "onChange",
		defaultValues: {
			otp: "",
		},
	});

	const router = useRouter();

	useEffect(() => {
		// Get username from localStorage (set during signup)
		const storedUsername = localStorage.getItem("pending_verification_username");
		if (storedUsername) {
			setUsername(storedUsername);
		}
	}, []);

	const buttonRef = useRef<HTMLButtonElement>(null);

	const { isPending: isVerifying, mutate: mutateVerify } = useMutation({
		mutationFn: verifyOTP,
		onSuccess: (data) => {
			if (data.status) {
				toast.success("Account verified successfully!", {
					description: "You can now login with your credentials.",
				});
				// Clear the stored username
				localStorage.removeItem("pending_verification_username");
				// Redirect to login
				setTimeout(() => {
					router.push("/login");
				}, 1500);
			} else {
				toast.error("Verification failed", {
					description: data.message || "Invalid OTP",
				});
			}
		},
		onError: (error: any) => {
			const errorMessage = error?.response?.data?.message || error?.message || "Verification failed";
			toast.error("Verification failed", {
				description: errorMessage,
			});
		},
	});

	const { isPending: isResending, mutate: mutateResend } = useMutation({
		mutationFn: resendOTP,
		onSuccess: (data) => {
			if (data.status) {
				toast.success("OTP resent successfully", {
					description: "Check the console for your new OTP",
				});
			} else {
				toast.error("Failed to resend OTP", {
					description: data.message,
				});
			}
		},
		onError: (error: any) => {
			const errorMessage = error?.response?.data?.message || error?.message || "Failed to resend OTP";
			toast.error("Failed to resend OTP", {
				description: errorMessage,
			});
		},
	});

	const handleAutoSubmit = () => buttonRef.current?.click();

	const onSubmit = (values: VerifyOTPFormData) => {
		if (!username) {
			toast.error("Username required", {
				description: "Please enter your username",
			});
			return;
		}
		const payload = {
			username,
			...values,
		};
		mutateVerify(payload);
	};

	const handleResend = () => {
		if (!username) {
			toast.error("Username required", {
				description: "Please enter your username first",
			});
			return;
		}
		// For resend, we need the email - for now just show message
		toast.info("Resend OTP", {
			description: "Contact support to resend OTP or re-register",
		});
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6 w-full p-5 form-border rounded-2xl"
			>
				{/* Username field */}
				<FormItem className="gap-2.5">
					<FormLabel className="text-[#344054] font-medium">Username</FormLabel>
					<FormControl>
						<Input
							className="h-11"
							placeholder="Enter your username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</FormControl>
					<FormDescription className="text-sm text-gray-500">
						Enter the username you used during signup
					</FormDescription>
				</FormItem>

				{/* OTP field */}
				<FormField
					control={form.control}
					name="otp"
					render={({ field }) => (
						<FormItem className="gap-2.5">
							<FormDescription className="text-[#344054] font-medium">
								Enter Authentication code
							</FormDescription>
							<FormControl>
								<InputOTP
									autoFocus
									maxLength={6}
									pattern={REGEXP_ONLY_DIGITS}
									onComplete={handleAutoSubmit}
									placeholder="000000"
									{...field}
								>
									<InputOTPGroup className="gap-x-3 justify-between w-full">
										{[0, 1, 2, 3, 4, 5].map((i) => (
											<InputOTPSlot
												key={i}
												className="!rounded-sm border-[#D0D5DD] !border-[1.44px] size-[46px] sm:w-[57px] sm:h-[58px] font-medium text-2xl sm:text-3xl"
												index={i}
											/>
										))}
									</InputOTPGroup>
								</InputOTP>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					ref={buttonRef}
					type="submit"
					disabled={isVerifying}
					className="font-mona border-black text-[#111111] bg-light-green border font-semibold text-base shadow-xs hover:bg-muted w-full h-11"
				>
					{isVerifying ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Confirming...
						</>
					) : (
						<>Confirm</>
					)}
				</Button>

				<Button
					type="button"
					variant="outline"
					disabled={isResending}
					onClick={handleResend}
					className="w-full h-11"
				>
					{isResending ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Resending...
						</>
					) : (
						<>
							<RefreshCw className="mr-2 h-4 w-4" />
							Resend OTP
						</>
					)}
				</Button>

				<Link
					href="/login"
					className="text-center lg:mt-2 mx-auto block"
				>
					<span className="text-dark-green font-semibold">Back to Log in</span>
					<ChevronRight className="inline-block size-5 stroke-dark-green ml-2" />
				</Link>
			</form>
		</Form>
	);
}
