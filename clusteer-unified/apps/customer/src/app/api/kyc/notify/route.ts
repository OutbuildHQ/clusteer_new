import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_KEY = process.env.BLOCKCHAIN_ENGINE_API_KEY || "";

/**
 * POST /api/kyc/notify
 * Called by Django when a KYC verification status changes (approved / rejected).
 * Sends an email to the user via Resend.
 *
 * Expected body:
 *   { userId: string, email: string, status: "approved" | "rejected", reason?: string }
 */
export async function POST(request: NextRequest) {
  // ── 1. Verify caller is Django (shared API key) ────────────────────────────
  const callerKey = request.headers.get("x-api-key") || request.headers.get("X-API-KEY");
  if (!callerKey || callerKey !== DJANGO_API_KEY) {
    return NextResponse.json({ status: false, message: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { email, status, reason } = body as {
      userId?: string;
      email?: string;
      status?: "approved" | "rejected";
      reason?: string;
    };

    if (!email || !status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { status: false, message: "email and status (approved|rejected) are required" },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.clusteer.com";

    const isApproved = status === "approved";

    const subject = isApproved
      ? "Identity verified — you're ready to trade on Clusteer"
      : "Action required: KYC verification update";

    const html = isApproved
      ? `
        <p>Great news! Your identity has been verified.</p>
        <p>You can now access all features on Clusteer, including buying, selling, and withdrawing funds.</p>
        <p style="margin: 24px 0;">
          <a href="${appUrl}/dashboard" style="background:#9FE870;color:#21241D;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
            Go to dashboard
          </a>
        </p>
      `
      : `
        <p>We were unable to verify your identity${reason ? ` — ${reason}` : ""}.</p>
        <p>Please resubmit your verification documents with a clearer photo.</p>
        <p style="margin: 24px 0;">
          <a href="${appUrl}/identity-verification" style="background:#9FE870;color:#21241D;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
            Retry verification
          </a>
        </p>
        <p style="font-size:13px;color:#666;">If you believe this is an error, contact our support team.</p>
      `;

    if (resendApiKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "Clusteer <noreply@clusteer.com>",
          to: [email],
          subject,
          html,
        }),
      });
    } else {
      console.info(`[kyc/notify] KYC ${status} for ${email}${reason ? ` — reason: ${reason}` : ""}`);
    }

    return NextResponse.json({ status: true, message: "Notification sent" });
  } catch (error) {
    console.error("KYC notify error:", error);
    return NextResponse.json({ status: false, message: "Failed to send notification" }, { status: 500 });
  }
}
