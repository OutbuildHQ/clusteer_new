"use client";

import { PaymentFormSchema } from "@/lib/validation";
import { MODAL_IDS, useModalActions } from "@/store/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

type PaymentFormType = z.infer<typeof PaymentFormSchema>;

export default function FiatReceiveForm() {
	const form = useForm<PaymentFormType>({
		resolver: zodResolver(PaymentFormSchema),
		defaultValues: {
			accountNo: "",
			accoutName: "",
			bank: "",
		},
	});

	const { openModal } = useModalActions();

	const onSubmit = () => {
		openModal(MODAL_IDS.SUCCESS);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-y-4.5"
			>
				<FormField
					control={form.control}
					name="accountNo"
					render={({ field }) => (
						<FormItem className="gap-1.5">
							<FormLabel className="font-bold text-[#21241D]">
								Account Number / NUBAN
							</FormLabel>
							<FormDescription className="text-[#344054] font-medium">
								Ensure your account detail is accurate to avoid loss due to
								error
							</FormDescription>
							<FormControl>
								<Input
									className="h-[54px] border border-[#E9EAEB] rounded-2xl placeholder:text-muted-foreground font-bold text-[#21241D]"
									placeholder="0000000000"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="accoutName"
					render={({ field }) => (
						<FormItem className="gap-1.5">
							<FormLabel className="font-bold text-[#21241D]">
								Account Name
							</FormLabel>
							<FormDescription className="text-[#344054] font-medium">
								Enter your recipient account name
							</FormDescription>
							<FormControl>
								<Input
									className="h-[54px] border border-[#E9EAEB] rounded-2xl placeholder:text-muted-foreground font-bold text-[#21241D]"
									placeholder="John Doe"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="bank"
					render={({ field }) => (
						<FormItem className="gap-1.5">
							<FormLabel className="font-bold text-[#21241D]">
								Bank Name
							</FormLabel>
							<FormDescription className="text-[#344054] font-medium">
								Enter your recipient bank name
							</FormDescription>
							<FormControl>
								<Input
									className="h-[54px] border border-[#E9EAEB] rounded-2xl placeholder:text-muted-foreground font-bold text-[#21241D]"
									placeholder="Access Bank"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					className="bg-[#21241D] rounded-[100px] w-full font-medium h-[38px] px-5 text-[15px]"
				>
					Confirm
				</Button>
			</form>
		</Form>
	);
}
