import { MODAL_IDS, useModalActions } from "@/store/modal";
import { ArrowLeft, XIcon } from "lucide-react";
import FiatReceiveForm from "../forms/fiat-receive-form";
import ModalWrapper from "../modal-wrapper";
import { DialogClose, DialogHeader } from "../ui/dialog";

export default function PaymentModal() {
	const { openModal, closeModal } = useModalActions();

	return (
		<ModalWrapper modalID={MODAL_IDS.PAYMENT}>
			<DialogHeader className="flex flex-row">
				<ArrowLeft
					className="cursor-pointer"
					onClick={() => openModal(MODAL_IDS.FEE_DETAILS)}
					size={24}
				/>
				<DialogClose
					onClick={closeModal}
					asChild
				>
					<XIcon className="opacity-70 transition-opacity hover:opacity-100 cursor-pointer ml-auto" />
				</DialogClose>
			</DialogHeader>
			<FiatReceiveForm />
		</ModalWrapper>
	);
}
