import { create } from "zustand";

export const MODAL_IDS = {
	FEE_DETAILS: "FEE_DETAILS",
	TRANSACTION_SUMMARY: "TRANSACTION_SUMMARY",
	PAYMENT: "PAYMENT",
	SUCCESS: "SUCCESS",
} as const;

export type ModalID = keyof typeof MODAL_IDS;

interface ModalStore {
	currentModal: ModalID | null;
	actions: {
		openModal: (modal: ModalID) => void;
		closeModal: () => void;
	};
}

const useModalStore = create<ModalStore>((set, get) => ({
	currentModal: null,
	actions: {
		openModal: (modal) => {
			get().actions.closeModal();
			setTimeout(() => {
				set({ currentModal: modal });
			}, 100);
		},
		closeModal: () => set({ currentModal: null }),
	},
}));

export const useCurrentModal = () =>
	useModalStore((state) => state.currentModal);

export const useModalActions = () => useModalStore((s) => s.actions);

export const useIsModalOpen = (modal: ModalID) =>
	useModalStore((state) => state.currentModal === modal);
