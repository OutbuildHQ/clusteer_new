"use client";
import { useState } from "react";
import { Check, Clock, Download, FileText, Copy, Info, ArrowUpRight } from "lucide-react";
import { QuoteSummary, SettlementProgress, formatNaira } from "./quote-summary";
export function TransactionWorkspace({ reference = "PREVIEW-1048" }: { reference?: string }) {
	const [notes, setNotes] = useState<string[]>([]);
	const [draft, setDraft] = useState("");
	const [copied, setCopied] = useState(false);
	const [copyError, setCopyError] = useState(false);
	const [status, setStatus] = useState<"pending" | "completed" | "failed">("pending");
	const amount = 1000,
		rate = 1450,
		fee = 10875;
	async function copy() {
		try {
			await navigator.clipboard.writeText(reference);
			setCopied(true);
			setCopyError(false);
		} catch {
			setCopyError(true);
		}
	}
	function exportExample() {
		const safe = (value: string) =>
			'"' + (/^[=+@\-]/.test(value) ? "'" + value : value).replace(/"/g, '""') + '"';
		const rows = [
			[
				"Preview reference",
				"Asset",
				"Amount",
				"Illustrative rate NGN",
				"Fee NGN",
				"Net payout NGN",
				"Preview status",
			],
			[
				reference,
				"USDT",
				String(amount),
				String(rate),
				String(fee),
				String(amount * rate - fee),
				status,
			],
		];
		const url = URL.createObjectURL(
			new Blob([rows.map((row) => row.map(safe).join(",")).join("\n")], {
				type: "text/csv;charset=utf-8;",
			})
		);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = "clusteer-illustrative-transaction.csv";
		anchor.click();
		URL.revokeObjectURL(url);
	}
	return (
		<div className="cl-workspace">
			<div className="cl-page-heading">
				<div>
					<span className="cl-kicker">Operations / Transactions</span>
					<h1>A complete view of the order.</h1>
					<p>Follow the transfer, review the details and keep your team informed.</p>
				</div>
				<button className="cl-button cl-button-outline" onClick={exportExample}>
					<Download size={15} /> Export example
				</button>
			</div>
			<div className="cl-preview-notice">
				<Info size={16} />
				<span>
					Design preview · this is an illustrative transaction. Status changes and notes stay in
					this preview and do not affect any account.
				</span>
			</div>
			<div className="cl-work-grid">
				<div className="cl-secondary-stack">
					<section className="cl-panel">
						<div className="cl-admin-summary">
							<div>
								<span
									className={`cl-status cl-status-${status === "completed" ? "success" : status === "failed" ? "failed" : "pending"}`}
								>
									{status === "completed"
										? "Payout confirmed"
										: status === "failed"
											? "Needs attention"
											: "Bank payout pending"}
								</span>
								<strong>{formatNaira(amount * rate - fee)}</strong>
								<p>Net bank payout · Sell 1,000 USDT</p>
							</div>
							<div>
								<span className="cl-demo-label">Order reference</span>
								<div className="cl-action-row mt-2">
									<code className="text-xs">{reference}</code>
									<button aria-label="Copy order reference" onClick={copy}>
										{copied ? <Check size={14} /> : <Copy size={14} />}
									</button>
								</div>
								{copyError && <p role="alert">Couldn’t copy. Select the reference above.</p>}
							</div>
						</div>
						<SettlementProgress current={status === "completed" ? 3 : 2} />
						<div className="cl-details">
							<div>
								<dt>Conversion</dt>
								<dd>USDT → NGN</dd>
							</div>
							<div>
								<dt>Selected network</dt>
								<dd>Tron / TRC20</dd>
							</div>
							<div>
								<dt>Bank destination</dt>
								<dd>Example Bank · •• 0000</dd>
							</div>
							<div>
								<dt>Customer</dt>
								<dd>Demo customer</dd>
							</div>
						</div>
					</section>
					<section className="cl-panel">
						<div className="cl-panel-heading">
							<h2>Activity</h2>
							<span className="cl-demo-label">Illustrative timeline</span>
						</div>
						<ol className="cl-timeline">
							<li>
								<Check size={17} />
								<div>
									<strong>Quote reviewed</strong>
									<small>14:20 · Rate and fee accepted</small>
								</div>
							</li>
							<li>
								<Check size={17} />
								<div>
									<strong>Transfer received</strong>
									<small>14:24 · Network confirmation complete</small>
								</div>
							</li>
							<li>
								{status === "completed" ? <Check size={17} /> : <Clock size={17} />}
								<div>
									<strong>
										{status === "completed"
											? "Bank payout confirmed"
											: status === "failed"
												? "Bank payout needs review"
												: "Waiting for bank confirmation"}
									</strong>
									<small>
										{status === "completed"
											? "14:26 · Receipt available"
											: status === "failed"
												? "Check the payout response before taking action"
												: "14:25 · Payout submitted"}
									</small>
								</div>
							</li>
						</ol>
					</section>
					<section className="cl-panel">
						<h2>Internal notes</h2>
						<p className="mt-2">
							Use this preview to try the team handoff. Notes are not saved to a server.
						</p>
						{notes.map((note, i) => (
							<div className="cl-saved-note" key={i}>
								{note}
								<small>Preview note · this session only</small>
							</div>
						))}
						<label className="sr-only" htmlFor="internal-preview-note">
							Add an internal preview note
						</label>
						<textarea
							id="internal-preview-note"
							className="cl-note-input"
							placeholder="Add context for the next person…"
							value={draft}
							maxLength={2000}
							onChange={(e) => setDraft(e.target.value)}
						/>
						<button
							className="cl-button cl-button-dark"
							disabled={!draft.trim()}
							onClick={() => {
								setNotes((n) => [...n, draft.trim()]);
								setDraft("");
							}}
						>
							<FileText size={15} /> Add preview note
						</button>
					</section>
				</div>
				<aside className="cl-secondary-stack">
					<section className="cl-panel">
						<h2>Conversion breakdown</h2>
						<QuoteSummary amount={amount} rate={rate} fee={fee} illustrative />
					</section>
					<section className="cl-panel">
						<h2>Explore the states</h2>
						<p className="mt-3">See how the workspace responds to different payout outcomes.</p>
						<label htmlFor="preview-status" className="cl-kicker mt-5">
							Illustrative payout status
						</label>
						<select
							id="preview-status"
							value={status}
							onChange={(e) => setStatus(e.target.value as typeof status)}
							className="w-full rounded-lg border border-ds-line bg-ds-surface p-3 text-sm"
						>
							<option value="pending">Pending</option>
							<option value="completed">Completed</option>
							<option value="failed">Needs attention</option>
						</select>
						{status === "failed" && (
							<p className="mt-4" role="status">
								The example bank could not confirm this payout. An operator would review the
								response and contact the customer before retrying.
							</p>
						)}
					</section>
				</aside>
			</div>
		</div>
	);
}
