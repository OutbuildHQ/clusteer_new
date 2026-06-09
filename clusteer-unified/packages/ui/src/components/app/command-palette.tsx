"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeftRight,
	Send,
	Banknote,
	LayoutDashboard,
	Wallet,
	ArrowDownToLine,
	BookOpen,
	List,
	ShieldCheck,
	Bell,
	Gift,
	Settings,
	HelpCircle,
	Search,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Nav items — mirrors sidebar NAV                                    */
/* ------------------------------------------------------------------ */

const NAV_ITEMS = [
	{ id: "dashboard", href: "/dashboard", label: "Overview", icon: LayoutDashboard },
	{ id: "assets", href: "/assets", label: "Wallet", icon: Wallet },
	{ id: "trade", href: "/trade", label: "Buy / Sell", icon: ArrowLeftRight },
	{ id: "send", href: "/send", label: "Send", icon: Send },
	{ id: "receive", href: "/receive", label: "Receive", icon: ArrowDownToLine },
	{ id: "withdraw", href: "/withdraw", label: "Withdraw NGN", icon: Banknote },
	{ id: "orders", href: "/orders", label: "Orders", icon: BookOpen },
	{ id: "transaction-history", href: "/transaction-history", label: "Transactions", icon: List },
	{ id: "identity-verification", href: "/identity-verification", label: "Identity", icon: ShieldCheck },
	{ id: "notifications", href: "/notifications", label: "Notifications", icon: Bell },
	{ id: "referrals", href: "/referrals", label: "Referrals", icon: Gift },
	{ id: "settings", href: "/settings", label: "Settings", icon: Settings },
	{ id: "support", href: "/support", label: "Support", icon: HelpCircle },
];

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface PaletteItem {
	id: string;
	label: string;
	sub?: string;
	kind: "Action" | "Page";
	icon: React.ElementType;
	action: () => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CommandPalette() {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [activeIdx, setActiveIdx] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	const go = useCallback(
		(href: string) => {
			router.push(href);
		},
		[router],
	);

	/* -- Keyboard shortcut to open/close -- */
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setOpen((o) => !o);
				setQuery("");
				setActiveIdx(0);
			}
			if (e.key === "Escape" && open) setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);

	/* -- Auto-focus input -- */
	useEffect(() => {
		if (open) setTimeout(() => inputRef.current?.focus(), 30);
	}, [open]);

	/* -- Build item list -- */
	const allItems: PaletteItem[] = useMemo(() => {
		const actions: PaletteItem[] = [
			{
				id: "act-buy",
				label: "Buy USDT",
				kind: "Action",
				icon: ArrowLeftRight,
				action: () => go("/trade"),
			},
			{
				id: "act-send",
				label: "Send crypto",
				kind: "Action",
				icon: Send,
				action: () => go("/send"),
			},
			{
				id: "act-withdraw",
				label: "Withdraw to bank",
				kind: "Action",
				icon: Banknote,
				action: () => go("/withdraw"),
			},
		];

		const pages: PaletteItem[] = NAV_ITEMS.map((n) => ({
			id: `page-${n.id}`,
			label: n.label,
			sub: n.href,
			kind: "Page" as const,
			icon: n.icon,
			action: () => go(n.href),
		}));

		return [...actions, ...pages];
	}, [go]);

	/* -- Filter -- */
	const filtered = useMemo(() => {
		if (!query.trim()) return allItems.slice(0, 12);
		const ql = query.toLowerCase();
		return allItems
			.filter(
				(i) =>
					i.label.toLowerCase().includes(ql) ||
					(i.sub || "").toLowerCase().includes(ql) ||
					i.kind.toLowerCase().includes(ql),
			)
			.slice(0, 20);
	}, [query, allItems]);

	/* -- Reset index on query change -- */
	useEffect(() => {
		setActiveIdx(0);
	}, [query]);

	/* -- Keyboard navigation inside list -- */
	const onKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
		}
		if (e.key === "ArrowUp") {
			e.preventDefault();
			setActiveIdx((i) => Math.max(i - 1, 0));
		}
		if (e.key === "Enter") {
			e.preventDefault();
			const item = filtered[activeIdx];
			if (item) {
				item.action();
				setOpen(false);
			}
		}
	};

	/* -- Scroll active item into view -- */
	useEffect(() => {
		if (!listRef.current) return;
		const active = listRef.current.querySelector("[data-active='true']");
		if (active) active.scrollIntoView({ block: "nearest" });
	}, [activeIdx]);

	if (!open) return null;

	/* -- Group items -- */
	const grouped = filtered.reduce<Record<string, PaletteItem[]>>((acc, item) => {
		(acc[item.kind] = acc[item.kind] || []).push(item);
		return acc;
	}, {});

	let runIdx = -1;

	return (
		<div className="cmdk-back" onClick={() => setOpen(false)}>
			<div className="cmdk" onClick={(e) => e.stopPropagation()}>
				<div style={{ position: "relative" }}>
					<Search
						className="size-4"
						style={{
							position: "absolute",
							left: 16,
							top: "50%",
							transform: "translateY(-50%)",
							color: "var(--c-text-3)",
							pointerEvents: "none",
						}}
					/>
					<input
						ref={inputRef}
						className="cmdk-input"
						placeholder="Search pages or run an action..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={onKeyDown}
						style={{ paddingLeft: 40 }}
					/>
				</div>

				<div className="cmdk-list" ref={listRef}>
					{filtered.length === 0 && (
						<div
							style={{
								padding: "40px 20px",
								textAlign: "center",
								color: "var(--c-text-3)",
								fontSize: 13,
							}}
						>
							No results for &ldquo;{query}&rdquo;
						</div>
					)}

					{Object.entries(grouped).map(([group, list]) => (
						<div key={group}>
							<div className="cmdk-group">{group + "s"}</div>
							{list.map((item) => {
								runIdx++;
								const active = runIdx === activeIdx;
								const Icon = item.icon;
								return (
									<div
										key={item.id}
										className={`cmdk-item${active ? " active" : ""}`}
										data-active={active}
										onClick={() => {
											item.action();
											setOpen(false);
										}}
										onMouseEnter={() => setActiveIdx(runIdx)}
									>
										<div
											style={{
												width: 28,
												height: 28,
												borderRadius: 6,
												background: "var(--c-surface-2)",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												flexShrink: 0,
											}}
										>
											<Icon className="size-3.5" style={{ color: "var(--c-text-2)" }} />
										</div>
										<div style={{ flex: 1, minWidth: 0 }}>
											<div
												style={{
													whiteSpace: "nowrap",
													overflow: "hidden",
													textOverflow: "ellipsis",
													fontSize: 13,
													fontWeight: 500,
												}}
											>
												{item.label}
											</div>
											{item.sub && (
												<div
													style={{
														fontSize: 11,
														color: "var(--c-text-3)",
														whiteSpace: "nowrap",
														overflow: "hidden",
														textOverflow: "ellipsis",
													}}
												>
													{item.sub}
												</div>
											)}
										</div>
										{active && (
											<kbd
												style={{
													fontSize: 11,
													padding: "2px 6px",
													borderRadius: 4,
													border: "1px solid var(--c-line)",
													background: "var(--c-surface-2)",
													color: "var(--c-text-3)",
													fontFamily: "var(--f-mono)",
												}}
											>
												&crarr;
											</kbd>
										)}
									</div>
								);
							})}
						</div>
					))}
				</div>

				<div className="cmdk-foot">
					<span>
						<kbd>&uarr;&darr;</kbd> navigate
					</span>
					<span>
						<kbd>&crarr;</kbd> select
					</span>
					<span>
						<kbd>esc</kbd> close
					</span>
					<span style={{ marginLeft: "auto", color: "var(--c-text-3)" }}>
						Clusteer &middot; Quick actions
					</span>
				</div>
			</div>
		</div>
	);
}
