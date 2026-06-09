"use client";

import { useState, useEffect } from "react";
import {
	Check, X, Camera, CreditCard, FileText, Home,
	Shield, ShieldCheck, Globe, Smartphone,
} from "lucide-react";
import { toast } from "sonner";

/* ─── types ─── */
interface KycItem {
	id: string;
	name: string;
	email: string;
	phone: string;
	tier: string;
	bvn: string;
	nin: string;
	address: string;
	submitted: string;
	liveness: number;
	faceMatch: number;
	bank: string;
	acctNo: string;
	docs: { selfie: boolean; idFront: boolean; idBack: boolean; addressProof: boolean };
}

/* ─── NG banks ─── */
const ADDRESSES_LAGOS = [
	"12 Adeola Hopewell, Victoria Island", "48 Awolowo Rd, Ikoyi", "32 Adeniran Ogunsanya, Surulere",
	"7 Bode Thomas, Surulere", "19 Allen Avenue, Ikeja", "56 Opebi Rd, Ikeja",
	"23 Admiralty Way, Lekki", "9 Akin Adesola, V/I", "134 Herbert Macaulay, Yaba",
];

const NG_BANKS = ["Access Bank", "GTBank", "First Bank", "UBA", "Zenith Bank"];

const NAMES_NG = [
	"Adaeze Okonkwo", "Tunde Bakare", "Chinedu Eze", "Aisha Mohammed", "Folake Adeyemi",
	"Emeka Nwosu", "Bisi Ajayi", "Yusuf Ibrahim", "Ngozi Obi", "Damilola Owolabi",
	"Kemi Lawal", "Ifeanyi Uche", "Habiba Musa", "Tobi Akinwumi", "Chiamaka Eze",
	"Olumide Salami", "Zainab Bello", "Bola Tinubu", "Hauwa Aliyu", "Segun Onile",
];

