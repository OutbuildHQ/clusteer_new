"use client";

import { cn } from "@/lib/utils";
import { ModalID, useIsModalOpen } from "@/store/modal";
import { Dialog, DialogContent } from "./ui/dialog";

interface ModalWrapperProps {
	modalID: ModalID;
	className?: string;
	children: React.ReactNode | React.ReactNode[];
}

export default function ModalWrapper({
	modalID,
	className,
	children,
}: ModalWrapperProps) {
	const open = useIsModalOpen(modalID);
	return (
		<Dialog open={open}>
			<DialogContent
				showCloseButton={false}
				className={cn(
					"font-avenir-next border-none rounded-xl gap-y-5 !max-w-[482px] px-7.5 py-10",
					className
				)}
			>
				{children}
			</DialogContent>
		</Dialog>
	);
}
