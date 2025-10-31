"use client";

import { useUser } from "@/store/user";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

export default function UserProfile() {
	const user = useUser();

	return (
		<div className="items-center gap-x-1.5 py-2.5 mb-1.5 hidden lg:flex">
			<div className="flex items-center gap-x-1.5">
				<div className="relative">
					<Avatar className="size-10">
						<AvatarImage
							className="object-cover object-center"
							src={user?.avatar}
							alt="user avatar"
						/>
						<AvatarFallback>{user?.firstName?.[0] || user?.username?.[0] || 'U'}</AvatarFallback>
					</Avatar>
					<div className="size-2.5 bg-[#12B76A] absolute right-0 bottom-0 z-10 rounded-full border-2 border-white"></div>
				</div>
				<span className="inline-block ml-2.5 font-semibold text-2xl">
					{user?.username || 'User'}
				</span>
			</div>
			{user?.is_verified && (
				<Badge
					variant="secondary"
					className="bg-pale-green text-dark-green h-6 rounded-[100px]"
				>
					<Image
						src="/assets/icons/check_small.svg"
						alt="small check icon"
						width={10}
						height={10}
					/>
					Verified
				</Badge>
			)}
		</div>
	);
}
