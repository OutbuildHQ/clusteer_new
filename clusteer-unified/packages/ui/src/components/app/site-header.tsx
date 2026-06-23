"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ── Brand mark (exact from handoff) ── */
function ClusteerMark({ size = 28, color = "#21241D" }: { size?: number; color?: string }) {
	return (
		<svg width={size} height={size} viewBox="0 0 110 110" fill="none">
			<path d="M4.99993 54.5605C4.99993 27.0705 25.7099 4.41769 52.3788 1.35297C55.7761 0.962547 58.5603 3.77234 58.5603 7.19206L58.5603 54.5605L58.5603 101.929C58.5603 105.349 55.7761 108.158 52.3788 107.768C25.7099 104.703 4.99993 82.0504 4.99993 54.5605Z" fill={color} />
			<circle cx="76.9814" cy="31.0309" r="7.27554" fill={color} />
			<circle cx="76.9814" cy="54.5603" r="7.27554" fill={color} />
			<circle cx="76.9814" cy="78.0898" r="7.27554" fill={color} />
			<circle cx="97.7243" cy="54.5603" r="7.27554" fill={color} />
		</svg>
	);
}
function ClusteerWordmark({ size = 26, color = "#21241D" }: { size?: number; color?: string }) {
	return (
		<span style={{ display: "inline-flex", alignItems: "center", gap: size * 0.35 }}>
			<ClusteerMark size={size} color={color} />
			<span style={{ fontFamily: "var(--font-sora), Sora, sans-serif", fontWeight: 700, fontSize: size * 0.95, color, letterSpacing: -0.6, lineHeight: 1 }}>Clusteer</span>
		</span>
	);
}

/* ── Icon set (exact from handoff) ── */
function Ic({ name, size = 18, sw = 2 }: { name: string; size?: number; sw?: number }) {
	const paths: Record<string, React.ReactNode> = {
		arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
		wallet: <><path d="M3 7h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" /><path d="M16 14h2" /><path d="M3 7l3-4h12l3 4" /></>,
		bank: <><path d="M3 21h18" /><path d="M3 10h18" /><path d="M5 6l7-4 7 4" /><path d="M5 21V10M9 21V10M15 21V10M19 21V10" /></>,
		chart: <><path d="M3 3v18h18" /><path d="m7 14 4-4 4 4 5-6" /></>,
		bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />,
		sparkle: <path d="M12 2l2.5 7L22 11l-7.5 2L12 20l-2.5-7L2 11l7.5-2L12 2z" />,
		play: <path d="M7 4v16l13-8L7 4z" fill="currentColor" />,
		shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></>,
		users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
		briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>,
		megaphone: <><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></>,
		mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></>,
		book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>,
		code: <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />,
		bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>,
	};
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
			{paths[name]}
		</svg>
	);
}

type MenuItem = { ic: string; t: string; d: string; href: string };

// Pre-launch: primary CTAs point to the early-access waitlist instead of
// signup (which middleware redirects here anyway). Revert to "/signup" at launch.
const AUTH = "/early-access";

const MEGA_TRADE: MenuItem[] = [
	{ ic: "wallet", t: "Buy stablecoins", d: "USDT & USDC with naira, instantly", href: "/buy" },
	{ ic: "bank", t: "Sell stablecoins", d: "Cash out to any Nigerian bank", href: "/sell" },
	{ ic: "chart", t: "Live markets", d: "Track USDT/NGN rates in real time", href: "/live-markets" },
];
const MEGA_TOOLS: MenuItem[] = [
	{ ic: "sparkle", t: "Payment requests", d: "Get paid in stables by link or QR", href: "/payments" },
	{ ic: "play", t: "Mobile app", d: "Trade on iOS & Android", href: "/mobile" },
	{ ic: "bolt", t: "How it works", d: "From rate to bank in 3 steps", href: "/#how" },
];
const COMPANY: MenuItem[] = [
	{ ic: "users", t: "About us", d: "Our mission & team", href: "/about" },
	{ ic: "briefcase", t: "Careers", d: "We're hiring", href: "/careers" },
	{ ic: "megaphone", t: "Press", d: "News & media kit", href: "/press" },
	{ ic: "mail", t: "Contact", d: "Talk to us", href: "/contact" },
];
const RESOURCES: MenuItem[] = [
	{ ic: "book", t: "Help center", d: "Guides & FAQs", href: "/help" },
	{ ic: "shield", t: "Security", d: "How we protect you", href: "/#trust" },
	{ ic: "bell", t: "Rate alerts", d: "Get notified on moves", href: "/rate-alerts" },
];

