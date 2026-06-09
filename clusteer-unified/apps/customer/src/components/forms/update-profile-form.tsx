"use client";

import { deleteUserAccount, updateUser } from "@/lib/api/user/actions";
import { getUserInfo } from "@/lib/api/user/queries";
import { getFormattedDate } from "@/lib/utils";
import { UpdateProfileFormSchema } from "@/lib/validation";
import { IUser } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, Upload } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CopyButton } from "@/components/primitives/copy-button";
import { toast } from "sonner";

export type UpdateProfileFormData = z.infer<typeof UpdateProfileFormSchema>;

const inputStyle: React.CSSProperties = {
	display: "block",
	width: "100%",
	maxWidth: 400,
	height: 40,
	padding: "0 12px",
	borderRadius: 10,
	border: "1px solid var(--c-line)",
	background: "var(--c-surface)",
	color: "var(--c-text)",
	fontSize: 13.5,
	outline: "none",
	boxSizing: "border-box",
};

const disabledInputStyle: React.CSSProperties = {
	...inputStyle,
	background: "var(--c-surface-2)",
	color: "var(--c-text-3)",
	cursor: "not-allowed",
};

const labelStyle: React.CSSProperties = {
	fontSize: 13.5,
	fontWeight: 600,
	color: "var(--c-text-2)",
	width: 220,
	flexShrink: 0,
	paddingTop: 9,
};

const rowStyle: React.CSSProperties = {
	display: "flex",
	alignItems: "flex-start",
	gap: 24,
	padding: "20px 24px",
	borderBottom: "1px solid var(--c-line)",
};

const errorStyle: React.CSSProperties = {
	fontSize: 12,
	color: "var(--c-down)",
	marginTop: 4,
};

