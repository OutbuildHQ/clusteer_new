"use client";

import { CircleQuestionMarkIcon } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface UploadAvatarProps {
	username?: string;
	currentAvatar?: string;
	onImageSelect: (file: File) => void;
}

export default function UploadAvatar({
	username,
	currentAvatar,
	onImageSelect,
}: UploadAvatarProps) {
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const uploadContainerRef = useRef<HTMLDivElement | null>(null);

	const onUploadContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		fileInputRef.current?.click();
	};

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.currentTarget.files;
		if (!files || files.length === 0) return;

		const file = files[0];
		onImageSelect(file);
	};

	return (
		<div className="flex flex-col lg:flex-row gap-y-4 lg:gap-x-8 pb-5 border-b border-[#E9EAEB]">
			<div>
				<div className="font-semibold text-[#414651] gap-x-0.5 lg:w-[280px] shrink-0">
					Your Photo <span className="text-[#a8faa8]">*</span>{" "}
					<CircleQuestionMarkIcon
						stroke="#A4A7AE"
						strokeWidth={2}
						size={16}
					/>
				</div>
				<p className="text-[#535862]">
					This will be displayed on your profile.
				</p>
			</div>

			<div className="flex gap-x-5 w-full max-w-[512px]">
				<Avatar className="size-16 border-[0.75px] border-[#00000014]">
					<AvatarImage
						className="object-cover object-center"
						src={currentAvatar}
						alt="user avatar"
					/>
					{!currentAvatar && (
						<AvatarFallback>{username ? username[0] : "U"}</AvatarFallback>
					)}
				</Avatar>

				<div
					ref={uploadContainerRef}
					onClick={onUploadContainerClick}
					className="relative flex flex-col items-center border-2 border-[#A6E615] w-full rounded-xl py-4 px-6 text-sm text-center cursor-pointer"
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
								SVG, PNG, JPG or GIF (max. 800x400px)
							</p>
						</div>
						<div className="relative h-fit">
							<Image
								className="size-10"
								src="/assets/icons/file.svg"
								alt="file icon"
								width={40}
								height={40}
							/>
							<Image
								className="absolute left-0 bottom-1.5"
								src="/assets/icons/file-type-icon.svg"
								alt="file type icon"
								width={26}
								height={16}
							/>
						</div>
					</div>

					<input
						ref={fileInputRef}
						type="file"
						onChange={onFileChange}
						accept="image/*"
						style={{ display: "none" }}
					/>
				</div>
			</div>
		</div>
	);
}
