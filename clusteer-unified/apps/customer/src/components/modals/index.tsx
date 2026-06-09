"use client";

import FeeDetailsModal from "./fee-details-modal";
import PaymentModal from "./payment-modal";
import SuccessModal from "./success-modal";
import TransactionSummaryModal from "./transaction-summary-modal";

export default function Modals() {
	return (
		<>
			<FeeDetailsModal />
			<TransactionSummaryModal />
			<PaymentModal />
			<SuccessModal />
		</>
	);
}
