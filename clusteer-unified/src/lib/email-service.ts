/**
 * Email Service using Resend
 * Handles all email communications for the platform
 * https://resend.com/docs/send-with-nextjs
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@clusteer.com';
const REPLY_TO_EMAIL = process.env.EMAIL_REPLY_TO || 'support@clusteer.com';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

export interface EmailOptions {
	to: string;
	subject: string;
	html: string;
	text?: string;
	replyTo?: string;
}

/**
 * Send a generic email
 */
export async function sendEmail(options: EmailOptions) {
	try {
		if (!process.env.RESEND_API_KEY) {
			console.warn('RESEND_API_KEY not configured. Email not sent:', options.subject);
			return { success: false, error: 'Email service not configured' };
		}

		const { data, error } = await resend.emails.send({
			from: FROM_EMAIL,
			to: options.to,
			subject: options.subject,
			html: options.html,
			text: options.text,
			replyTo: options.replyTo || REPLY_TO_EMAIL,
		});

		if (error) {
			console.error('Email send error:', error);
			return { success: false, error: error.message };
		}

		console.log('Email sent successfully:', { id: data?.id, to: options.to });
		return { success: true, data };
	} catch (error) {
		console.error('Email service error:', error);
		return { success: false, error: 'Failed to send email' };
	}
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(to: string, username: string) {
	return sendEmail({
		to,
		subject: 'Welcome to Clusteer!',
		html: `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Welcome to Clusteer</title>
			</head>
			<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
				<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
					<h1 style="color: white; margin: 0;">Welcome to Clusteer!</h1>
				</div>

				<div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
					<p>Hi ${username},</p>

					<p>Thank you for joining Clusteer! We're excited to have you as part of our community.</p>

					<p>Here's what you can do now:</p>
					<ul>
						<li>Complete your identity verification (KYC) to unlock all features</li>
						<li>Add funds to your wallet</li>
						<li>Start trading USDT/USDC ↔ NGN</li>
						<li>Send crypto to other verified users</li>
					</ul>

					<div style="text-align: center; margin: 30px 0;">
						<a href="${APP_URL}/dashboard" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Dashboard</a>
					</div>

					<p style="color: #666; font-size: 14px;">Need help? Reply to this email and our support team will assist you.</p>
				</div>

				<div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
					<p>© 2025 Clusteer. All rights reserved.</p>
					<p>Lagos, Nigeria</p>
				</div>
			</body>
			</html>
		`,
		text: `Hi ${username},\n\nThank you for joining Clusteer! We're excited to have you as part of our community.\n\nVisit your dashboard: ${APP_URL}/dashboard\n\nNeed help? Reply to this email and our support team will assist you.`,
	});
}

/**
 * Send email verification code
 */
export async function sendVerificationEmail(to: string, code: string) {
	return sendEmail({
		to,
		subject: 'Verify Your Email - Clusteer',
		html: `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
			</head>
			<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
				<div style="background: #667eea; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
					<h1 style="color: white; margin: 0;">Verify Your Email</h1>
				</div>

				<div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
					<p>Please use the following code to verify your email address:</p>

					<div style="background: white; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px;">
						${code}
					</div>

					<p>This code will expire in 15 minutes.</p>

					<p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
				</div>
			</body>
			</html>
		`,
		text: `Your verification code is: ${code}\n\nThis code will expire in 15 minutes.\n\nIf you didn't request this code, please ignore this email.`,
	});
}

/**
 * Send transaction notification
 */
export async function sendTransactionNotification(
	to: string,
	username: string,
	type: 'buy' | 'sell' | 'send' | 'receive',
	amount: number,
	currency: string
) {
	const actionText = {
		buy: 'purchased',
		sell: 'sold',
		send: 'sent',
		receive: 'received',
	}[type];

	return sendEmail({
		to,
		subject: `Transaction ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}: ${amount} ${currency}`,
		html: `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
			</head>
			<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
				<div style="background: #667eea; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
					<h1 style="color: white; margin: 0;">Transaction Notification</h1>
				</div>

				<div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
					<p>Hi ${username},</p>

					<p>You have successfully ${actionText} <strong>${amount} ${currency}</strong>.</p>

					<div style="text-align: center; margin: 30px 0;">
						<a href="${APP_URL}/transaction-history" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">View Transaction History</a>
					</div>

					<p style="color: #666; font-size: 14px;">This is an automated notification. If you didn't perform this transaction, please contact support immediately.</p>
				</div>
			</body>
			</html>
		`,
		text: `Hi ${username},\n\nYou have successfully ${actionText} ${amount} ${currency}.\n\nView your transaction history: ${APP_URL}/transaction-history\n\nIf you didn't perform this transaction, please contact support immediately.`,
	});
}

/**
 * Send KYC verification status update
 */
export async function sendKYCStatusEmail(
	to: string,
	username: string,
	status: 'approved' | 'rejected',
	reason?: string
) {
	const isApproved = status === 'approved';

	return sendEmail({
		to,
		subject: `Identity Verification ${isApproved ? 'Approved' : 'Update'} - Clusteer`,
		html: `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
			</head>
			<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
				<div style="background: ${isApproved ? '#10b981' : '#f59e0b'}; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
					<h1 style="color: white; margin: 0;">Identity Verification ${isApproved ? 'Approved' : 'Update'}</h1>
				</div>

				<div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
					<p>Hi ${username},</p>

					${
						isApproved
							? `
						<p>Great news! Your identity verification has been approved. You now have full access to all Clusteer features.</p>

						<p>You can now:</p>
						<ul>
							<li>Trade larger amounts</li>
							<li>Receive transfers from other users</li>
							<li>Access premium features</li>
						</ul>

						<div style="text-align: center; margin: 30px 0;">
							<a href="${APP_URL}/dashboard" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Dashboard</a>
						</div>
					`
							: `
						<p>We were unable to verify your identity at this time.</p>
						${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
						<p>Please ensure that:</p>
						<ul>
							<li>Your documents are clear and readable</li>
							<li>All information matches your official documents</li>
							<li>You've provided all required information</li>
						</ul>

						<div style="text-align: center; margin: 30px 0;">
							<a href="${APP_URL}/identity-verification" style="background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Try Again</a>
						</div>
					`
					}

					<p style="color: #666; font-size: 14px;">Need help? Reply to this email and our support team will assist you.</p>
				</div>
			</body>
			</html>
		`,
		text: `Hi ${username},\n\n${isApproved ? 'Your identity verification has been approved!' : 'We were unable to verify your identity at this time.'}\n\n${!isApproved && reason ? `Reason: ${reason}\n\n` : ''}Visit: ${APP_URL}/${isApproved ? 'dashboard' : 'identity-verification'}`,
	});
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(to: string, resetLink: string) {
	return sendEmail({
		to,
		subject: 'Reset Your Password - Clusteer',
		html: `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
			</head>
			<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
				<div style="background: #667eea; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
					<h1 style="color: white; margin: 0;">Reset Your Password</h1>
				</div>

				<div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
					<p>We received a request to reset your password.</p>

					<div style="text-align: center; margin: 30px 0;">
						<a href="${resetLink}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
					</div>

					<p>This link will expire in 1 hour.</p>

					<p style="color: #666; font-size: 14px;">If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
				</div>
			</body>
			</html>
		`,
		text: `Reset your password using this link: ${resetLink}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this password reset, please ignore this email.`,
	});
}
