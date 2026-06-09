"use client";

import { Search, Flag, Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export function AdminHeader() {
	const { theme, setTheme } = useTheme();

	return (
		<header
			className="flex items-center gap-3 shrink-0 sticky top-0 z-10"
			style={{
				padding: "14px 24px",
				borderBottom: "1px solid var(--c-line)",
				background: "var(--c-surface)",
			}}
		>
			{/* Search */}
			<div
				className="flex items-center flex-1"
				style={{
					maxWidth: 380,
					padding: "0 12px",
					height: 36,
					border: "1px solid var(--c-line)",
					borderRadius: 10,
					background: "var(--c-bg)",
				}}
			>
				<Search className="size-4 shrink-0" style={{ color: "var(--c-text-3)" }} />
				<input
					className="h-[34px] w-full border-none bg-transparent pl-2 text-[13px] outline-none placeholder:text-[var(--c-text-3)]"
					style={{ color: "var(--c-text)" }}
					placeholder="Search users, txns, orders…"
				/>
				<kbd
					className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium"
					style={{
						background: "var(--c-surface-2)",
						color: "var(--c-text-3)",
						border: "1px solid var(--c-line)",
					}}
				>
					⌘K
				</kbd>
			</div>

			{/* Badges */}
			<div className="flex items-center gap-2" style={{ marginLeft: "auto" }}>
				<span
					className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
					style={{ background: "var(--c-warn-soft)", color: "var(--c-warn)" }}
				>
					<Flag className="size-3" />5 KYC pending
				</span>
				<span
					className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
					style={{ background: "var(--c-down-soft)", color: "var(--c-down)" }}
				>
					<Flag className="size-3" />4 flagged txns
				</span>
			</div>

			{/* Actions */}
			<button
				onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
				className="flex items-center justify-center size-8 rounded-md transition-colors"
				style={{ border: "none", background: "transparent", color: "var(--c-text-2)", cursor: "pointer" }}
			>
				{theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
			</button>
			<button
				className="flex items-center justify-center size-8 rounded-md transition-colors"
				style={{ border: "none", background: "transparent", color: "var(--c-text-2)", cursor: "pointer" }}
			>
				<Bell className="size-4" />
			</button>

			{/* User */}
			<div
				className="flex items-center gap-2.5"
				style={{
					paddingLeft: 12,
					marginLeft: 4,
					borderLeft: "1px solid var(--c-line)",
				}}
			>
				<div
					className="flex items-center justify-center rounded-full text-[11px] font-bold shrink-0"
					style={{
						width: 32,
						height: 32,
						background: "var(--c-onyx-900)",
						color: "var(--c-cream)",
					}}
				>
					EN
				</div>
				<div className="hidden xl:block">
					<div className="text-[13px] font-semibold" style={{ color: "var(--c-text)" }}>Emeka N.</div>
					<div className="text-[11px]" style={{ color: "var(--c-text-3)" }}>Compliance Lead</div>
				</div>
			</div>
		</header>
	);
}
