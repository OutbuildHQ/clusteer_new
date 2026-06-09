/**
 * Email notification service using SendGrid.
 *
 * Server-side only — use in Next.js API routes, not in client components.
 *
 * Setup:
 *   1. Set SENDGRID_API_KEY in .env.local
 *   2. Set SENDGRID_FROM_EMAIL (defaults to noreply@clusteer.com)
 */

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "";
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || "noreply@clusteer.com";
const FROM_NAME = "Clusteer";

interface EmailOptions {
	to: string;
	subject: string;
	html: string;
	text?: string;
}

/**
 * Send an email via SendGrid API.
 * Returns true on success, false on failure (non-throwing).
 */
export async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<boolean> {
	if (!SENDGRID_API_KEY) {
		console.warn("[email] SendGrid API key not configured, skipping email");
		return false;
	}

	try {
		const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${SENDGRID_API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				personalizations: [{ to: [{ email: to }] }],
				from: { email: FROM_EMAIL, name: FROM_NAME },
				subject,
				content: [
					...(text ? [{ type: "text/plain", value: text }] : []),
					{ type: "text/html", value: html },
				],
			}),
		});

		if (res.ok || res.status === 202) {
			return true;
		}

		console.error(`[email] SendGrid error: ${res.status} ${res.statusText}`);
		return false;
	} catch (err) {
		console.error("[email] Failed to send:", err);
		return false;
	}
}

// ── Pre-built templates ──

export async function sendWelcomeEmail(to: string, name: string) {
	return sendEmail({
		to,
		subject: "Welcome to Clusteer!",
		html: `
			<div style="font-family: Inter, sans-serif; max-width: 520px; margin: 0 auto;">
				<h1 style="font-size: 24px; margin-bottom: 16px;">Welcome to Clusteer, ${name}!</h1>
				<p style="color: #666; line-height: 1.6;">Your account is ready. You can now buy, sell, and hold USDT and USDC with Naira.</p>
				<p style="color: #666; line-height: 1.6;">Next step: verify your BVN to unlock full trading access.</p>
				<a href="https://clusteer.com/identity-verification" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #9FE870; color: #21241D; border-radius: 999px; text-decoration: none; font-weight: 600;">Verify BVN</a>
				<p style="color: #999; font-size: 12px; margin-top: 32px;">© Clusteer. All rights reserved.</p>
			</div>
		`,
	});
}

export async function sendTradeConfirmation(to: string, side: string, amount: string, currency: string) {
	const action = side === "buy" ? "purchased" : "sold";
	return sendEmail({
		to,
		subject: `Trade confirmed: ${side === "buy" ? "Bought" : "Sold"} ${amount} ${currency}`,
		html: `
			<div style="font-family: Inter, sans-serif; max-width: 520px; margin: 0 auto;">
				<h1 style="font-size: 24px; margin-bottom: 16px;">Trade Confirmed</h1>
				<p style="color: #666; line-height: 1.6;">You've successfully ${action} <strong>${amount} ${currency}</strong>.</p>
				<a href="https://clusteer.com/transaction-history" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #9FE870; color: #21241D; border-radius: 999px; text-decoration: none; font-weight: 600;">View transaction</a>
				<p style="color: #999; font-size: 12px; margin-top: 32px;">© Clusteer. All rights reserved.</p>
			</div>
		`,
	});
}

export async function sendWithdrawalAlert(to: string, amount: string, bankName: string) {
	return sendEmail({
		to,
		subject: `Withdrawal initiated: ₦${amount}`,
		html: `
			<div style="font-family: Inter, sans-serif; max-width: 520px; margin: 0 auto;">
				<h1 style="font-size: 24px; margin-bottom: 16px;">Withdrawal Initiated</h1>
				<p style="color: #666; line-height: 1.6;">₦${amount} is being sent to your ${bankName} account. This typically takes 1-5 minutes.</p>
				<p style="color: #999; font-size: 12px; margin-top: 32px;">If you didn't initiate this withdrawal, contact support immediately at support@clusteer.com.</p>
				<p style="color: #999; font-size: 12px;">© Clusteer. All rights reserved.</p>
			</div>
		`,
	});
}

export async function sendSecurityAlert(to: string, action: string, ip: string) {
	return sendEmail({
		to,
		subject: `Security alert: ${action}`,
		html: `
			<div style="font-family: Inter, sans-serif; max-width: 520px; margin: 0 auto;">
				<h1 style="font-size: 24px; margin-bottom: 16px; color: #DC2626;">Security Alert</h1>
				<p style="color: #666; line-height: 1.6;"><strong>${action}</strong> was detected on your account from IP: ${ip}.</p>
				<p style="color: #666; line-height: 1.6;">If this wasn't you, secure your account immediately by changing your password and enabling 2FA.</p>
				<p style="color: #999; font-size: 12px; margin-top: 32px;">© Clusteer. All rights reserved.</p>
			</div>
		`,
	});
}