/* ─── deterministic random ─── */
function rand(seed: number) {
	let s = seed;
	return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

/* ─── generate users, then filter to pending KYC ─── */
const ALL_USERS = NAMES_NG.map((n, i) => {
	const r = rand(i + 1);
	const tier = ["Tier 1", "Tier 2", "Tier 3"][Math.floor(r() * 3)];
	return {
		id: `USR-${10042 + i}`,
		name: n,
		email: n.toLowerCase().replace(/\s/g, ".") + "@" + (["gmail", "yahoo", "outlook"][i % 3]) + ".com",
		phone: `+234 ${800 + i} ${100 + i * 7} ${1000 + i * 13}`,
		tier,
		kyc: tier === "Tier 3" ? "Verified" : (i % 4 === 0 ? "Pending" : (i % 5 === 0 ? "Rejected" : "Verified")),
		bvn: `2210${String(100000 + i * 1117).slice(-7)}`,
		nin: `121${String(20000000 + i * 1991).slice(-8)}`,
		address: ADDRESSES_LAGOS[i % ADDRESSES_LAGOS.length],
		bank: NG_BANKS[i % NG_BANKS.length],
		acctNo: `${1000000000 + Math.floor(r() * 8999999999)}`,
	};
});

const KYC_QUEUE: KycItem[] = ALL_USERS
	.filter((u) => u.kyc === "Pending")
	.map((u, i) => ({
		id: u.id,
		name: u.name,
		email: u.email,
		phone: u.phone,
		tier: u.tier,
		bvn: u.bvn,
		nin: u.nin,
		address: u.address,
		bank: u.bank,
		acctNo: u.acctNo,
		submitted: `${Math.floor(3 + i * 4)}h ago`,
		liveness: 96 - i * 3,
		faceMatch: 98 - i * 2,
		docs: { selfie: true, idFront: true, idBack: true, addressProof: i % 3 !== 0 },
	}));

/* ─── color helpers ─── */
function statusStyle(s: string) {
	const sl = s.toLowerCase();
	return sl === "verified" || sl === "pass"
		? { background: "var(--c-up-soft)", color: "var(--c-up)" }
		: sl === "rejected" || sl === "fail"
		? { background: "var(--c-down-soft)", color: "var(--c-down)" }
		: { background: "var(--c-warn-soft)", color: "var(--c-warn)" };
}

function initials(name: string) {
	return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

/* ─── segment filter tabs ─── */
const SEG_TABS = ["All", "Tier 2", "Tier 3", "Re-review"];

/* ─── document list for drawer ─── */
const DOC_LIST: { key: keyof KycItem["docs"]; label: string }[] = [
	{ key: "selfie", label: "Selfie + ID liveness" },
	{ key: "idFront", label: "NIN \u2014 front" },
	{ key: "idBack", label: "NIN \u2014 back" },
	{ key: "addressProof", label: "Proof of address" },
];

/* ─── document card config (for queue detail) ─── */
const DOC_CARDS: { key: keyof KycItem["docs"]; label: string; Icon: typeof Camera }[] = [
	{ key: "selfie", label: "Selfie", Icon: Camera },
	{ key: "idFront", label: "ID front", Icon: CreditCard },
	{ key: "idBack", label: "ID back", Icon: FileText },
	{ key: "addressProof", label: "Address proof", Icon: Home },
];

/* ================================================================
   KYC CASE DRAWER
   ================================================================ */
function KycCaseDrawer({
	kase,
	onClose,
	onApprove,
	onReject,
	onRequestResubmit,
}: {
	kase: KycItem;
	onClose: () => void;
	onApprove: (kase: KycItem) => void;
	onReject: (kase: KycItem) => void;
	onRequestResubmit: (kase: KycItem) => void;
}) {
	const [activeDoc, setActiveDoc] = useState<keyof KycItem["docs"]>("selfie");
	const [note, setNote] = useState("");

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [onClose]);

	return (
		<div
			className="fixed inset-0 z-50 flex justify-end"
			style={{ background: "rgba(0,0,0,0.45)", padding: 0 }}
			onClick={onClose}
		>
			<div
				className="flex flex-col h-full bg-[var(--c-surface)] overflow-hidden"
				style={{
					width: 760,
					maxWidth: "100vw",
					borderRadius: "20px 0 0 20px",
					animation: "drawerIn .22s cubic-bezier(.2,.7,.2,1)",
				}}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div
					className="flex items-center justify-between shrink-0 px-6 py-4"
					style={{ borderBottom: "1px solid var(--c-line)" }}
				>
					<div className="text-[15px] font-semibold text-[var(--c-text)]">
						KYC case &middot; {kase.name}
					</div>
					<button
						className="flex items-center justify-center size-8 rounded-md hover:bg-[var(--c-surface-3)] transition-colors"
						onClick={onClose}
					>
						<X className="size-4 text-[var(--c-text-3)]" />
					</button>
				</div>

				{/* Body */}
				<div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
					{/* Avatar + name + email + submitted + badge */}
					<div className="flex items-center gap-3">
						<div
							className="flex items-center justify-center shrink-0 rounded-full text-[18px] font-bold"
							style={{ width: 48, height: 48, background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}
						>
							{initials(kase.name)}
						</div>
						<div className="flex-1 min-w-0">
							<div className="text-[15px] font-semibold text-[var(--c-text)]">{kase.name}</div>
							<div className="text-[12px] text-[var(--c-text-3)]">
								{kase.email} &middot; submitted {kase.submitted}
							</div>
						</div>
						<span
							className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0"
							style={statusStyle("Pending")}
						>
							<span className="size-[5px] rounded-full shrink-0" style={{ background: statusStyle("Pending").color }} />
							Pending
						</span>
					</div>

					{/* Personal info + Address/Bank grid */}
					<div className="grid grid-cols-2 gap-3">
						<div className="ds-card p-4">
							<h4 className="text-[13px] font-semibold text-[var(--c-text)] mb-2">Personal</h4>
							<div className="space-y-1.5 text-[13px]">
								<div className="flex items-center justify-between"><span className="text-[var(--c-text-3)]">DOB</span><span className="tabular-nums text-[var(--c-text)]">14 Mar 1992</span></div>
								<div className="flex items-center justify-between"><span className="text-[var(--c-text-3)]">BVN</span><span className="tabular-nums font-mono text-[var(--c-text)]">{kase.bvn}</span></div>
								<div className="flex items-center justify-between"><span className="text-[var(--c-text-3)]">NIN</span><span className="tabular-nums font-mono text-[var(--c-text)]">{kase.nin}</span></div>
								<div className="flex items-center justify-between"><span className="text-[var(--c-text-3)]">Phone</span><span className="tabular-nums font-mono text-[var(--c-text)]">{kase.phone}</span></div>
							</div>
						</div>
						<div className="ds-card p-4">
							<h4 className="text-[13px] font-semibold text-[var(--c-text)] mb-2">Address</h4>
							<div className="text-[13px] leading-relaxed text-[var(--c-text)]">{kase.address}</div>
							<div className="my-2.5" style={{ borderTop: "1px solid var(--c-line)" }} />
							<h4 className="text-[13px] font-semibold text-[var(--c-text)] mb-2">Bank on file</h4>
							<div className="text-[13px] text-[var(--c-text)]">
								{kase.bank} &middot; <span className="tabular-nums font-mono">{kase.acctNo}</span>
							</div>
						</div>
					</div>

					{/* Document viewer */}
					<div className="ds-card overflow-hidden">
						<div className="px-4 py-3 text-[13px] font-semibold text-[var(--c-text)]" style={{ borderBottom: "1px solid var(--c-line)" }}>
							Documents
						</div>
						<div className="grid" style={{ gridTemplateColumns: "180px 1fr", minHeight: 280 }}>
							{/* Sidebar doc list */}
							<div className="p-2" style={{ borderRight: "1px solid var(--c-line)" }}>
								{DOC_LIST.map((d) => (
									<button
										key={d.key}
										onClick={() => setActiveDoc(d.key)}
										className="flex items-center gap-2 w-full text-left px-2.5 py-2 rounded-lg text-[12.5px] transition-colors mb-0.5"
										style={{
											background: activeDoc === d.key ? "var(--c-surface-2)" : "transparent",
											color: "var(--c-text)",
											border: "none",
											cursor: "pointer",
										}}
									>
										<span
											className="shrink-0 rounded-full"
											style={{
												width: 8,
												height: 8,
												background: kase.docs[d.key] ? "var(--c-up)" : "var(--c-down)",
											}}
										/>
										<span className="flex-1">{d.label}</span>
									</button>
								))}
							</div>
							{/* Preview panel */}
							<div
								className="flex items-center justify-center p-4"
								style={{ background: "var(--c-surface-2)" }}
							>
								<div
									className="flex items-center justify-center text-center p-5"
									style={{
										width: "100%",
										maxWidth: 320,
										aspectRatio: "3 / 4",
										borderRadius: 12,
										background: "linear-gradient(135deg, var(--c-onyx-700), var(--c-onyx-900))",
										color: "var(--c-cream, #f5f0e8)",
									}}
								>
									<div>
										<div className="text-[12px] uppercase tracking-wider" style={{ opacity: 0.6 }}>Document preview</div>
										<div className="mt-2 text-[14px] font-medium">
											{DOC_LIST.find((d) => d.key === activeDoc)?.label}
										</div>
										<div className="mt-2 text-[11px]" style={{ opacity: 0.5 }}>Tap to open full image</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Risk signals */}
					<div className="ds-card p-4">
						<h4 className="text-[13px] font-semibold text-[var(--c-text)] mb-2">Risk signals</h4>
						<div className="space-y-1.5 text-[13px]">
							<div className="flex items-center gap-2">
								<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "var(--c-up-soft)", color: "var(--c-up)" }}>PASS</span>
								<span className="text-[var(--c-text)]">Face match score {kase.faceMatch}%</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "var(--c-up-soft)", color: "var(--c-up)" }}>PASS</span>
								<span className="text-[var(--c-text)]">NIN matches BVN registry</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "var(--c-up-soft)", color: "var(--c-up)" }}>PASS</span>
								<span className="text-[var(--c-text)]">Not on PEP / sanctions list</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "var(--c-warn-soft)", color: "var(--c-warn)" }}>WATCH</span>
								<span className="text-[var(--c-text)]">Device fingerprint seen on 1 other account</span>
							</div>
						</div>
					</div>

					{/* Reviewer note */}
					<div className="ds-card p-4">
						<h4 className="text-[13px] font-semibold text-[var(--c-text)] mb-2">Reviewer note</h4>
						<textarea
							value={note}
							onChange={(e) => setNote(e.target.value)}
							placeholder="Internal note (visible to compliance team only)"
							className="w-full rounded-lg border border-[var(--c-line)] bg-[var(--c-bg)] px-3 py-2.5 text-[13px] text-[var(--c-text)] placeholder:text-[var(--c-text-3)] outline-none focus:ring-2 focus:ring-[var(--c-lime-500)] focus:border-transparent resize-y"
							style={{ minHeight: 70, fontFamily: "inherit" }}
						/>
					</div>
				</div>

				{/* Footer */}
				<div
					className="flex items-center justify-end gap-2 shrink-0 px-6 py-4"
					style={{ borderTop: "1px solid var(--c-line)" }}
				>
					<button
						className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-[var(--c-line)] text-[13px] font-medium hover:bg-[var(--c-down-soft)] transition-colors"
						style={{ color: "var(--c-down)" }}
						onClick={() => onReject(kase)}
					>
						<X className="size-3.5" />Reject
					</button>
					<button
						className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-[var(--c-line)] text-[13px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors"
						onClick={() => onRequestResubmit(kase)}
					>
						Request resubmit
					</button>
					<button
						className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-[13px] font-semibold transition-colors"
						style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}
						onClick={() => onApprove(kase)}
					>
						<Check className="size-3.5" />Approve
					</button>
				</div>
			</div>
		</div>
	);
}

