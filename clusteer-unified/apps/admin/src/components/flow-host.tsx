"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { ConfirmDialog } from "@/components/flows/confirm-dialog";
import { FeeRuleFlow } from "./flows/fee-rule";
import { CmsContentFlow } from "./flows/cms-content";
import { GenerateReportFlow } from "./flows/generate-report";
import { InviteStaffFlow } from "./flows/invite-staff";
import { CreateApiKeyFlow } from "./flows/create-api-key";
import { CaseReviewDrawer } from "./flows/case-review";
import { AuditDetailDrawer } from "./flows/audit-detail";
import { TxnDetailAdminDrawer } from "./flows/txn-detail-admin";

type FlowEntry = {
	type: string;
	props: Record<string, unknown>;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const MODAL_FLOWS: Record<string, React.ComponentType<any>> = {
	feeRule: FeeRuleFlow,
	cmsContent: CmsContentFlow,
	report: GenerateReportFlow,
	inviteStaff: InviteStaffFlow,
	createApiKey: CreateApiKeyFlow,
	confirm: ConfirmDialog,
};

const DRAWER_FLOWS: Record<string, React.ComponentType<any>> = {
	caseReview: CaseReviewDrawer,
	auditDetail: AuditDetailDrawer,
	txnDetail: TxnDetailAdminDrawer,
};
/* eslint-enable @typescript-eslint/no-explicit-any */

declare global {
	interface WindowEventMap {
		"open-flow": CustomEvent<FlowEntry>;
	}
	interface Window {
		openFlow: (type: string, props?: Record<string, unknown>) => void;
	}
}

export function FlowHost() {
	const [active, setActive] = useState<FlowEntry | null>(null);

	const close = useCallback(() => setActive(null), []);

	useEffect(() => {
		const handler = (e: CustomEvent<FlowEntry>) => setActive(e.detail);
		window.addEventListener("open-flow", handler);
		window.openFlow = (type, props = {}) => {
			window.dispatchEvent(new CustomEvent("open-flow", { detail: { type, props } }));
		};
		return () => window.removeEventListener("open-flow", handler);
	}, []);

	useEffect(() => {
		if (!active) return;
		if (DRAWER_FLOWS[active.type]) return;
		const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [active, close]);

	if (!active) return null;

	const DrawerFlow = DRAWER_FLOWS[active.type];
	if (DrawerFlow) {
		return <DrawerFlow onClose={close} {...active.props} />;
	}

	const ModalFlow = MODAL_FLOWS[active.type];
	if (!ModalFlow) {
		console.warn(`[FlowHost] Unknown flow type: ${active.type}`);
		return null;
	}

	return (
		<div
			style={{
				position: "fixed", inset: 0, zIndex: 100,
				display: "flex", alignItems: "center", justifyContent: "center",
				padding: 24,
			}}
		>
			<div
				onClick={close}
				style={{
					position: "absolute", inset: 0,
					background: "rgba(10,11,8,0.55)",
					backdropFilter: "blur(1.5px)",
				}}
			/>
			<div
				style={{
					position: "relative", zIndex: 1,
					background: "var(--c-surface)",
					borderRadius: 20, padding: 24,
					maxWidth: 480, width: "100%",
					maxHeight: "85vh", overflowY: "auto",
					boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
					animation: "modalIn 0.22s cubic-bezier(.2,.9,.3,1)",
				}}
			>
				<button
					onClick={close}
					style={{
						position: "absolute", top: 16, right: 16,
						width: 30, height: 30, borderRadius: "50%",
						background: "var(--c-surface-2)", border: "none",
						display: "flex", alignItems: "center", justifyContent: "center",
						cursor: "pointer",
					}}
				>
					<X size={16} style={{ color: "var(--c-text-2)" }} />
				</button>
				<ModalFlow onClose={close} {...active.props} />
			</div>
		</div>
	);
}
