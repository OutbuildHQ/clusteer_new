"use client";

import { registerUser } from "@/lib/api/auth";
import { SignupFormSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, User, Mail, Phone, Lock } from "lucide-react";
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

export type SignupFormData = z.infer<typeof SignupFormSchema>;

export default function SignUpForm() {
	const router = useRouter();
	const form = useForm<SignupFormData>({
		mode: "onChange",
		resolver: zodResolver(SignupFormSchema),
		defaultValues: {
			username: "",
			email: "",
			phone: "",
			password: "",
		},
	});

	const { isPending, mutate } = useMutation({
		mutationFn: registerUser,
		onSuccess: (data) => {
			if (data.status) {
				toast.success("Registration successful!", {
					description: "Please check your email to verify your account.",
					duration: 5000,
				});
				setTimeout(() => {
					router.push("/login");
				}, 2000);
			} else {
				toast.error("Registration failed", {
					description: data.message || "Please try again",
				});
			}
		},
		onError: (error: any) => {
			const errorMessage = error?.response?.data?.message || error?.message || "Registration failed";
			toast.error("Registration failed", {
				description: errorMessage,
			});
		},
	});

	const onSubmit = (data: SignupFormData) => {
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
					name="username"
					render={({ field }) => (
						<FormItem className="gap-1.5">
							<FormLabel className="text-[13px] font-medium text-muted-foreground">
								Username
							</FormLabel>
							<FormControl>
								<div className="relative">
									<User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										className="h-10 pl-10"
										placeholder="Choose a username"
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
					name="email"
					render={({ field }) => (
						<FormItem className="gap-1.5">
							<FormLabel className="text-[13px] font-medium text-muted-foreground">
								Email
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
					name="phone"
					render={({ field }) => (
						<FormItem className="gap-1.5">
							<FormLabel className="text-[13px] font-medium text-muted-foreground">
								Phone number
							</FormLabel>
							<FormControl>
								<div className="relative">
									<Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										type="tel"
										className="h-10 pl-10"
										placeholder="080 xxxx xxxx"
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
							<p className="text-xs text-muted-foreground">Must be at least 8 characters.</p>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					disabled={isPending}
					size="lg"
					className="w-full mt-1"
				>
					{isPending ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Creating account...
						</>
					) : (
						"Create account"
					)}
				</Button>

				<div className="text-center text-[13px] text-muted-foreground">
					Already have an account?{" "}
					<Link href="/login" className="text-custom-black/70 font-medium hover:underline">
						Sign in
					</Link>
				</div>
			</form>
		</Form>
	);
}
