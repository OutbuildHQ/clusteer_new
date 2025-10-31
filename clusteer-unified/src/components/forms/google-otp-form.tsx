"use client";

import { OTPFormSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { Toast } from "@/components/toast";
import { z } from "zod";
import { Button } from "../ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
} from "../ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Label } from "../ui/label";
import { useMutation } from "@tanstack/react-query";
import { verifyGoogleAuthOTP } from "@/lib/api/auth";
import { Loader2 } from "lucide-react";
import { useUser } from "@/store/user";

type GoogleOTPFormData = z.infer<typeof OTPFormSchema>;

export default function GoogleAuthForm({
	onVerificationComplete,
}: {
	onVerificationComplete: () => void;
}) {
	const form = useForm<GoogleOTPFormData>({
		resolver: zodResolver(OTPFormSchema),
		mode: "onChange",
		defaultValues: {
			otp: "",
		},
	});

	const buttonRef = useRef<HTMLButtonElement>(null);

	const { isPending, mutate: verifyOTP } = useMutation({
		mutationFn: verifyGoogleAuthOTP,
		onSuccess: () => {
			Toast.success("2FA Setup Successful");
			onVerificationComplete();
		},
	});

	const user = useUser();

	const onSubmit = (payload: GoogleOTPFormData) => {
		verifyOTP({
			username: user!.username,
			payload,
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="otp"
					render={({ field }) => (
						<FormItem className="gap-2.5">
							<Label className="font-bold text-lg sm:text-xl">
								Google Authenticator Verification Code
							</Label>
							<FormDescription className="text-[#344054] font-medium">
								Enter Google Authenticator code
							</FormDescription>
							<FormControl>
								<InputOTP
									maxLength={6}
									pattern={REGEXP_ONLY_DIGITS}
									onComplete={() => buttonRef.current?.click()}
									placeholder="000000"
									{...field}
								>
									<InputOTPGroup className="gap-x-3 justify-between w-full">
										<InputOTPSlot
											className="!rounded-sm border-[#D0D5DD] !border-[1.44px] size-[46px] sm:w-[57px] sm:h-[58px] font-medium text-2xl sm:text-3xl"
											index={0}
										/>
										<InputOTPSlot
											className="!rounded-sm border-[#D0D5DD] !border-[1.44px] size-[46px] sm:w-[57px] sm:h-[58px] font-medium text-2xl sm:text-3xl"
											index={1}
										/>
										<InputOTPSlot
											className="!rounded-sm border-[#D0D5DD] !border-[1.44px] size-[46px] sm:w-[57px] sm:h-[58px] font-medium text-2xl sm:text-3xl"
											index={2}
										/>
										<InputOTPSlot
											className="!rounded-sm border-[#D0D5DD] !border-[1.44px] size-[46px] sm:w-[57px] sm:h-[58px] font-medium text-2xl sm:text-3xl"
											index={3}
										/>
										<InputOTPSlot
											className="!rounded-sm border-[#D0D5DD] !border-[1.44px] size-[46px] sm:w-[57px] sm:h-[58px] font-medium text-2xl sm:text-3xl"
											index={4}
										/>
										<InputOTPSlot
											className="!rounded-sm border-[#D0D5DD] !border-[1.44px] size-[46px] sm:w-[57px] sm:h-[58px] font-medium text-2xl sm:text-3xl"
											index={5}
										/>
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
					disabled={isPending}
					className="mt-7.5 h-11 font-semibold border-black text-[#111111] bg-light-green border text-base shadow-xs hover:bg-muted w-full"
				>
					{isPending ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Confirming...
						</>
					) : (
						<>Confirm</>
					)}
				</Button>
			</form>
		</Form>
	);
}
