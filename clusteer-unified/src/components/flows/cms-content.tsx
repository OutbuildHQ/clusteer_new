"use client";

import { useState } from "react";
import { toast } from "sonner";

const TYPES = ["Banner", "Announcement", "FAQ"];
const AUDIENCES = ["All users", "Tier 1", "Tier 2+", "Unverified", "Inactive 30d"];
const PLACEMENTS = ["Dashboard top", "Trade header", "Orders header", "Help center"];
const ACCENTS = ["lime", "onyx", "warn"] as const;

type Accent = (typeof ACCENTS)[number];

function CmsPreview({ title, body, type, accent, cta }: { title: string; body: string; type: string; accent: Accent; cta: string }) {
	const accents: Record<Accent, { bg: string; fg: string; tag: string; tagFg: string }> = {
		lime: { bg: "var(--c-lime-500)", fg: "var(--c-onyx-900)", tag: "var(--c-onyx-900)", tagFg: "var(--c-lime-500)" },
		onyx: { bg: "var(--c-onyx-900)", fg: "var(--c-cream)", tag: "var(--c-lime-500)", tagFg: "var(--c-onyx-900)" },
		warn: { bg: "var(--c-warn-soft)", fg: "var(--c-onyx-900)", tag: "var(--c-warn)", tagFg: "#fff" },
	};
	const a = accents[accent];

	if (type === "FAQ") {
		return (
			<div style={{ padding: 16, background: "var(--c-surface-2)", borderRadius: 14 }}>
				<div style={{ fontSize: 11, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>FAQ</div>
				<div style={{ fontWeight: 600, fontSize: 15, marginTop: 8 }}>{title || "Untitled"}</div>
				<div style={{ fontSize: 13, color: "var(--c-text-2)", marginTop: 6, lineHeight: 1.5 }}>{body}</div>
			</div>
		);
	}

	return (
		<div style={{ padding: 16, background: a.bg, color: a.fg, borderRadius: 14 }}>
			<div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
				<span style={{ background: a.tag, color: a.tagFg, padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>{type === "Banner" ? "NEW" : "NOTICE"}</span>
				{type}
			</div>
			<div style={{ fontSize: 18, fontWeight: 600, marginTop: 8, lineHeight: 1.2 }}>{title || "Untitled"}</div>
			{body && <div style={{ fontSize: 12.5, marginTop: 6, opacity: 0.85, lineHeight: 1.45 }}>{body}</div>}
			{cta && <button style={{ marginTop: 14, padding: "6px 14px", borderRadius: 8, border: "none", background: a.fg, color: a.bg, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{cta}</button>}
		</div>
	);
}

export function CmsContentFlow({ onClose }: { onClose: () => void }) {
	const [type, setType] = useState("Banner");
	const [title, setTitle] = useState("");
	const [audience, setAudience] = useState("All users");
	const [body, setBody] = useState("");
	const [placement, setPlacement] = useState("Dashboard top");
	const [cta, setCta] = useState("");
	const [accent, setAccent] = useState<Accent>("lime");

	const ok = title.trim() && body.trim();

	const inputStyle: React.CSSProperties = { width: "100%", height: 38, padding: "0 12px", border: "1px solid var(--c-line)", borderRadius: 10, background: "var(--c-surface)", color: "var(--c-text)", fontSize: 13, outline: "none", boxSizing: "border-box" as const };
	const selectStyle = inputStyle;

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
			<h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-text)", margin: 0 }}>New content</h3>

			<div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
				{/* Form */}
				<div style={{ flex: "1 1 340px", minWidth: 0, display: "flex", flexDirection: "column", gap: 14 }}>
					<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
						<div>
							<label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 5 }}>Type</label>
							<select value={type} onChange={(e) => setType(e.target.value)} style={selectStyle}>
								{TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
							</select>
						</div>
						<div>
							<label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 5 }}>Audience</label>
							<select value={audience} onChange={(e) => setAudience(e.target.value)} style={selectStyle}>
								{AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
							</select>
						</div>
					</div>
					<div>
						<label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 5 }}>Title</label>
						<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Headline shown to customers" style={inputStyle} />
					</div>
					<div>
						<label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 5 }}>Body</label>
						<textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write the content…" rows={3} style={{ ...inputStyle, height: "auto", minHeight: 84, padding: "10px 12px", resize: "vertical" as const }} />
					</div>
					{type !== "FAQ" && (
						<>
							<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
								<div>
									<label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 5 }}>Placement</label>
									<select value={placement} onChange={(e) => setPlacement(e.target.value)} style={selectStyle}>
										{PLACEMENTS.map((p) => <option key={p} value={p}>{p}</option>)}
									</select>
								</div>
								<div>
									<label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 5 }}>CTA label (optional)</label>
									<input value={cta} onChange={(e) => setCta(e.target.value)} placeholder="e.g. Start a buy" style={inputStyle} />
								</div>
							</div>
							<div>
								<label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 5 }}>Accent</label>
								<div style={{ display: "flex", gap: 0, padding: 3, borderRadius: 10, background: "var(--c-surface-2)", border: "1px solid var(--c-line)" }}>
									{ACCENTS.map((a) => (
										<button
											key={a} onClick={() => setAccent(a)}
											style={{
												flex: 1, padding: "6px 0", borderRadius: 7, fontSize: 12.5, fontWeight: 500, cursor: "pointer", border: "none", transition: "all 0.15s", textTransform: "capitalize",
												...(accent === a
													? { background: "var(--c-surface)", color: "var(--c-text)", boxShadow: "0 1px 2px rgba(0,0,0,.08)" }
													: { background: "transparent", color: "var(--c-text-2)" }),
											}}
										>{a}</button>
									))}
								</div>
							</div>
						</>
					)}
				</div>

				{/* Preview */}
				<div style={{ flex: "1 1 260px", minWidth: 0 }}>
					<div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--c-text-3)", marginBottom: 8 }}>Live preview</div>
					<CmsPreview title={title} body={body} type={type} accent={accent} cta={cta} />
					<div style={{ fontSize: 12, marginTop: 12, color: "var(--c-text-3)", lineHeight: 1.6 }}>
						Targeting: {audience}<br />Placement: {type === "FAQ" ? "Help center" : placement}
					</div>
				</div>
			</div>

			<div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 4 }}>
				<button onClick={onClose} style={{ height: 36, padding: "0 16px", borderRadius: 10, border: "1px solid var(--c-line)", background: "transparent", fontSize: 13, fontWeight: 500, color: "var(--c-text)", cursor: "pointer" }}>Cancel</button>
				<button onClick={() => { toast.success("Saved as draft"); onClose(); }} disabled={!ok} style={{ height: 36, padding: "0 16px", borderRadius: 10, border: "1px solid var(--c-line)", background: "transparent", fontSize: 13, fontWeight: 500, color: "var(--c-text)", cursor: ok ? "pointer" : "not-allowed", opacity: ok ? 1 : 0.45 }}>Save draft</button>
				<button onClick={() => { toast.success(`${type} published to ${audience}`); onClose(); }} disabled={!ok} style={{ height: 36, padding: "0 16px", borderRadius: 10, border: "none", background: "var(--c-lime-500)", fontSize: 13, fontWeight: 600, color: "var(--c-onyx-900)", cursor: ok ? "pointer" : "not-allowed", opacity: ok ? 1 : 0.45 }}>Publish</button>
			</div>
		</div>
	);
}