export default function UpdateProfileForm() {
	const { data: user, isPending } = useQuery({
		queryKey: ["user"],
		queryFn: getUserInfo,
	});

	const [avatarImage, setAvatarImage] = useState<File | null>(null);
	const [isUpdated, setIsUpdated] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleImageSelect = useCallback((file: File) => {
		setAvatarImage(file);
		setIsUpdated(true);
	}, []);

	const queryClient = useQueryClient();

	const reset = () => {
		form.reset({
			firstName: user?.firstName || "",
			lastName: user?.lastName || "",
			username: user?.username || "",
			email: user?.email || "",
			phone: user?.phone || "",
			dateOfBirth: user?.dateOfBirth || "",
			gender: (user?.gender as UpdateProfileFormData["gender"]) || "",
			occupation: user?.occupation || "",
			bio: user?.bio || "",
		});
		setAvatarImage(null);
		setIsUpdated(false);
	};

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
			toast.success("Profile updated successfully");
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
		onSuccess: () => {
			window.location.href = "/login";
		},
		onError: () => {
			toast.error("Failed to close account. Please contact support.");
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
			dateOfBirth: user?.dateOfBirth || "",
			gender: (user?.gender as UpdateProfileFormData["gender"]) || "",
			occupation: user?.occupation || "",
			bio: user?.bio || "",
		},
		values: user ? {
			firstName: user.firstName || "",
			lastName: user.lastName || "",
			username: user.username || "",
			email: user.email || "",
			phone: user.phone || "",
			dateOfBirth: user.dateOfBirth || "",
			gender: (user.gender as UpdateProfileFormData["gender"]) || "",
			occupation: user.occupation || "",
			bio: user.bio || "",
		} : undefined,
	});

	const { register, handleSubmit, formState: { errors, isValid, isDirty } } = form;

	const isBusy = isDeleting || isUpdating || isPending;
	const isSaveDisabled = isBusy || !isValid || (!isDirty && !isUpdated);

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

	const avatarSrc = avatarImage ? URL.createObjectURL(avatarImage) : user?.avatar;
	const initials = user
		? `${(user.firstName?.[0] ?? "").toUpperCase()}${(user.lastName?.[0] ?? "").toUpperCase()}` || user.username?.[0]?.toUpperCase() || "U"
		: "U";

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)", borderRadius: 14, overflow: "hidden" }}>

				{/* First Name */}
				<div style={rowStyle}>
					<label style={labelStyle}>
						First Name <span style={{ color: "var(--c-lime-600)" }}>*</span>
					</label>
					<div style={{ flex: 1 }}>
						<input
							{...register("firstName")}
							disabled={isBusy}
							style={isBusy ? disabledInputStyle : inputStyle}
							placeholder="First name"
						/>
						{errors.firstName && <p style={errorStyle}>{errors.firstName.message}</p>}
					</div>
				</div>

				{/* Last Name */}
				<div style={rowStyle}>
					<label style={labelStyle}>
						Last Name <span style={{ color: "var(--c-lime-600)" }}>*</span>
					</label>
					<div style={{ flex: 1 }}>
						<input
							{...register("lastName")}
							disabled={isBusy}
							style={isBusy ? disabledInputStyle : inputStyle}
							placeholder="Last name"
						/>
						{errors.lastName && <p style={errorStyle}>{errors.lastName.message}</p>}
					</div>
				</div>

				{/* Username */}
				<div style={rowStyle}>
					<label style={labelStyle}>Username</label>
					<div style={{ flex: 1 }}>
						<input
							{...register("username")}
							disabled
							style={disabledInputStyle}
						/>
					</div>
				</div>

				{/* Email */}
				<div style={rowStyle}>
					<label style={labelStyle}>Email</label>
					<div style={{ flex: 1 }}>
						<div style={{ display: "flex", alignItems: "center", gap: 8, height: 40, padding: "0 12px", borderRadius: 10, border: "1px solid var(--c-line)", background: "var(--c-surface-2)", maxWidth: 400, boxSizing: "border-box" }}>
							<Mail size={16} style={{ color: "var(--c-text-3)", flexShrink: 0 }} />
							<input
								{...register("email")}
								disabled
								style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--c-text-3)", fontSize: 13.5, cursor: "not-allowed" }}
							/>
						</div>
					</div>
				</div>

				{/* Phone */}
				<div style={rowStyle}>
					<label style={labelStyle}>
						Phone number <span style={{ color: "var(--c-lime-600)" }}>*</span>
					</label>
					<div style={{ flex: 1 }}>
						<div style={{ display: "flex", alignItems: "center", gap: 8, height: 40, padding: "0 12px", borderRadius: 10, border: `1px solid ${errors.phone ? "var(--c-down)" : "var(--c-line)"}`, background: "var(--c-surface)", maxWidth: 400, boxSizing: "border-box" }}>
							<Image src="/assets/icons/phone-call.svg" alt="phone" width={16} height={16} style={{ flexShrink: 0 }} />
							<input
								{...register("phone")}
								type="tel"
								disabled={isBusy}
								style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--c-text)", fontSize: 13.5 }}
								placeholder="+234 000 000 0000"
							/>
						</div>
						{errors.phone && <p style={errorStyle}>{errors.phone.message}</p>}
					</div>
				</div>

				{/* Date of Birth */}
				<div style={rowStyle}>
					<label style={labelStyle}>Date of birth</label>
					<div style={{ flex: 1 }}>
						<input
							{...register("dateOfBirth")}
							type="date"
							disabled={isBusy}
							style={isBusy ? disabledInputStyle : inputStyle}
						/>
						{errors.dateOfBirth && <p style={errorStyle}>{errors.dateOfBirth.message}</p>}
					</div>
				</div>

				{/* Gender */}
				<div style={rowStyle}>
					<label style={labelStyle}>Gender</label>
					<div style={{ flex: 1 }}>
						<select
							{...register("gender")}
							disabled={isBusy}
							style={isBusy ? disabledInputStyle : inputStyle}
						>
							<option value="">Prefer not to say</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
							<option value="other">Other</option>
						</select>
					</div>
				</div>

				{/* Occupation */}
				<div style={rowStyle}>
					<label style={labelStyle}>Occupation</label>
					<div style={{ flex: 1 }}>
						<input
							{...register("occupation")}
							disabled={isBusy}
							style={isBusy ? disabledInputStyle : inputStyle}
							placeholder="e.g. Software engineer"
						/>
						{errors.occupation && <p style={errorStyle}>{errors.occupation.message}</p>}
					</div>
				</div>

				{/* Bio */}
				<div style={rowStyle}>
					<label style={labelStyle}>Bio</label>
					<div style={{ flex: 1 }}>
						<textarea
							{...register("bio")}
							disabled={isBusy}
							rows={3}
							maxLength={300}
							placeholder="A short bio about yourself"
							style={{ ...inputStyle, maxWidth: 400, height: "auto", padding: "10px 12px", resize: "vertical" as const, ...(isBusy ? { background: "var(--c-surface-2)", color: "var(--c-text-3)", cursor: "not-allowed" as const } : {}) }}
						/>
						{errors.bio && <p style={errorStyle}>{errors.bio.message}</p>}
					</div>
				</div>

				{/* Avatar upload */}
				<div style={rowStyle}>
					<div style={{ ...labelStyle, paddingTop: 0 }}>
						<div style={{ fontWeight: 600, color: "var(--c-text-2)", fontSize: 13.5 }}>Profile photo</div>
						<div style={{ fontSize: 12, color: "var(--c-text-3)", marginTop: 4, fontWeight: 400 }}>PNG, JPG or GIF · max 800×400px</div>
					</div>
					<div style={{ flex: 1, display: "flex", alignItems: "center", gap: 16 }}>
						{/* Avatar preview */}
						<div style={{ width: 56, height: 56, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "1px solid var(--c-line)" }}>
							{avatarSrc ? (
								<Image src={avatarSrc} alt="avatar" width={56} height={56} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
							) : (
								<div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, var(--c-lime-500), var(--c-onyx-700))", fontSize: 18, fontWeight: 700, color: "var(--c-onyx-900)" }}>
									{initials}
								</div>
							)}
						</div>
						{/* Upload zone */}
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							style={{ display: "flex", alignItems: "center", gap: 10, height: 40, padding: "0 16px", borderRadius: 10, border: "1px dashed var(--c-line)", background: "transparent", color: "var(--c-text-2)", fontSize: 13, cursor: "pointer", transition: "border-color .12s" }}
						>
							<Upload size={15} style={{ color: "var(--c-lime-600)" }} />
							{avatarImage ? "Change photo" : "Upload photo"}
						</button>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							style={{ display: "none" }}
							onChange={(e) => {
								const file = e.currentTarget.files?.[0];
								if (file) handleImageSelect(file);
							}}
						/>
					</div>
				</div>

				{/* User ID */}
				<div style={rowStyle}>
					<span style={{ ...labelStyle }}>User ID</span>
					<div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
						<span style={{ fontSize: 13, color: "var(--c-text-3)", fontFamily: "var(--f-mono)", paddingTop: 8 }}>{user?.id ?? "—"}</span>
						{user?.id && (
							<div style={{ paddingTop: 4 }}>
								<CopyButton value={user.id} label="User ID" />
							</div>
						)}
					</div>
				</div>

				{/* Registration date */}
				<div style={{ ...rowStyle, borderBottom: "none" }}>
					<span style={{ ...labelStyle }}>Registration date</span>
					<div style={{ paddingTop: 9, fontSize: 13.5, color: "var(--c-text-2)" }}>
						{user?.dateJoined ? getFormattedDate(new Date(user.dateJoined)) : "—"}
					</div>
				</div>

			</div>

			{/* Actions */}
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
				<button
					type="button"
					onClick={() => {
						if (window.confirm("Permanently close your account? This cannot be undone.")) {
							deleteAccount();
						}
					}}
					disabled={isBusy}
					style={{ background: "transparent", border: "none", padding: 0, fontSize: 13.5, fontWeight: 600, color: "var(--c-down)", cursor: isBusy ? "not-allowed" : "pointer", opacity: isBusy ? 0.5 : 1 }}
				>
					Close account
				</button>
				<div style={{ display: "flex", gap: 10 }}>
					<button
						type="button"
						onClick={reset}
						disabled={isBusy}
						style={{ height: 40, padding: "0 18px", borderRadius: 10, fontSize: 13.5, fontWeight: 500, border: "1px solid var(--c-line)", background: "transparent", color: "var(--c-text-2)", cursor: isBusy ? "not-allowed" : "pointer" }}
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isSaveDisabled}
						style={{ height: 40, padding: "0 20px", borderRadius: 10, fontSize: 13.5, fontWeight: 600, border: "none", background: isSaveDisabled ? "var(--c-surface-2)" : "var(--c-lime-500)", color: isSaveDisabled ? "var(--c-text-3)" : "var(--c-onyx-900)", cursor: isSaveDisabled ? "not-allowed" : "pointer", transition: "all .12s" }}
					>
						{isUpdating ? "Saving…" : "Save"}
					</button>
				</div>
			</div>
		</form>
	);
}
