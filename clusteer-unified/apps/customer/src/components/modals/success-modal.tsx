import { MODAL_IDS, useModalActions } from "@/store/modal";
import ModalWrapper from "@/components/modal-wrapper";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function SuccessModal() {
	const { closeModal } = useModalActions();
	return (
		<ModalWrapper modalID={MODAL_IDS.SUCCESS}>
			<DialogHeader>
				<DialogTitle className="text-center">Successful</DialogTitle>
			</DialogHeader>
			<p className="text-center">
				Your USDT Wallet has been credited with{" "}
				<span className="font-medium">33.5 USDT</span>
			</p>
			<Button
				type="button"
				onClick={closeModal}
				className="rounded-full font-medium h-[38px] px-5 text-[15px] max-w-[146px] mx-auto"
				style={{ background: "var(--c-onyx-900)", color: "var(--c-cream)" }}
			>
				See your wallet
			</Button>
		</ModalWrapper>
	);
}
