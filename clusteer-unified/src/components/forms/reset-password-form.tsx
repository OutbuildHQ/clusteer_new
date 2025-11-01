"use client";

import { resetPassword } from "@/lib/api/auth";
import { ResetPasswordFormSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PasswordInput from "../password-input";
import { Button } from "../ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Toast } from "../toast";

type ResetPasswordFormData = z.infer<typeof ResetPasswordFormSchema>;
export type ResetPasswordPayload = ResetPasswordFormData & { token: string };

export default function ResetPasswordForm({ token }: { token: string }) {
	const form = useForm<ResetPasswordFormData>({
		resolver: zodResolver(ResetPasswordFormSchema),
		defaultValues: {
			newPassword: "",
			confirmPassword: "",
		},
	});

	const router = useRouter();

	const { isPending, mutate } = useMutation({
		mutationFn: resetPassword,
		onSuccess: () => {
			Toast.success("Password successfully reset. You can now log in.");
			router.push("/login");
		},
		onError: (error: any) => {
			const errorMessage = error?.response?.data?.message || error?.message;
			if (errorMessage?.toLowerCase().includes("expired")) {
				Toast.error("This reset link has expired. Please request a new one.");
			} else if (errorMessage?.toLowerCase().includes("match")) {
				Toast.error("Passwords do not match.");
			} else {
				Toast.error(errorMessage || "Failed to reset password");
			}
		},
	});

	const onSubmit = (data: ResetPasswordFormData) => {
		const payload = { ...data, token };
		mutate(payload);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6 w-full p-5 form-border rounded-2xl"
			>
				<FormField
					control={form.control}
					name="newPassword"
					render={({ field }) => (
						<FormItem className="gap-1.5">
							<FormLabel className="font-medium">New Password</FormLabel>
							<FormControl>
								<PasswordInput {...field} placeholder="********" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem className="gap-1.5">
							<FormLabel className="font-medium">Confirm New Password</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="password"
									placeholder="must match new password"
									className="h-11"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					disabled={isPending}
					className="font-mona border-black text-[#111111] bg-light-green border font-semibold text-base shadow-xs hover:bg-muted w-full h-11"
				>
					{isPending ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Resetting...
						</>
					) : (
						<>Reset Password</>
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
