"use client";

import { getFormattedDate } from "@/lib/utils";
import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "@/store/user";

export default function UserBanner() {
	const today = useMemo(() => getFormattedDate(new Date()), []);

	const user = useUser();

	return (
		<div className="my-5 flex gap-x-4 lg:hidden">
			<Avatar className="size-14 border border-[var(--cl-line)] bg-[var(--cl-surface-2)] text-[var(--cl-text-3)]">
				<AvatarImage
					className="object-cover object-center"
					src={user?.avatar}
					alt="user avatar"
				/>
				<AvatarFallback className="bg-[var(--cl-brand-500)] text-white">{user?.firstName?.[0] || user?.username?.[0] || 'U'}</AvatarFallback>
			</Avatar>
			<div>
				<span className="font-semibold text-xl text-[var(--cl-text)]">
					Welcome back, {user?.firstName || user?.username || 'User'}
				</span>
				<p className="text-[var(--cl-text-2)] text-base">{today}</p>
			</div>
		</div>
	);
}
