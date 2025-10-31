import { MODAL_IDS, useModalActions } from "@/store/modal";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import ModalWrapper from "../modal-wrapper";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import {
	DialogClose,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";

export default function TransactionSummaryModal() {
	const { openModal } = useModalActions();

	return (
		<ModalWrapper modalID={MODAL_IDS.TRANSACTION_SUMMARY}>
			<DialogHeader className="gap-y-2.5">
				<DialogClose
					asChild
					onClick={() => openModal(MODAL_IDS.FEE_DETAILS)}
				>
					<ArrowLeft
						className="opacity-70 transition-opacity hover:opacity-100 cursor-pointer ml-auto"
						size={24}
					/>
				</DialogClose>
				<DialogTitle className="font-semibold text-base">
					Transaction Summary
				</DialogTitle>
			</DialogHeader>
			<div className="flex flex-col gap-y-5 py-2.5 px-5">
				<div className="flex">
					<span>Amount bought (USDT)</span>
					<span className="ml-auto w-fit font-semibold">33.5 USDT</span>
				</div>
				<div className="flex">
					<span>Amount to pay (Naira)</span>
					<span className="ml-auto w-fit font-semibold">#100,000</span>
				</div>
				<div className="flex">
					<span>Unit price</span>
					<span className="ml-auto w-fit font-semibold">₦1,614</span>
				</div>
				<div className="flex">
					<span>Transaction fee</span>
					<span className="ml-auto w-fit font-semibold">0.3 USDT</span>
				</div>
			</div>
			<Alert className="bg-[#F4E6D5] border border-[#D5D7DA] flex items-start p-4 h-[72px] gap-x-2.5">
				<Image
					src="/assets/icons/alert_circle.svg"
					alt="alert icon"
					width={35}
					height={35}
				/>
				<AlertDescription className="text-[#414651] font-semibold">
					Upon confirmation, your USDT will be instantly credited to your USDT
					Wallet
				</AlertDescription>
			</Alert>
			<DialogFooter>
				<Button
					type="button"
					onClick={() => openModal(MODAL_IDS.PAYMENT)}
					className="bg-[#21241D] rounded-[100px] w-full font-medium h-[38px] px-5 text-[15px]"
				>
					Confirm
				</Button>
			</DialogFooter>
		</ModalWrapper>
	);
}
