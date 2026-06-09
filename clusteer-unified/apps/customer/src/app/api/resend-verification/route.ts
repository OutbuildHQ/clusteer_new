import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limiter";

export async function POST(request: NextRequest) {
  const rateLimitResponse = rateLimit(request, RateLimitPresets.moderate);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { email } = await request.json().catch(() => ({}));
    if (!email || typeof email !== "string") {
      return NextResponse.json({ status: false, message: "Email is required" }, { status: 400 });
    }

    const adminAuth = getAdminAuth();

    // Look up user to confirm they exist and aren't already verified
    const userRecord = await adminAuth.getUserByEmail(email).catch(() => null);
    if (!userRecord) {
      // Don't reveal whether the email exists
      return NextResponse.json({ status: true, message: "Verification email sent if account exists" });
    }

    if (userRecord.emailVerified) {
      return NextResponse.json({ status: false, message: "Email is already verified. Please log in." }, { status: 400 });
    }

    // Generate a verification link via Firebase Admin
    const verificationLink = await adminAuth.generateEmailVerificationLink(email, {
      url: `${process.env.NEXT_PUBLIC_APP_URL || "https://app.clusteer.com"}/login`,
    });

    // Send via Resend if configured, otherwise log for dev
    const resendApiKey = process.env.RESEND_API_KEY;
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
          subject: "Verify your Clusteer email",
          html: `
            <p>Hi there,</p>
            <p>Click the button below to verify your email address and activate your Clusteer account.</p>
            <p style="margin: 24px 0;">
              <a href="${verificationLink}" style="background:#9FE870;color:#21241D;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
                Verify email
              </a>
            </p>
            <p>This link expires in 24 hours. If you didn't create a Clusteer account, you can ignore this email.</p>
          `,
        }),
      });
    } else {
      // Dev fallback — link is logged server-side only
      console.info("[resend-verification] Email verification link:", verificationLink);
    }

    return NextResponse.json({ status: true, message: "Verification email sent" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to send verification email";
    console.error("resend-verification error:", error);
    return NextResponse.json({ status: false, message }, { status: 500 });
  }
}
