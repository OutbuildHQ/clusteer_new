"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Send } from "lucide-react";

interface SendTypeSelectionModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSelectInternal: () => void;
	onSelectOnchain: () => void;
	assetName: string;
}

export default function SendTypeSelectionModal({
	isOpen,
	onClose,
	onSelectInternal,
	onSelectOnchain,
	assetName,
}: SendTypeSelectionModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">
						Choose Transfer Method
					</DialogTitle>
					<DialogDescription className="text-base">
						Select how you want to send your {assetName}
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-6">
					<Button
						onClick={onSelectInternal}
						className="h-auto flex flex-col items-start p-6 bg-white border-2 border-[#D5D7DA] hover:border-dark-green hover:bg-green-50 transition-all text-left"
						variant="outline"
					>
						<div className="flex items-center gap-3 mb-2">
							<div className="p-2 bg-dark-green rounded-lg">
								<ArrowLeftRight className="h-5 w-5 text-white" />
							</div>
							<span className="text-lg font-semibold text-gray-900">
								Internal Send
							</span>
						</div>
						<p className="text-sm text-gray-600">
							Send to another Clusteer user instantly with zero fees. Just enter their User ID.
						</p>
						<div className="mt-3 flex items-center gap-2">
							<span className="text-xs bg-green-100 text-dark-green px-2 py-1 rounded">
								Instant
							</span>
							<span className="text-xs bg-green-100 text-dark-green px-2 py-1 rounded">
								No Fees
							</span>
						</div>
					</Button>

					<Button
						onClick={onSelectOnchain}
						className="h-auto flex flex-col items-start p-6 bg-white border-2 border-[#D5D7DA] hover:border-dark-green hover:bg-green-50 transition-all text-left"
						variant="outline"
					>
						<div className="flex items-center gap-3 mb-2">
							<div className="p-2 bg-dark-green rounded-lg">
								<Send className="h-5 w-5 text-white" />
							</div>
							<span className="text-lg font-semibold text-gray-900">
								Onchain Send
							</span>
						</div>
						<p className="text-sm text-gray-600">
							Send to any wallet address on the blockchain. Requires network fees.
						</p>
						<div className="mt-3 flex items-center gap-2">
							<span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
								Network Fees Apply
							</span>
							<span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
								15 Confirmations
							</span>
						</div>
					</Button>
				</div>

				<div className="flex justify-end">
					<Button
						onClick={onClose}
						variant="outline"
						className="px-6"
					>
						Cancel
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
