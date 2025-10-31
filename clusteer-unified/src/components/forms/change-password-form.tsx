"use client";

import { ChangePasswordFormSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PasswordInput from "../password-input";
import SecurityAlert from "../security-alert";
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
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/lib/api/auth";
import { Toast } from "@/components/toast";
import { Loader2 } from "lucide-react";

export type ChangePasswordFormData = z.infer<typeof ChangePasswordFormSchema>;

export default function ChangePasswordForm() {
	const form = useForm<ChangePasswordFormData>({
		resolver: zodResolver(ChangePasswordFormSchema),
		defaultValues: {
			newPassword: "",
			confirmPassword: "",
		},
	});

	const { isPending, mutate: updatePassword } = useMutation({
		mutationFn: changePassword,
		onSuccess: () => {
			Toast.success("Password changed successfully");
			form.reset();
			// Redirect to security page after success
			window.location.href = "/security";
		},
		onError: (error: any) => {
			Toast.error(error?.response?.data?.message || "Failed to change password");
		},
	});

	const onSubmit = (data: ChangePasswordFormData) => {
		updatePassword(data);
	};

	return (
		<div>
			<SecurityAlert content="To ensure asset security, withdrawals and P2P sales are disabled for 24 hours after changing your password." />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 w-full mt-8"
				>
					<FormField
						control={form.control}
						name="newPassword"
						render={({ field }) => (
							<FormItem className="gap-1.5">
								<FormLabel className="font-bold">New Password</FormLabel>
								<FormControl>
									<PasswordInput {...field} />
								</FormControl>
								<FormDescription className="text-[#475467]">
									8–32 characters, including a number, uppercase letter,
									and special character
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem className="gap-1.5">
								<FormLabel className="font-bold">Confirm Password</FormLabel>
								<FormControl>
									<PasswordInput {...field} />
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
								Updating...
							</>
						) : (
							<>Submit</>
						)}
					</Button>
				</form>
			</Form>
		</div>
	);
}