/* ================================================================
   KYC APPROVE MODAL
   ================================================================ */
function KycApproveModal({
	kase,
	onClose,
	onConfirm,
}: {
	kase: KycItem;
	onClose: () => void;
	onConfirm: (data: { tier: string; note: string }) => void;
}) {
	const [tier, setTier] = useState("Tier 2");
	const [note, setNote] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [onClose]);

	const TIERS = ["Tier 1", "Tier 2", "Tier 3"];

	return (
		<div
			className="fixed inset-0 z-[60] flex items-center justify-center"
			style={{ background: "rgba(0,0,0,0.5)" }}
			onClick={onClose}
		>
			<div
				className="flex flex-col bg-[var(--c-surface)] rounded-2xl overflow-hidden"
				style={{
					maxWidth: 460,
					width: "100%",
					animation: "modalIn .22s cubic-bezier(.2,.7,.2,1)",
					border: "1px solid var(--c-line)",
					boxShadow: "var(--sh-3)",
				}}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--c-line)" }}>
					<div className="text-[15px] font-semibold text-[var(--c-text)]">Approve KYC</div>
					<button className="flex items-center justify-center size-8 rounded-md hover:bg-[var(--c-surface-3)] transition-colors" onClick={onClose}>
						<X className="size-4 text-[var(--c-text-3)]" />
					</button>
				</div>

				{/* Body */}
				<div className="px-5 py-5 space-y-4">
					{/* Avatar + name */}
					<div className="flex items-center gap-3">
						<div
							className="flex items-center justify-center shrink-0 rounded-full text-[14px] font-bold"
							style={{ width: 40, height: 40, background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}
						>
							{initials(kase.name)}
						</div>
						<div>
							<div className="text-[14px] font-semibold text-[var(--c-text)]">{kase.name}</div>
							<div className="text-[12px] text-[var(--c-text-3)]">{kase.email}</div>
						</div>
					</div>

					{/* Tier selector */}
					<div>
						<div className="text-[12px] text-[var(--c-text-3)] mb-1.5">Approve to tier</div>
						<div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--c-surface-2)] border border-[var(--c-line)]">
							{TIERS.map((t) => (
								<button
									key={t}
									onClick={() => setTier(t)}
									className="flex-1 px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors text-center"
									style={
										tier === t
											? { background: "var(--c-surface)", color: "var(--c-text)", boxShadow: "var(--sh-1)" }
											: { color: "var(--c-text-2)" }
									}
								>
									{t}
								</button>
							))}
						</div>
					</div>

					{/* Internal note */}
					<div>
						<div className="text-[12px] text-[var(--c-text-3)] mb-1.5">Internal note (optional)</div>
						<textarea
							value={note}
							onChange={(e) => setNote(e.target.value)}
							placeholder="Visible to compliance only"
							className="w-full rounded-lg border border-[var(--c-line)] bg-[var(--c-bg)] px-3 py-2.5 text-[13px] text-[var(--c-text)] placeholder:text-[var(--c-text-3)] outline-none focus:ring-2 focus:ring-[var(--c-lime-500)] focus:border-transparent resize-y"
							style={{ minHeight: 60, fontFamily: "inherit" }}
						/>
					</div>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end gap-2 px-5 py-4" style={{ borderTop: "1px solid var(--c-line)" }}>
					<button
						className="flex items-center h-9 px-4 rounded-lg border border-[var(--c-line)] text-[13px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						disabled={loading}
						className="flex items-center h-9 px-4 rounded-lg text-[13px] font-semibold transition-colors disabled:opacity-60"
						style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}
						onClick={async () => {
							setLoading(true);
							try {
								const res = await fetch(`/api/admin/kyc/${kase.id}/approve`, {
									method: "POST",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify({ tier, notes: note }),
								});
								const data = await res.json();
								if (res.ok) {
									toast.success(`KYC approved for ${kase.name}`);
									onConfirm({ tier, note });
									onClose();
								} else {
									toast.error(data.error || "Approval failed");
								}
							} catch {
								toast.error("Network error. Please try again.");
							} finally {
								setLoading(false);
							}
						}}
					>
						{loading ? "Approving…" : "Approve"}
					</button>
				</div>
			</div>
		</div>
	);
}

