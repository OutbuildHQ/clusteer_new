"use client";

import { verifyEmail } from "@/lib/api/auth";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toast } from "./toast";

export default function VerifyEmail({ token }: { token: string }) {
	const router = useRouter();

	const { isError, mutate } = useMutation({
		mutationFn: verifyEmail,
		onSuccess: (res) => {
			Toast.success(res.message);
			router.push("/login");
		},
	});

	useEffect(() => {
		if (token) mutate(token);
	}, [token, mutate]);

	if (isError) router.push("/login");

	return (
		<div className="flex justify-center items-center min-h-screen w-full">
			<div className="mb-10">
				<Image
					src="/assets/icons/logo_with_name.svg"
					alt="Clusteer logo"
					className="shrink-0 md:w-[160px] animate-pulse duration-[2s]"
					width={123}
					height={42}
				/>
			</div>
		</div>
	);
}
