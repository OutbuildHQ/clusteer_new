/**
 * Shared style objects for auth pages.
 * Defined outside components to avoid re-creation on every render.
 */

export const inputWrapStyle = {
	padding: "0 14px",
	height: 46,
	border: "1px solid var(--c-line)",
	borderRadius: 10,
	background: "var(--c-bg)",
	transition: "box-shadow .15s, border-color .15s",
} as const;

export const innerInputStyle = {
	flex: 1,
	border: 0,
	outline: "none",
	background: "transparent",
	fontSize: 14,
	color: "var(--c-text)",
	fontFamily: "var(--f-sans)",
} as const;

export const btnPrimaryStyle = {
	height: 48,
	display: "flex" as const,
	alignItems: "center" as const,
	justifyContent: "center" as const,
	borderRadius: "var(--r-md)",
	border: "1px solid transparent",
	fontSize: 14.5,
	fontWeight: 600,
	background: "var(--c-lime-500)",
	color: "var(--c-onyx-900)",
	cursor: "pointer",
	fontFamily: "var(--f-sans)",
} as const;

export const btnGhostStyle = {
	height: 48,
	display: "flex" as const,
	alignItems: "center" as const,
	justifyContent: "center" as const,
	borderRadius: "var(--r-md)",
	border: "1px solid var(--c-line)",
	background: "transparent",
	fontSize: 14,
	fontWeight: 500,
	color: "var(--c-text)",
	fontFamily: "var(--f-sans)",
	cursor: "pointer",
} as const;

export const showHideBtnStyle = {
	height: 30,
	padding: "0 10px",
	borderRadius: "var(--r-md)",
	border: "1px solid var(--c-line)",
	background: "transparent",
	fontSize: 12,
	fontWeight: 600,
	color: "var(--c-text-2)",
	fontFamily: "var(--f-sans)",
	cursor: "pointer",
} as const;

/** Inline spinner — uses @keyframes spin from globals.css */
export const spinnerStyle = {
	width: 18,
	height: 18,
	border: "2px solid currentColor",
	borderTopColor: "transparent",
	borderRadius: "50%",
	animation: "spin .8s linear infinite",
	display: "inline-block",
} as const;

/** Small pill for a disabled "not live yet" auth CTA (Google/Apple/Passkey). */
export const soonBadgeStyle = {
	fontSize: 10.5,
	fontWeight: 600,
	padding: "1px 6px",
	borderRadius: 999,
	background: "var(--c-surface-2)",
	color: "var(--c-text-3)",
	marginLeft: 4,
} as const;
