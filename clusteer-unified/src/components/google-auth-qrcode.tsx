"use client";

import { authRequest2FA } from "@/lib/api/auth";
import { useQuery } from "@tanstack/react-query";
import { Copy } from "lucide-react";
import Image from "next/image";
import { Toast } from "@/components/toast";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function GoogleAuthQRCode() {
	const { data, isPending, error } = useQuery({
		queryKey: ["user", "auth-2fa-request"],
		queryFn: authRequest2FA,
	});

	const handleCopy = async () => {
		if (!data?.twoFactorSecret) return;

		try {
			await navigator.clipboard.writeText(data.twoFactorSecret);
			Toast.success("Copied to clipboard");
		} catch (err) {
			console.error("Failed to copy text:", err);
			Toast.error("Failed to copy");
		}
	};

	if (error) {
		return (
			<div className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-200 mt-5">
				Failed to load QR Code.
			</div>
		);
	}

	return (
		<div className="bg-[#F2F2F0] border border-[#0000004D] rounded-2xl p-5 flex items-center gap-x-5 sm:gap-x-10 mt-5">
			{isPending ? (
				<Skeleton className="bg-[#D6D6D6] size-[108px] sm:size-[148px]" />
			) : (
				data?.twoFactorQR && (
					<Image
						className="size-[108px] sm:size-[148px] rounded-lg border border-[#D9EAFD] shadow-[0px_1px_12px_0px_#00000026] shrink-0"
						src={data.twoFactorQR}
						alt="QR Code"
						width={108}
						height={108}
					/>
				)
			)}

			<div className="flex flex-col gap-2">
				<p className="font-medium text-sm leading-8 lg:text-lg break-all max-w-[280px] sm:max-w-none">
					{isPending
						? "Loading..."
						: data?.twoFactorSecret ?? "No secret found"}
				</p>
				<Button
					variant="outline"
					onClick={handleCopy}
					disabled={isPending || !data?.twoFactorSecret}
					className="flex items-center gap-x-2.5 border-[#D6D6D6] bg-[#E5E5E5] rounded-full px-5 py-1"
				>
					<Copy size={18} />
					<span className="text-base font-medium">Copy key</span>
				</Button>
			</div>
		</div>
	);
}
