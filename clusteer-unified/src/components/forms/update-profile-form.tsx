"use client";

import { deleteUserAccount, updateUser } from "@/lib/api/user/actions";
import { getUserInfo } from "@/lib/api/user/queries";
import { getFormattedDate } from "@/lib/utils";
import { UpdateProfileFormSchema } from "@/lib/validation";
import { IUser } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CopyButton } from "../copy-button";
import { Toast } from "../toast";
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
import UploadAvatar from "../upload-avatar";

export type UpdateProfileFormData = z.infer<typeof UpdateProfileFormSchema>;

export default function UpdateProfileForm() {
	const { data: user, isPending } = useQuery({
		queryKey: ["user"],
		queryFn: getUserInfo,
	});

	const [avatarImage, setAvatarImage] = useState<File | null>(null);

	const [isUpdated, setIsUpdated] = useState(false);

	const handleImageSelect = useCallback((file: File) => {
		setAvatarImage(file);
		setIsUpdated(true);
	}, []);

	const reset = () => {
		form.reset({ ...user });
		setAvatarImage(null);
		setIsUpdated(false);
	};

	const queryClient = useQueryClient();

	const { isPending: isUpdating, mutate: updateProfile } = useMutation({
		mutationFn: updateUser,
		onMutate: async ({ profile }) => {
			await queryClient.cancelQueries({ queryKey: ["user"] });

			const prevUser = queryClient.getQueryData<IUser>(["user"]);
			if (!prevUser) return { prevUser };

			queryClient.setQueryData<IUser>(["user"], (old) => {
				if (!old) return old;

				return {
					...old,
					...Object.fromEntries(
						Object.entries(profile).filter(
							([, value]) =>
								value !== "" && value !== null && value !== undefined
						)
					),
				};
			});

			return { prevUser };
		},

		onSuccess: () => {
			Toast.success("Profile updated successfully");
		},
		onError: (err, updatedTodo, context) => {
			queryClient.setQueryData(["user"], context?.prevUser);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
			reset();
		},
	});

	const { isPending: isDeleting, mutate: deleteAccount } = useMutation({
		mutationFn: deleteUserAccount,
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
	});

	const form = useForm<UpdateProfileFormData>({
		mode: "onChange",
		resolver: zodResolver(UpdateProfileFormSchema),
		defaultValues: {
			firstName: user?.firstName || "",
			lastName: user?.lastName || "",
			username: user?.username || "",
			email: user?.email || "",
			phone: user?.phone || "",
		},
		values: user ? {
			firstName: user.firstName || "",
			lastName: user.lastName || "",
			username: user.username || "",
			email: user.email || "",
			phone: user.phone || "",
		} : undefined,
	});

	const isBusy = isDeleting || isUpdating || isPending;
	const isFormInvalid = !form.formState.isValid;

	const onSubmit = (values: UpdateProfileFormData) => {
		const updatePayload: Parameters<typeof updateUser>[0] = {
			profile: values,
			avatar: null,
		};

		if (avatarImage) {
			const formData = new FormData();
			formData.append("avatar", avatarImage);
			updatePayload.avatar = formData;
		}

		updateProfile(updatePayload);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-y-4.5 lg:gap-5"
			>
				<FormField
					control={form.control}
					name="firstName"
					render={({ field }) => (
						<FormItem className="flex flex-col lg:flex-row gap-y-4 lg:gap-x-8 pb-5 border-b border-[#E9EAEB]">
							<FormLabel className="font-semibold text-[#414651] gap-x-0.5 shrink-0 lg:max-w-[280px] w-full">
								First Name <span className="text-[#008000]">*</span>
							</FormLabel>
							<FormControl>
								<Input
									className="h-11 border border-[#D5D7DA] rounded-full text-[#181D27] py-2.5 px-3.5 shadow-[0px_1px_2px_0px_#0A0D120D] lg:max-w-[512px]"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="lastName"
					render={({ field }) => (
						<FormItem className="flex flex-col lg:flex-row gap-y-4 lg:gap-x-8 pb-5 border-b border-[#E9EAEB]">
							<FormLabel className="font-semibold text-[#414651] gap-x-0.5 shrink-0 lg:max-w-[280px] w-full">
								Last Name <span className="text-[#008000]">*</span>
							</FormLabel>
							<FormControl>
								<Input
									className="h-11 border border-[#D5D7DA] rounded-full text-[#181D27] py-2.5 px-3.5 shadow-[0px_1px_2px_0px_#0A0D120D] lg:max-w-[512px]"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem className="flex flex-col lg:flex-row gap-y-4 lg:gap-x-8 pb-5 border-b border-[#E9EAEB]">
							<FormLabel className="font-semibold text-[#414651] gap-x-0.5 lg:max-w-[280px] w-full">
								Username <span className="text-[#008000]">*</span>
							</FormLabel>
							<FormControl>
								<Input
									disabled
									className="h-11 border border-[#D5D7DA] rounded-full text-[#181D27] py-2.5 px-3.5 shadow-[0px_1px_2px_0px_#0A0D120D] lg:max-w-[512px]"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem className="flex flex-col lg:flex-row gap-y-4 lg:gap-x-8 pb-5 border-b border-[#E9EAEB]">
							<FormLabel className="font-semibold text-[#414651] gap-x-0.5 lg:max-w-[280px] w-full">
								Email <span className="text-[#008000]">*</span>
							</FormLabel>
							<FormControl>
								<div className="flex w-full gap-x-2 items-center h-11 py-2.5 px-3.5 border border-[#D5D7DA] rounded-full text-[#181D27] shadow-[0px_1px_2px_0px_#0A0D120D] overflow-hidden lg:max-w-[512px]">
									<Mail
										size={20}
										stroke="#717680"
									/>
									<Input
										disabled
										className="p-0 rounded-none h-full border-0 shadow-none"
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
						<FormItem className="flex flex-col lg:flex-row gap-y-4 lg:gap-x-8 pb-5 border-b border-[#E9EAEB]">
							<FormLabel className="font-semibold text-[#414651] gap-x-0.5 lg:max-w-[280px] w-full">
								Phone number <span className="text-[#008000]">*</span>
							</FormLabel>
							<FormControl>
								<div className="flex w-full lg:max-w-[512px] gap-x-2 items-center h-11 py-2.5 px-3.5 border border-[#D5D7DA] rounded-full text-[#181D27] shadow-[0px_1px_2px_0px_#0A0D120D] overflow-hidden">
									<Image
										src="/assets/icons/phone-call.svg"
										alt="phone icon"
										width={20}
										height={20}
									/>
									<Input
										type="tel"
										className="p-0 rounded-none h-full border-0 shadow-none"
										{...field}
									/>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<UploadAvatar
					username={user?.username}
					currentAvatar={
						avatarImage ? URL.createObjectURL(avatarImage) : user?.avatar
					}
					onImageSelect={handleImageSelect}
				/>

				<div className="flex flex-col items-center lg:flex-row gap-y-4 lg:gap-x-8 pb-5 border-b border-[#E9EAEB]">
					<span className="font-semibold lg:max-w-[280px] w-full text-[#414651] gap-x-0.5 text-sm">
						User ID
					</span>
					<div className="flex items-center gap-x-2 py-2.5 px-11.5 ml-auto capitalize">
						<span>{user?.username}</span>
						<CopyButton
							value={user?.username}
							icon="/assets/icons/copy.svg"
							className="shrink-0 border-0 p-0 size-4.5 hover:bg-transparent"
						/>
					</div>
				</div>
				<div className="flex  items-center flex-col lg:flex-row gap-y-4 lg:gap-x-8 pb-5 border-b border-[#E9EAEB]">
					<span className="font-semibold lg:max-w-[280px] w-full text-[#414651] gap-x-0.5 text-sm">
						Registration date
					</span>
					<div className="py-2.5 px-11.5 ml-auto">
						{getFormattedDate(
							new Date(user?.dateJoined ? user?.dateJoined : "")
						)}
					</div>
				</div>
				<div className="flex">
					<Button
						type="button"
						onClick={() => deleteAccount()}
						variant="link"
						className="p-0 text-sm text-destructive font-semibold"
						disabled={isBusy}
					>
						Close account
					</Button>
					<div className="ml-auto flex gap-x-3">
						<Button
							type="button"
							variant="outline"
							disabled={isBusy}
							onClick={reset}
							className="p-0 text-sm text-[#414651] font-semibold h-10 px-3.5"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							variant="outline"
							disabled={
								isBusy ||
								isFormInvalid ||
								(!form.formState.isDirty && !isUpdated)
							}
							className="p-0 text-sm font-semibold h-10 px-3.5 gradient-border bg-[#11C211] border-[#0a0d120d] text-white"
						>
							{isUpdating ? "Saving..." : "Save"}
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