/* ================================================================
   KYC REJECT MODAL
   ================================================================ */
function KycRejectModal({
	kase,
	onClose,
	onConfirm,
}: {
	kase: KycItem;
	onClose: () => void;
	onConfirm: (data: { reason: string; message: string }) => void;
}) {
	const [reason, setReason] = useState("Document mismatch");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [onClose]);

	const REASONS = [
		"Document mismatch",
		"Expired ID",
		"Image quality",
		"Selfie liveness failed",
		"BVN/NIN mismatch",
		"Suspected fraud",
		"Other",
	];

	return (
		<div
			className="fixed inset-0 z-[60] flex items-center justify-center"
			style={{ background: "rgba(0,0,0,0.5)" }}
			onClick={onClose}
		>
			<div
				className="flex flex-col bg-[var(--c-surface)] rounded-2xl overflow-hidden"
				style={{
					maxWidth: 460,
					width: "100%",
					animation: "modalIn .22s cubic-bezier(.2,.7,.2,1)",
					border: "1px solid var(--c-line)",
					boxShadow: "var(--sh-3)",
				}}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--c-line)" }}>
					<div className="text-[15px] font-semibold text-[var(--c-text)]">Reject KYC</div>
					<button className="flex items-center justify-center size-8 rounded-md hover:bg-[var(--c-surface-3)] transition-colors" onClick={onClose}>
						<X className="size-4 text-[var(--c-text-3)]" />
					</button>
				</div>

				{/* Body */}
				<div className="px-5 py-5 space-y-4">
					{/* Avatar + name */}
					<div className="flex items-center gap-3">
						<div
							className="flex items-center justify-center shrink-0 rounded-full text-[14px] font-bold"
							style={{ width: 40, height: 40, background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}
						>
							{initials(kase.name)}
						</div>
						<div>
							<div className="text-[14px] font-semibold text-[var(--c-text)]">{kase.name}</div>
							<div className="text-[12px] text-[var(--c-text-3)]">{kase.email}</div>
						</div>
					</div>

					{/* Reason radio list */}
					<div>
						<div className="text-[12px] text-[var(--c-text-3)] mb-1.5">Reason</div>
						<div className="space-y-1.5">
							{REASONS.map((r) => (
								<label
									key={r}
									className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer text-[13px] transition-colors"
									style={{
										border: `1px solid ${reason === r ? "var(--c-accent, var(--c-lime-500))" : "var(--c-line)"}`,
										background: reason === r ? "color-mix(in oklab, var(--c-accent, var(--c-lime-500)) 6%, transparent)" : "transparent",
										color: "var(--c-text)",
									}}
								>
									<input
										type="radio"
										checked={reason === r}
										onChange={() => setReason(r)}
										className="accent-[var(--c-lime-500)]"
										style={{ margin: 0 }}
									/>
									<span>{r}</span>
								</label>
							))}
						</div>
					</div>

					{/* Message textarea */}
					<div>
						<div className="text-[12px] text-[var(--c-text-3)] mb-1.5">Message to user</div>
						<textarea
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder="Explain what they need to fix"
							className="w-full rounded-lg border border-[var(--c-line)] bg-[var(--c-bg)] px-3 py-2.5 text-[13px] text-[var(--c-text)] placeholder:text-[var(--c-text-3)] outline-none focus:ring-2 focus:ring-[var(--c-lime-500)] focus:border-transparent resize-y"
							style={{ minHeight: 70, fontFamily: "inherit" }}
						/>
					</div>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end gap-2 px-5 py-4" style={{ borderTop: "1px solid var(--c-line)" }}>
					<button
						className="flex items-center h-9 px-4 rounded-lg border border-[var(--c-line)] text-[13px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						disabled={loading}
						className="flex items-center h-9 px-4 rounded-lg text-[13px] font-semibold transition-colors disabled:opacity-60"
						style={{ background: "var(--c-down)", color: "#fff" }}
						onClick={async () => {
							setLoading(true);
							try {
								const res = await fetch(`/api/admin/kyc/${kase.id}/reject`, {
									method: "POST",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify({ reason }),
								});
								const data = await res.json();
								if (res.ok) {
									toast.success(`KYC rejected for ${kase.name}`);
									onConfirm({ reason, message });
									onClose();
								} else {
									toast.error(data.error || "Rejection failed");
								}
							} catch {
								toast.error("Network error. Please try again.");
							} finally {
								setLoading(false);
							}
						}}
					>
						{loading ? "Rejecting…" : "Reject"}
					</button>
				</div>
			</div>
		</div>
	);
}

