"use client";

import { IdentityVerficationFormSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { CircleSmall } from "lucide-react";

type IdentityVerficationFormtype = z.infer<
	typeof IdentityVerficationFormSchema
>;

export default function IdentityVerificationForm() {
	const form = useForm<IdentityVerficationFormtype>({
		resolver: zodResolver(IdentityVerficationFormSchema),
		defaultValues: {
			residency: "nigeria",
		},
	});

	const onSubmit = (values: FieldValues) => console.log(values);

	return (
		<Form {...form}>
			<form
				className="mt-4.5"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<FormField
					control={form.control}
					name="residency"
					render={({ field }) => (
						<FormItem className="gap-1.5">
							<FormLabel className="font-medium text-black">
								Residency
							</FormLabel>
							<FormControl>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger className="w-full border-black shadow-[0px_1px_2px_0px_#1018280D">
											<SelectValue />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="asia">Asia</SelectItem>
										<SelectItem value="nigeria">Nigeria</SelectItem>
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
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
					type="submit"
					className="border-black bg-light-green border text-black font-semibold text-base hover:bg-muted w-full h-11 mt-20"
				>
					Continue
				</Button>
			</form>
		</Form>
	);
}
