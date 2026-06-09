"use client";

import { loginUser } from "@/lib/api/auth";
import { LoginFormSchema } from "@/lib/validation";
import { useUserActions } from "@/store/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export type LoginFormType = z.infer<typeof LoginFormSchema>;

export default function LoginForm() {
	const form = useForm<LoginFormType>({
		resolver: zodResolver(LoginFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const { setUser } = useUserActions();
	const router = useRouter();

	const { isPending, mutate } = useMutation({
		mutationFn: loginUser,
		onSuccess: (res) => {
			if (res.status) {
				setUser(res.data);
				toast.success("Login successful!");
				router.push("/dashboard");
			} else {
				toast.error("Login failed", {
					description: res.message || "Please check your credentials",
				});
			}
		},
		onError: (error: any) => {
			const errorMessage = error?.response?.data?.message || error?.message || "Login failed";
			toast.error("Login failed", {
				description: errorMessage,
			});
		},
	});

	const onSubmit = (data: LoginFormType) => {
		mutate(data);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-y-4 w-full"
			>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem className="gap-1.5">
							<FormLabel className="text-[13px] font-medium text-muted-foreground">
								Email or username
							</FormLabel>
							<FormControl>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										type="email"
										className="h-10 pl-10"
										placeholder="you@example.com"
										{...field}
									/>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={() => (
						<FormItem className="gap-1.5">
							<FormLabel className="text-[13px] font-medium text-muted-foreground">
								Password
							</FormLabel>
							<FormControl>
								<PasswordInput name="password" control={form.control} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex justify-between items-center text-[13px]">
					<label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
						<input type="checkbox" defaultChecked className="rounded" />
						Keep me signed in
					</label>
					<Link
						href="/forgot-password"
						className="text-custom-black/70 font-medium hover:underline"
					>
						Forgot password?
					</Link>
				</div>

				<Button
					type="submit"
					disabled={isPending}
					size="lg"
					className="w-full mt-1"
				>
					{isPending ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Signing in...
						</>
					) : (
						"Sign in"
					)}
				</Button>

				<div className="text-center text-[13px] text-muted-foreground">
					New to Clusteer?{" "}
					<Link href="/signup" className="text-custom-black/70 font-medium hover:underline">
						Create account
					</Link>
				</div>
			</form>
		</Form>
	);
}
