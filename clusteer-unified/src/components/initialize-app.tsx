"use client";

import { getUserInfo } from "@/lib/api/user/queries";
import { useUserActions } from "@/store/user";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { getUserWallet } from "@/lib/api/wallet/queries";
import { useWalletActions } from "@/store/wallet";

interface Props {
	children: ReactNode;
}

//TODO: Ensure when cookie expires i am logged out
//TODO: Find a way to remove the useState

export default function InitializeApp({ children }: Props) {
	const { data, isPending, isError } = useQuery({
		queryKey: ["user"],
		queryFn: getUserInfo,
		retry: false,
	});

	const { data: walletData, isPending: isWalletPending, isError: isWalletError } = useQuery({
		queryKey: ["wallet"],
		queryFn: getUserWallet,
		retry: false,
	});

	const { setUser } = useUserActions();
	const { setWallets } = useWalletActions();

	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		// If user data fails (401 unauthorized), still hydrate but with empty data
		if (isError) {
			setHydrated(true);
			return;
		}

		// If we have user data, hydrate (wallet data is optional)
		if (data) {
			setUser(data);
			// Only set wallets if we have wallet data
			if (walletData && !isWalletError) {
				setWallets(walletData.walletAssets);
			}
			setHydrated(true);
		}
	}, [data, walletData, isError, isWalletError, setUser, setWallets]);

	if (isPending || !hydrated)
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

	return <>{children}</>;
}