function Caret() {
	return (
		<svg className="nav-caret" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 5, opacity: 0.6 }}>
			<path d="m6 9 6 6 6-6" />
		</svg>
	);
}

function MegaLink({ item, onClick }: { item: MenuItem; onClick: () => void }) {
	return (
		<Link href={item.href} onClick={onClick} className="mega-link" style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "11px 12px", borderRadius: 12 }}>
			<span className="mega-ico" style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 10, background: "#EFFCD0", border: "1.5px solid #21241D", display: "flex", alignItems: "center", justifyContent: "center", color: "#21241D" }}>
				<Ic name={item.ic} size={18} />
			</span>
			<span style={{ minWidth: 0 }}>
				<span style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: 14.5, color: "#21241D" }}>
					{item.t}<span className="mega-go"><Ic name="arrow" size={13} /></span>
				</span>
				<span style={{ display: "block", fontSize: 12.5, color: "#475467", marginTop: 2, lineHeight: 1.35 }}>{item.d}</span>
			</span>
		</Link>
	);
}

function DropList({ items, onClick }: { items: MenuItem[]; onClick: () => void }) {
	return (
		<div style={{ position: "absolute", top: "calc(100% + 12px)", left: 0, width: 290, padding: 8, borderRadius: 16, background: "#fff", border: "1.5px solid #21241D", boxShadow: "4px 4px 0 0 #21241D", animation: "menu-in .2s ease both" }}>
			{items.map((it) => (
				<Link key={it.t} href={it.href} onClick={onClick} className="drop-link" style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 12px", borderRadius: 10 }}>
					<span className="mega-ico" style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 9, background: "#EFFCD0", border: "1.5px solid #21241D", display: "flex", alignItems: "center", justifyContent: "center", color: "#21241D" }}>
						<Ic name={it.ic} size={15} />
					</span>
					<span style={{ minWidth: 0 }}>
						<span style={{ display: "block", fontWeight: 600, fontSize: 14, color: "#21241D" }}>{it.t}</span>
						<span style={{ display: "block", fontSize: 12, color: "#475467", marginTop: 1 }}>{it.d}</span>
					</span>
				</Link>
			))}
		</div>
	);
}

