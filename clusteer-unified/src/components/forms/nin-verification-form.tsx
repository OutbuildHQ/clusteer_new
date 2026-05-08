"use client";

import { NINVerificationFormSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CircularProgress from "../circular-progress";
import { Button } from "../ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../ui/form";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useUser, useUserActions } from "@/store/user";

export type NINVerificationFormData = z.infer<typeof NINVerificationFormSchema>;

export default function NINVerificationForm() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const user = useUser();
	const { setUser } = useUserActions();
	const uploadContainerRef = useRef<HTMLDivElement | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const form = useForm<NINVerificationFormData>({
		mode: "onChange",
		resolver: zodResolver(NINVerificationFormSchema),
		defaultValues: {
			image: undefined,
		},
	});

	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [isPending, setIsPending] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);

	// Simulate upload progress
	useEffect(() => {
		if (isUploading && uploadProgress < 100) {
			const timer = setTimeout(() => {
				setUploadProgress((prev) => {
					const increment = Math.random() * 15 + 5; // Random increment between 5-20
					const newProgress = Math.min(prev + increment, 100);
					if (newProgress >= 100) {
						setIsUploading(false);
					}
					return newProgress;
				});
			}, 200);
			return () => clearTimeout(timer);
		}
	}, [isUploading, uploadProgress]);

	const handleFileChange = (
		file: File | undefined,
		onChange: (value: File | undefined) => void
	) => {
		if (!file) {
			setSelectedFile(null);
			setUploadProgress(0);
			setIsUploading(false);
			onChange(undefined);
			return;
		}
		setSelectedFile(file);
		setUploadProgress(0);
		setIsUploading(true);
		onChange(file);
	};

	const onUploadContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		fileInputRef.current?.click();
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop = (
		e: React.DragEvent<HTMLDivElement>,
		onChange: (value: File | undefined) => void
	) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const files = e.dataTransfer.files;
		if (files && files.length > 0) {
			const file = files[0];
			if (file.type.startsWith("image/")) {
				handleFileChange(file, onChange);
			}
		}
	};

	const onSubmit = async (data: NINVerificationFormData) => {
		setIsPending(true);
		console.log("NIN image submitted:", data);

		try {
			// Call KYC verification API
			const response = await fetch("/api/kyc/verify", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					verificationType: "NIN",
					data: {
						fileName: data.image.name,
						fileSize: data.image.size,
						fileType: data.image.type,
						// TODO: In production, upload the image to cloud storage (S3, Cloudinary, etc.)
						// and send the URL instead of the file object
					},
				}),
			});

			const result = await response.json();

			if (result.status) {
				// Success - show "Under Review" modal then navigate to dashboard
				setShowSuccessModal(true);

				// Immediately update user store with verified status
				if (user) {
					setUser({ ...user, is_verified: true });
				}

				// Invalidate user query to refresh user data
				queryClient.invalidateQueries({ queryKey: ["user"] });

				// Wait 3 seconds before navigating
				setTimeout(() => {
					router.push("/dashboard");
				}, 3000);
			} else {
				// Handle error
				console.error("Verification failed:", result.message);
				alert(result.message || "Verification failed. Please try again.");
				setIsPending(false);
			}
		} catch (error) {
			console.error("Error submitting verification:", error);
			alert("An error occurred. Please try again.");
			setIsPending(false);
		}
	};

	return (
		<Form {...form}>
			<form
				className="mt-10.5"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<FormField
					control={form.control}
					name="image"
					render={({ field: { onChange } }) => (
						<FormItem>
							<FormControl>
								<div
									ref={uploadContainerRef}
									onClick={onUploadContainerClick}
									onDragOver={handleDragOver}
									onDragLeave={handleDragLeave}
									onDrop={(e) => handleDrop(e, onChange)}
									className={`relative flex flex-col items-center border-2 w-full rounded-xl py-4 px-6 text-sm text-center cursor-pointer transition-all ${
										isDragging
											? "border-light-green bg-light-green/10"
											: "border-[#EAECF0] hover:border-light-green/50"
									}`}
								>
									<Image
										className="size-10"
										src="/assets/icons/upload.svg"
										alt="upload icon"
										width={40}
										height={40}
									/>
									<div className="flex items-center mt-3">
										<div className="mr-4">
											<p className="text-[#535862]">
												<span className="text-[#008000] font-semibold">
													Click to upload
												</span>{" "}
												or drag and drop
											</p>
											<p className="mt-1 text-[#535862]">
												PNG, JPG or GIF (max. 5MB)
											</p>
										</div>
									</div>

									<input
										ref={fileInputRef}
										type="file"
										accept="image/*"
										style={{ display: "none" }}
										onChange={(e) =>
											handleFileChange(e.target.files?.[0], onChange)
										}
									/>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{selectedFile && (
					<div className="min-h-[72px] grid grid-cols-[70%_auto] mt-4 border-2 border-[#EAECF0] rounded-xl overflow-hidden">
						<div className="flex items-center p-4 gap-x-4 bg-[#F3F3F3] h-full font-inter text-sm">
							<Image
								src="/assets/icons/upload_file.svg"
								alt="file icon"
								width={28}
								height={28}
							/>
							<div>
								<span className="font-medium text-[#344054]">
									{selectedFile.name}
								</span>
								<p className="text-[#475467]">
									{`${Math.round(selectedFile.size / 1024)} KB`} – {uploadProgress < 100 ? `${Math.round(uploadProgress)}% uploaded` : "Upload complete"}
								</p>
							</div>
						</div>
						<div className="flex items-center justify-end px-4">
							<CircularProgress
								value={uploadProgress}
								size={54}
								strokeWidth={5}
								className="ml-auto stroke-[#F2F4F7]"
								progressClassName="stroke-light-green"
							/>
						</div>
					</div>
				)}

				<Button
					type="submit"
					disabled={!form.formState.isValid || isUploading || isPending}
					className="mt-10 font-mona border-black text-[#111111] bg-light-green border font-medium text-base shadow-xs hover:bg-muted w-full h-11 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isPending ? "Submitting..." : isUploading ? "Uploading..." : "Continue"}
				</Button>
			</form>

			{/* Under Review Success Modal */}
			{showSuccessModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
					<div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
						<Image
							className="object-cover"
							src="/assets/icons/hour_glass.svg"
							alt="under review icon"
							width={150}
							height={150}
						/>
						<h2 className="text-3xl font-bold mt-8">Under Review</h2>
						<p className="font-medium text-lg text-gray-600 mt-6 leading-relaxed">
							You will receive an email/app notification once the review is completed.
						</p>
						<p className="font-medium text-lg text-gray-800 mt-4">
							Estimated review time:
						</p>
						<p className="font-bold text-2xl text-dark-green mt-2">1 Hour(s)</p>
					</div>
				</div>
			)}
		</Form>
	);
}
