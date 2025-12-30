/**
 * Email Service using SendGrid
 * Handles all email communications for the platform
 */

import sgMail from '@sendgrid/mail';

// Initialize SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@clusteer.io';
const FROM_NAME = process.env.SENDGRID_FROM_NAME || 'Clusteer';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export interface EmailTemplate {
  to: string;
  subject: string;
  text: string;
  html: string;
}

/**
 * Send email using SendGrid
 */
export async function sendEmail(template: EmailTemplate): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured. Email not sent.');
    console.log('Email would have been sent to:', template.to);
    console.log('Subject:', template.subject);
    return false;
  }

  try {
    await sgMail.send({
      to: template.to,
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME,
      },
      subject: template.subject,
      text: template.text,
      html: template.html,
    });

    console.log(`Email sent successfully to ${template.to}`);
    return true;
  } catch (error: any) {
    console.error('Failed to send email:', error);
    if (error.response) {
      console.error('SendGrid error:', error.response.body);
    }
    return false;
  }
}

/**
 * Email Templates
 */

export const EmailTemplates = {
  /**
   * Welcome email after registration
   */
  welcome: (email: string, firstName: string): EmailTemplate => ({
    to: email,
    subject: 'Welcome to Clusteer - Your Crypto Trading Platform',
    text: `Hi ${firstName},\n\nWelcome to Clusteer! We're excited to have you on board.\n\nYour account has been created successfully. You can now:\n- Buy and sell USDT/USDC\n- Trade with zero gas fees\n- Withdraw to your bank account\n\nGet started: https://app.clusteer.io/dashboard\n\nBest regards,\nThe Clusteer Team`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #014F01; color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 30px; background: #014F01; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Clusteer!</h1>
          </div>
          <div class="content">
            <h2>Hi ${firstName},</h2>
            <p>Welcome to Clusteer! We're excited to have you on board.</p>
            <p>Your account has been created successfully. You can now:</p>
            <ul>
              <li>Buy and sell USDT/USDC</li>
              <li>Trade with zero gas fees</li>
              <li>Withdraw to your Nigerian bank account</li>
            </ul>
            <a href="https://app.clusteer.io/dashboard" class="button">Get Started</a>
          </div>
          <div class="footer">
            <p>© 2025 Clusteer. All rights reserved.</p>
            <p>Need help? Contact us at support@clusteer.io</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  /**
   * Email verification
   */
  emailVerification: (email: string, verificationLink: string): EmailTemplate => ({
    to: email,
    subject: 'Verify Your Email - Clusteer',
    text: `Please verify your email address by clicking this link: ${verificationLink}\n\nThis link will expire in 24 hours.\n\nIf you didn't create an account, please ignore this email.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #014F01; color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 30px; background: #014F01; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email</h1>
          </div>
          <div class="content">
            <p>Please verify your email address by clicking the button below:</p>
            <a href="${verificationLink}" class="button">Verify Email</a>
            <p>Or copy this link: <br>${verificationLink}</p>
            <p><strong>This link will expire in 24 hours.</strong></p>
            <p>If you didn't create an account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2025 Clusteer. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  /**
   * Password reset email
   */
  passwordReset: (email: string, resetLink: string): EmailTemplate => ({
    to: email,
    subject: 'Reset Your Password - Clusteer',
    text: `You requested a password reset. Click this link to reset your password: ${resetLink}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #014F01; color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 30px; background: #014F01; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Your Password</h1>
          </div>
          <div class="content">
            <p>You requested a password reset for your Clusteer account.</p>
            <a href="${resetLink}" class="button">Reset Password</a>
            <p>Or copy this link: <br>${resetLink}</p>
            <div class="warning">
              <strong>Security Notice:</strong> This link will expire in 1 hour.
            </div>
            <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p>© 2025 Clusteer. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  /**
   * Transaction notification
   */
  transactionNotification: (
    email: string,
    type: 'buy' | 'sell' | 'deposit' | 'withdrawal',
    amount: string,
    currency: string,
    status: string
  ): EmailTemplate => ({
    to: email,
    subject: `Transaction ${status}: ${type.toUpperCase()} ${amount} ${currency}`,
    text: `Your ${type} transaction of ${amount} ${currency} is ${status}.\n\nView details: https://app.clusteer.io/transactions`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #014F01; color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .transaction { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 30px; background: #014F01; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Transaction ${status}</h1>
          </div>
          <div class="content">
            <div class="transaction">
              <h3>Transaction Details</h3>
              <p><strong>Type:</strong> ${type.toUpperCase()}</p>
              <p><strong>Amount:</strong> ${amount} ${currency}</p>
              <p><strong>Status:</strong> ${status}</p>
            </div>
            <a href="https://app.clusteer.io/transactions" class="button">View Transaction</a>
          </div>
          <div class="footer">
            <p>© 2025 Clusteer. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  /**
   * KYC status update
   */
  kycStatusUpdate: (email: string, firstName: string, status: 'approved' | 'rejected'): EmailTemplate => ({
    to: email,
    subject: `KYC Verification ${status === 'approved' ? 'Approved' : 'Rejected'} - Clusteer`,
    text: status === 'approved'
      ? `Hi ${firstName},\n\nGreat news! Your KYC verification has been approved.\n\nYou can now enjoy full access to all Clusteer features including higher withdrawal limits.\n\nView your account: https://app.clusteer.io/settings`
      : `Hi ${firstName},\n\nYour KYC verification was not approved. Please review your information and try again.\n\nCommon issues:\n- Document not clear\n- Information mismatch\n- Invalid document\n\nResubmit verification: https://app.clusteer.io/identity-verification`,
    html: status === 'approved' ? `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 30px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ KYC Approved!</h1>
          </div>
          <div class="content">
            <h2>Hi ${firstName},</h2>
            <p>Great news! Your KYC verification has been <strong>approved</strong>.</p>
            <p>You can now enjoy:</p>
            <ul>
              <li>Higher transaction limits</li>
              <li>Faster withdrawals</li>
              <li>Full platform access</li>
            </ul>
            <a href="https://app.clusteer.io/settings" class="button">View Account</a>
          </div>
          <div class="footer">
            <p>© 2025 Clusteer. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    ` : `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 30px; background: #014F01; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>KYC Not Approved</h1>
          </div>
          <div class="content">
            <h2>Hi ${firstName},</h2>
            <p>Your KYC verification was not approved. Please review and resubmit.</p>
            <p><strong>Common issues:</strong></p>
            <ul>
              <li>Document not clear or readable</li>
              <li>Information mismatch</li>
              <li>Invalid or expired document</li>
            </ul>
            <a href="https://app.clusteer.io/identity-verification" class="button">Try Again</a>
          </div>
          <div class="footer">
            <p>© 2025 Clusteer. All rights reserved.</p>
            <p>Need help? Contact support@clusteer.io</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  /**
   * Security alert
   */
  securityAlert: (email: string, alertType: string, details: string): EmailTemplate => ({
    to: email,
    subject: `Security Alert: ${alertType} - Clusteer`,
    text: `Security Alert: ${alertType}\n\n${details}\n\nIf this wasn't you, please contact support immediately.\n\nSecure your account: https://app.clusteer.io/settings/security`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .alert { background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 30px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Security Alert</h1>
          </div>
          <div class="content">
            <div class="alert">
              <h3>${alertType}</h3>
              <p>${details}</p>
            </div>
            <p><strong>If this wasn't you, please secure your account immediately.</strong></p>
            <a href="https://app.clusteer.io/settings/security" class="button">Secure Account</a>
          </div>
          <div class="footer">
            <p>© 2025 Clusteer. All rights reserved.</p>
            <p>Support: support@clusteer.io</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};