export function SiteHeader() {
	const [open, setOpen] = useState<string | null>(null);
	const [mobile, setMobile] = useState(false);
	const [acc, setAcc] = useState<string | null>(null);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const enter = (k: string) => { if (timer.current) clearTimeout(timer.current); setOpen(k); };
	const leave = () => { timer.current = setTimeout(() => setOpen(null), 130); };
	const close = () => { setOpen(null); setMobile(false); };

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	useEffect(() => {
		document.body.style.overflow = mobile ? "hidden" : "";
		return () => { document.body.style.overflow = ""; };
	}, [mobile]);

	const triggerStyle: React.CSSProperties = { display: "inline-flex", alignItems: "center", fontSize: 14.5, fontWeight: 500, color: "#21241D", padding: "9px 14px", borderRadius: 999, cursor: "pointer" };

	return (
		<nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(250,250,247,0.82)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderBottom: "1px solid rgba(33,36,29,0.08)" }}>
			<div style={{ maxWidth: 1280, margin: "0 auto", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
				<Link href="/" onClick={close} style={{ display: "flex", flexShrink: 0 }} aria-label="Clusteer home"><ClusteerWordmark size={26} /></Link>

				<div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 2 }}>
					<div style={{ position: "relative" }} onMouseEnter={() => enter("products")} onMouseLeave={leave}>
						<button className="nav-trigger" data-open={open === "products"} style={triggerStyle} onClick={() => setOpen(open === "products" ? null : "products")}>Products <Caret /></button>
						{open === "products" && (
							<div style={{ position: "absolute", top: "calc(100% + 12px)", left: 0, width: 680, padding: 16, borderRadius: 20, background: "#fff", border: "1.5px solid #21241D", boxShadow: "5px 5px 0 0 #21241D", display: "grid", gridTemplateColumns: "1fr 1fr 200px", gap: 14, animation: "menu-in .2s ease both" }}>
								<div>
									<div className="f-mono" style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 10.5, fontWeight: 600, letterSpacing: 1, color: "#0F4F26", padding: "4px 12px 8px", textTransform: "uppercase" }}>Trade</div>
									{MEGA_TRADE.map((it) => <MegaLink key={it.t} item={it} onClick={close} />)}
								</div>
								<div>
									<div className="f-mono" style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 10.5, fontWeight: 600, letterSpacing: 1, color: "#0F4F26", padding: "4px 12px 8px", textTransform: "uppercase" }}>Tools</div>
									{MEGA_TOOLS.map((it) => <MegaLink key={it.t} item={it} onClick={close} />)}
								</div>
								<Link href={AUTH} onClick={close} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 16, borderRadius: 14, background: "#9FE870", border: "1.5px solid #21241D", boxShadow: "3px 3px 0 0 #21241D" }}>
									<div>
										<span style={{ display: "inline-block", padding: "3px 9px", borderRadius: 999, background: "#21241D", color: "#9FE870", fontFamily: "var(--font-sora), Sora, sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 0.4 }}>NEW</span>
										<div style={{ fontFamily: "var(--font-sora), Sora, sans-serif", fontWeight: 700, fontSize: 16, lineHeight: 1.25, color: "#21241D", marginTop: 12 }}>Same-day USDC payouts</div>
										<div style={{ fontSize: 12.5, color: "#21241D", opacity: 0.8, marginTop: 6, lineHeight: 1.4 }}>Straight to any Nigerian bank, no spread.</div>
									</div>
									<span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: 13, color: "#21241D", marginTop: 16 }}>Start now <Ic name="arrow" size={14} /></span>
								</Link>
							</div>
						)}
					</div>

					<div style={{ position: "relative" }} onMouseEnter={() => enter("company")} onMouseLeave={leave}>
						<button className="nav-trigger" data-open={open === "company"} style={triggerStyle} onClick={() => setOpen(open === "company" ? null : "company")}>Company <Caret /></button>
						{open === "company" && <DropList items={COMPANY} onClick={close} />}
					</div>

					<div style={{ position: "relative" }} onMouseEnter={() => enter("resources")} onMouseLeave={leave}>
						<button className="nav-trigger" data-open={open === "resources"} style={triggerStyle} onClick={() => setOpen(open === "resources" ? null : "resources")}>Resources <Caret /></button>
						{open === "resources" && <DropList items={RESOURCES} onClick={close} />}
					</div>
				</div>

				<div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 10 }}>
					<Link href="/login" className="nav-signin" style={{ fontSize: 14, fontWeight: 600, color: "#21241D", padding: "9px 16px", borderRadius: 999 }}>Sign in</Link>
					<Link href={AUTH} className="btn-shine" style={{ fontSize: 14, fontWeight: 600, color: "#21241D", padding: "10px 18px", borderRadius: 999, background: "#9FE870", border: "1.5px solid #21241D", boxShadow: "3px 3px 0 0 #21241D", display: "inline-flex", alignItems: "center", gap: 6 }}>Join the waitlist <Ic name="arrow" size={14} /></Link>
				</div>

				<button className="nav-burger" onClick={() => setMobile((m) => !m)} aria-label="Menu" aria-expanded={mobile} style={{ width: 44, height: 44, borderRadius: 12, background: "#fff", border: "1.5px solid #21241D", boxShadow: "2px 2px 0 0 #21241D", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
					<span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
						<span className="burger-line" style={{ width: 18, height: 2, background: "#21241D", borderRadius: 2, transform: mobile ? "translateY(6px) rotate(45deg)" : "none" }} />
						<span className="burger-line" style={{ width: 18, height: 2, background: "#21241D", borderRadius: 2, opacity: mobile ? 0 : 1 }} />
						<span className="burger-line" style={{ width: 18, height: 2, background: "#21241D", borderRadius: 2, transform: mobile ? "translateY(-6px) rotate(-45deg)" : "none" }} />
					</span>
				</button>
			</div>

			{mobile && (
				<div className="nav-mobile-panel" style={{ borderTop: "1.5px solid #21241D", background: "#FAFAF7", maxHeight: "calc(100vh - 72px)", overflowY: "auto", padding: "14px 20px 28px" }}>
					<MobileSection title="Products" id="products" acc={acc} setAcc={setAcc} items={[...MEGA_TRADE, ...MEGA_TOOLS]} onClick={close} />
					<MobileSection title="Company" id="company" acc={acc} setAcc={setAcc} items={COMPANY} onClick={close} />
					<MobileSection title="Resources" id="resources" acc={acc} setAcc={setAcc} items={RESOURCES} onClick={close} />
					<div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
						<Link href="/login" onClick={close} style={{ width: "100%", textAlign: "center", fontSize: 15, fontWeight: 600, color: "#21241D", padding: "13px", borderRadius: 999, background: "#fff", border: "1.5px solid #21241D" }}>Sign in</Link>
						<Link href={AUTH} onClick={close} className="btn-shine" style={{ width: "100%", fontSize: 15, fontWeight: 600, color: "#21241D", padding: "14px", borderRadius: 999, background: "#9FE870", border: "1.5px solid #21241D", boxShadow: "3px 3px 0 0 #21241D", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>Join the waitlist <Ic name="arrow" size={15} /></Link>
					</div>
				</div>
			)}
		</nav>
	);
}

function MobileSection({
	title,
	id,
	acc,
	setAcc,
	items,
	onClick,
}: {
	title: string;
	id: string;
	acc: string | null;
	setAcc: (v: string | null) => void;
	items: MenuItem[];
	onClick: () => void;
}) {
	const isOpen = acc === id;
	return (
		<div style={{ borderBottom: "1px solid rgba(33,36,29,0.1)" }}>
			<button onClick={() => setAcc(isOpen ? null : id)} aria-expanded={isOpen} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 4px", fontWeight: 600, fontSize: 16, color: "#21241D" }}>
				{title}
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform .2s ease", transform: isOpen ? "rotate(180deg)" : "none", opacity: 0.6 }}><path d="m6 9 6 6 6-6" /></svg>
			</button>
			{isOpen && (
				<div style={{ paddingBottom: 10, animation: "menu-in .2s ease both" }}>
					{items.map((it) => (
						<Link key={it.t} href={it.href} onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderRadius: 10 }}>
							<span style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 9, background: "#EFFCD0", border: "1.5px solid #21241D", display: "flex", alignItems: "center", justifyContent: "center", color: "#21241D" }}><Ic name={it.ic} size={16} /></span>
							<span>
								<span style={{ display: "block", fontWeight: 600, fontSize: 14.5, color: "#21241D" }}>{it.t}</span>
								<span style={{ display: "block", fontSize: 12.5, color: "#475467", marginTop: 1 }}>{it.d}</span>
							</span>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