/* ================================================================
   MAIN PAGE
   ================================================================ */
export default function AdminKycPage() {
	const [seg, setSeg] = useState("All");
	const [queue, setQueue] = useState<KycItem[]>(KYC_QUEUE);
	const [selected, setSelected] = useState<KycItem | null>(KYC_QUEUE[0] ?? null);
	const [drawerOpen, setDrawerOpen] = useState<KycItem | null>(null);
	const [approveModal, setApproveModal] = useState<KycItem | null>(null);
	const [rejectModal, setRejectModal] = useState<KycItem | null>(null);
	const [notes, setNotes] = useState("");

	const filtered = queue.filter(
		(k) => seg === "All" || seg === "Re-review" || k.tier === seg,
	);

	return (
		<div className="space-y-5">
			{/* ─── Header ─── */}
			<div className="flex items-center justify-between gap-4 flex-wrap">
				<div>
					<h1 className="text-[32px] font-semibold tracking-[-0.03em] font-display text-[var(--c-text)]">KYC queue</h1>
					<p className="mt-1 text-[13px] text-[var(--c-text-3)]">
						{queue.length} submissions awaiting review &middot; SLA: 24h
					</p>
				</div>
				<div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--c-surface-2)] border border-[var(--c-line)]">
					{SEG_TABS.map((t) => (
						<button
							key={t}
							onClick={() => setSeg(t)}
							className="px-3 py-1 rounded-md text-[12px] font-medium transition-colors whitespace-nowrap"
							style={
								seg === t
									? { background: "var(--c-surface)", color: "var(--c-text)", boxShadow: "var(--sh-1)" }
									: { color: "var(--c-text-2)" }
							}
						>
							{t}
						</button>
					))}
				</div>
			</div>

			{/* ─── Main grid: Queue list + Detail card ─── */}
			<div className="grid gap-4 items-start" style={{ gridTemplateColumns: "320px 1fr" }}>
				{/* Queue list */}
				<div className="ds-card overflow-hidden">
					<div className="px-4 py-3 text-[13px] font-semibold text-[var(--c-text)]" style={{ borderBottom: "1px solid var(--c-line)" }}>
						Queue
					</div>
					<div className="max-h-[calc(100vh-220px)] overflow-y-auto">
						{filtered.length === 0 && (
							<div className="py-10 text-center text-[13px] text-[var(--c-text-3)]">No submissions.</div>
						)}
						{filtered.map((k) => (
							<div
								key={k.id}
								className="flex flex-col gap-2 px-4 py-3.5 cursor-pointer transition-colors"
								style={{
									borderBottom: "1px solid var(--c-line)",
									background: selected?.id === k.id ? "var(--c-surface-2)" : "transparent",
								}}
								onClick={() => { setSelected(k); setNotes(""); setDrawerOpen(k); }}
							>
								<div className="flex items-center gap-3">
									<div
										className="flex items-center justify-center shrink-0 rounded-full text-[11px] font-bold"
										style={{ width: 34, height: 34, background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}
									>
										{initials(k.name)}
									</div>
									<div className="min-w-0 flex-1">
										<div className="font-semibold text-[13.5px] text-[var(--c-text)] truncate">{k.name}</div>
										<div className="text-[11px] text-[var(--c-text-3)]">{k.tier} &middot; {k.submitted}</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<span
										className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
										style={{ background: "var(--c-surface-3)", color: "var(--c-text-2)" }}
									>
										Liveness {k.liveness}%
									</span>
									<span
										className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
										style={{ background: "var(--c-surface-3)", color: "var(--c-text-2)" }}
									>
										Match {k.faceMatch}%
									</span>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Detail card (inline preview) */}
				{selected ? (
					<div className="ds-card overflow-hidden">
						{/* Card header */}
						<div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--c-line)" }}>
							<h3 className="text-[15px] font-semibold text-[var(--c-text)]">{selected.name}</h3>
							<span
								className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
								style={statusStyle("Pending")}
							>
								<span className="size-[5px] rounded-full shrink-0" style={{ background: statusStyle("Pending").color }} />
								Pending
							</span>
						</div>

						<div className="px-5 py-5 space-y-5">
							{/* Personal info grid */}
							<div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[12.5px]">
								{([
									["BVN", selected.bvn],
									["NIN", selected.nin],
									["Phone", selected.phone],
									["Address", selected.address],
									["DOB", "12 Mar 1994"],
								] as [string, string][]).map(([k, v]) => (
									<div key={k}>
										<div className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--c-text-3)]">{k}</div>
										<div className="mt-0.5 font-mono text-[var(--c-text)]">{v}</div>
									</div>
								))}
							</div>

							{/* Document preview cards */}
							<div className="grid grid-cols-3 gap-2">
								{DOC_CARDS.map(({ key, label, Icon }) => (
									<div
										key={key}
										className="flex flex-col items-center justify-center gap-2 rounded-xl"
										style={{
											aspectRatio: "4 / 5",
											background: "var(--c-surface-2)",
											border: "1px solid var(--c-line)",
										}}
									>
										<div
											className="flex items-center justify-center rounded-lg"
											style={{ width: 56, height: 56, background: "var(--c-surface-3)" }}
										>
											<Icon className="size-6 text-[var(--c-text-3)]" />
										</div>
										<div className="text-[12px] font-semibold text-[var(--c-text)]">{label}</div>
										{selected.docs[key] ? (
											<button className="flex items-center gap-1 h-7 px-3 rounded-md border border-[var(--c-line)] text-[11px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-3)] transition-colors">
												View
											</button>
										) : (
											<span className="text-[11px] text-[var(--c-text-3)]">Not uploaded</span>
										)}
									</div>
								))}
							</div>

							{/* Risk signals */}
							<div
								className="rounded-xl p-4 space-y-3"
								style={{ background: "var(--c-surface-2)" }}
							>
								<h4 className="text-[14px] font-semibold text-[var(--c-text)]">Risk signals</h4>
								<div className="space-y-2 text-[13px]">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2 text-[var(--c-text)]">
											<Camera className="size-3.5 text-[var(--c-text-3)]" />
											Liveness check
										</div>
										<span className="tabular-nums font-semibold" style={{ color: "var(--c-up)" }}>
											{selected.liveness}% &middot; Pass
										</span>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2 text-[var(--c-text)]">
											<Shield className="size-3.5 text-[var(--c-text-3)]" />
											Face match (Selfie &#8596; ID)
										</div>
										<span className="tabular-nums font-semibold" style={{ color: "var(--c-up)" }}>
											{selected.faceMatch}% &middot; Pass
										</span>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2 text-[var(--c-text)]">
											<ShieldCheck className="size-3.5 text-[var(--c-text-3)]" />
											BVN &#8596; NIN name match
										</div>
										<span
											className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold"
											style={statusStyle("Verified")}
										>
											<span className="size-[5px] rounded-full shrink-0" style={{ background: statusStyle("Verified").color }} />
											Verified
										</span>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2 text-[var(--c-text)]">
											<Globe className="size-3.5 text-[var(--c-text-3)]" />
											Sanctions / PEP screening
										</div>
										<span
											className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold"
											style={statusStyle("Verified")}
										>
											<span className="size-[5px] rounded-full shrink-0" style={{ background: statusStyle("Verified").color }} />
											Verified
										</span>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2 text-[var(--c-text)]">
											<Smartphone className="size-3.5 text-[var(--c-text-3)]" />
											Device &amp; IP check
										</div>
										<span className="tabular-nums text-[var(--c-text-3)]">Lagos &middot; 102.89.x.x</span>
									</div>
								</div>
							</div>

							{/* Review notes */}
							<div>
								<label className="text-[12px] font-semibold text-[var(--c-text)]">Review notes</label>
								<textarea
									className="mt-1.5 w-full rounded-lg border border-[var(--c-line)] bg-[var(--c-surface)] px-3 py-2.5 text-[13px] text-[var(--c-text)] placeholder:text-[var(--c-text-3)] outline-none focus:ring-2 focus:ring-[var(--c-lime-500)] focus:border-transparent resize-none"
									style={{ minHeight: 80 }}
									placeholder="Optional reviewer notes..."
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
								/>
							</div>

							{/* Action buttons */}
							<div className="flex items-center justify-end gap-2 pt-1">
								<button
									className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-[var(--c-line)] text-[13px] font-medium hover:bg-[var(--c-down-soft)] transition-colors"
									style={{ color: "var(--c-down)" }}
									onClick={() => setRejectModal(selected)}
								>
									<X className="size-3.5" />Reject
								</button>
								<button className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-[var(--c-line)] text-[13px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors">
									Request more info
								</button>
								<button
									className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-[13px] font-semibold transition-colors"
									style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}
									onClick={() => setApproveModal(selected)}
								>
									<Check className="size-3.5" />Approve
								</button>
							</div>
						</div>
					</div>
				) : (
					<div className="ds-card flex items-center justify-center py-20 text-[13px] text-[var(--c-text-3)]">
						Select a submission from the queue to review.
					</div>
				)}
			</div>

			{/* ─── KYC Case Drawer ─── */}
			{drawerOpen && (
				<KycCaseDrawer
					kase={drawerOpen}
					onClose={() => setDrawerOpen(null)}
					onApprove={(kase) => {
						setDrawerOpen(null);
						setApproveModal(kase);
					}}
					onReject={(kase) => {
						setDrawerOpen(null);
						setRejectModal(kase);
					}}
					onRequestResubmit={() => {
						setDrawerOpen(null);
					}}
				/>
			)}

			{/* ─── KYC Approve Modal ─── */}
			{approveModal && (
				<KycApproveModal
					kase={approveModal}
					onClose={() => setApproveModal(null)}
					onConfirm={() => {
						setQueue((prev) => prev.filter((k) => k.id !== approveModal!.id));
						if (selected?.id === approveModal!.id) setSelected(null);
						setApproveModal(null);
					}}
				/>
			)}

			{/* ─── KYC Reject Modal ─── */}
			{rejectModal && (
				<KycRejectModal
					kase={rejectModal}
					onClose={() => setRejectModal(null)}
					onConfirm={() => {
						setQueue((prev) => prev.filter((k) => k.id !== rejectModal!.id));
						if (selected?.id === rejectModal!.id) setSelected(null);
						setRejectModal(null);
					}}
				/>
			)}
		</div>
	);
}
