import { MODAL_IDS, useModalActions } from "@/store/modal";
import { XIcon } from "lucide-react";
import { useState } from "react";
import ModalWrapper from "../modal-wrapper";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";

export default function FeeDetailsModal() {
	const { openModal, closeModal } = useModalActions();
	const [isChecked, setIsChecked] = useState(false);

	const handleCheckedChange = (checked: boolean) => {
		setIsChecked(!!checked);
	};

	return (
		<ModalWrapper modalID={MODAL_IDS.FEE_DETAILS}>
			<DialogHeader className="gap-y-5">
				<div className="flex items-center">
					<DialogTitle className="font-semibold text-base">
						Clusteer fee details
					</DialogTitle>
					<DialogClose
						onClick={closeModal}
						asChild
					>
						<XIcon className="opacity-70 transition-opacity hover:opacity-100 cursor-pointer ml-auto" />
					</DialogClose>
				</div>
				<DialogDescription className="text-[#21241D]">
					According to the Clusteer Terms of Fee, transaction fees of
					cryptocurrency will be charged in this fiat currency. Fees range from
					a minimum of 0.1 USDT to a maximum of 1000 USDT per transaction. The
					exact fee amount will be displayed on the order page
				</DialogDescription>
			</DialogHeader>
			<div className="flex items-center gap-x-2.5">
				<Checkbox
					id="terms"
					checked={isChecked}
					onCheckedChange={handleCheckedChange}
					className="data-[state=checked]:border-light-green data-[state=checked]:bg-light-green data-[state=checked]:text-white"
				/>
				<Label
					htmlFor="terms"
					className="text-[#008000] text-base font-normal"
				>
					Clusteer Terms of Fee
				</Label>
			</div>
			<DialogFooter className="justify-end gap-x-2.5">
				<Button
					type="button"
					onClick={closeModal}
					variant="outline"
					className="rounded-[100px] font-medium h-[38px] px-5 text-[15px]"
				>
					Cancel
				</Button>

				<Button
					type="button"
					onClick={() => openModal(MODAL_IDS.TRANSACTION_SUMMARY)}
					className="bg-[#21241D] rounded-[100px] font-medium h-[38px] px-5 text-[15px]"
					disabled={!isChecked}
				>
					Confirm
				</Button>
			</DialogFooter>
		</ModalWrapper>
	);
}
