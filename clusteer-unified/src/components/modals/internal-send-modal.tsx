"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import { Toast } from "@/components/toast";
import { Loader2, UserCheck } from "lucide-react";
import { sendInternalTransfer, verifyRecipient } from "@/lib/api/transfer";

const InternalSendSchema = z.object({
	recipientUserId: z.string().min(1, "Recipient User ID is required"),
	amount: z.number().positive("Amount must be greater than 0"),
	note: z.string().max(200, "Note must be 200 characters or less").optional(),
});

type InternalSendFormData = z.infer<typeof InternalSendSchema>;

interface InternalSendModalProps {
	isOpen: boolean;
	onClose: () => void;
	asset: string;
	balance: number;
}

export default function InternalSendModal({
	isOpen,
	onClose,
	asset,
	balance,
}: InternalSendModalProps) {
	const [recipientInfo, setRecipientInfo] = useState<{
		username: string;
		verified: boolean;
	} | null>(null);

	const form = useForm<InternalSendFormData>({
		resolver: zodResolver(InternalSendSchema),
		defaultValues: {
			recipientUserId: "",
			amount: 0,
			note: "",
		},
	});

	const recipientUserId = form.watch("recipientUserId");

	// Verify recipient when User ID is entered
	const { isLoading: isVerifying } = useQuery({
		queryKey: ["verify-recipient", recipientUserId],
		queryFn: () => verifyRecipient(recipientUserId),
		enabled: recipientUserId.length > 10, // UUID minimum length
		retry: false,
		onSuccess: (data) => {
			if (data.status && data.data) {
				setRecipientInfo({
					username: data.data.username,
					verified: data.data.is_verified,
				});
			}
		},
		onError: () => {
			setRecipientInfo(null);
			form.setError("recipientUserId", {
				message: "User not found",
			});
		},
	});

	const { mutate: sendTransfer, isPending } = useMutation({
		mutationFn: sendInternalTransfer,
		onSuccess: () => {
			Toast.success("Transfer completed successfully!");
			onClose();
			form.reset();
			setRecipientInfo(null);
		},
		onError: (error: any) => {
			const errorMessage = error?.response?.data?.message || "Transfer failed";
			Toast.error(errorMessage);
		},
	});

	const onSubmit = (data: InternalSendFormData) => {
		if (data.amount > balance) {
			Toast.error("Insufficient balance");
			return;
		}

		sendTransfer({
			recipientUserId: data.recipientUserId,
			asset,
			amount: data.amount,
			note: data.note,
		});
	};

	const handleClose = () => {
		onClose();
		form.reset();
		setRecipientInfo(null);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">
						Internal Send
					</DialogTitle>
					<DialogDescription className="text-base">
						Send {asset} to another Clusteer user instantly
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
						<div className="bg-green-50 border border-green-200 rounded-lg p-4">
							<p className="text-sm text-gray-700">
								<span className="font-semibold">Available Balance:</span>{" "}
								{balance.toFixed(4)} {asset}
							</p>
						</div>

						<FormField
							control={form.control}
							name="recipientUserId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Recipient User ID</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												placeholder="Enter recipient's User ID"
												className="h-11"
												{...field}
											/>
											{isVerifying && (
												<div className="absolute right-3 top-3">
													<Loader2 className="h-5 w-5 animate-spin text-gray-400" />
												</div>
											)}
										</div>
									</FormControl>
									<FormDescription>
										You can find User IDs in the recipient's profile
									</FormDescription>
									{recipientInfo && (
										<div className="flex items-center gap-2 mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
											<UserCheck className="h-5 w-5 text-dark-green" />
											<div>
												<p className="text-sm font-semibold text-gray-900">
													@{recipientInfo.username}
												</p>
												{recipientInfo.verified && (
													<p className="text-xs text-dark-green">
														✓ Verified User
													</p>
												)}
											</div>
										</div>
									)}
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="amount"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Amount</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												type="number"
												step="0.0001"
												placeholder="0.00"
												className="h-11 pr-16"
												{...field}
												onChange={(e) =>
													field.onChange(parseFloat(e.target.value) || 0)
												}
											/>
											<span className="absolute right-3 top-3 text-sm font-semibold text-gray-600">
												{asset}
											</span>
										</div>
									</FormControl>
									<FormDescription>
										Minimum: 0.001 {asset}
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="note"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Note (Optional)</FormLabel>
									<FormControl>
										<Input
											placeholder="Add a note for this transfer"
											className="h-11"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Max 200 characters
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
							<p className="text-sm text-gray-700">
								<span className="font-semibold">Note:</span> Internal transfers are instant and free.
								Make sure you verify the recipient's User ID before sending.
							</p>
						</div>

						<div className="flex gap-3 justify-end">
							<Button
								type="button"
								onClick={handleClose}
								variant="outline"
								disabled={isPending}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isPending || !recipientInfo}
								className="bg-dark-green hover:bg-dark-green/90"
							>
								{isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Sending...
									</>
								) : (
									"Send"
								)}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
