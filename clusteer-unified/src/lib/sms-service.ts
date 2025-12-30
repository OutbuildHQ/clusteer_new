/**
 * SMS Service using Termii (Nigeria-focused)
 * Handles SMS for 2FA, notifications, and alerts
 */

const TERMII_API_KEY = process.env.TERMII_API_KEY || '';
const TERMII_SENDER_ID = process.env.TERMII_SENDER_ID || 'Clusteer';
const TERMII_BASE_URL = 'https://api.ng.termii.com/api';

export interface SMSTemplate {
  to: string; // Phone number in international format (e.g., +2348012345678)
  message: string;
}

/**
 * Send SMS using Termii
 */
export async function sendSMS(template: SMSTemplate): Promise<boolean> {
  if (!TERMII_API_KEY) {
    console.warn('Termii API key not configured. SMS not sent.');
    console.log('SMS would have been sent to:', template.to);
    console.log('Message:', template.message);
    return false;
  }

  try {
    const response = await fetch(`${TERMII_BASE_URL}/sms/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: template.to,
        from: TERMII_SENDER_ID,
        sms: template.message,
        type: 'plain',
        channel: 'generic',
        api_key: TERMII_API_KEY,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Termii API error:', errorData);
      return false;
    }

    const result = await response.json();
    console.log(`SMS sent successfully to ${template.to}`, result);
    return true;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return false;
  }
}

/**
 * Send OTP using Termii
 */
export async function sendOTP(
  phoneNumber: string,
  pinType: 'NUMERIC' | 'ALPHANUMERIC' = 'NUMERIC',
  pinLength: number = 6
): Promise<{ success: boolean; pinId?: string; error?: string }> {
  if (!TERMII_API_KEY) {
    console.warn('Termii API key not configured. OTP not sent.');
    return {
      success: false,
      error: 'SMS service not configured',
    };
  }

  try {
    const response = await fetch(`${TERMII_BASE_URL}/sms/otp/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: TERMII_API_KEY,
        message_type: 'NUMERIC',
        to: phoneNumber,
        from: TERMII_SENDER_ID,
        channel: 'generic',
        pin_attempts: 3,
        pin_time_to_live: 5, // 5 minutes
        pin_length: pinLength,
        pin_placeholder: '< 1234 >',
        message_text: `Your Clusteer verification code is < 1234 >. Valid for 5 minutes.`,
        pin_type: pinType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Termii OTP error:', errorData);
      return {
        success: false,
        error: errorData.message || 'Failed to send OTP',
      };
    }

    const result = await response.json();
    return {
      success: true,
      pinId: result.pinId,
    };
  } catch (error: any) {
    console.error('Failed to send OTP:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Verify OTP using Termii
 */
export async function verifyOTP(
  pinId: string,
  pin: string
): Promise<{ success: boolean; verified: boolean; error?: string }> {
  if (!TERMII_API_KEY) {
    return {
      success: false,
      verified: false,
      error: 'SMS service not configured',
    };
  }

  try {
    const response = await fetch(`${TERMII_BASE_URL}/sms/otp/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: TERMII_API_KEY,
        pin_id: pinId,
        pin: pin,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: true,
        verified: false,
        error: errorData.message || 'Invalid OTP',
      };
    }

    const result = await response.json();
    return {
      success: true,
      verified: result.verified === true || result.verified === 'True',
    };
  } catch (error: any) {
    console.error('Failed to verify OTP:', error);
    return {
      success: false,
      verified: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * SMS Templates
 */
export const SMSTemplates = {
  /**
   * 2FA code
   */
  twoFactorAuth: (phoneNumber: string, code: string): SMSTemplate => ({
    to: phoneNumber,
    message: `Your Clusteer 2FA code is: ${code}. Valid for 5 minutes. Do not share this code.`,
  }),

  /**
   * Login alert
   */
  loginAlert: (phoneNumber: string, location: string): SMSTemplate => ({
    to: phoneNumber,
    message: `New login detected on your Clusteer account from ${location}. If this wasn't you, secure your account immediately.`,
  }),

  /**
   * Transaction notification
   */
  transactionNotification: (
    phoneNumber: string,
    type: string,
    amount: string,
    currency: string
  ): SMSTemplate => ({
    to: phoneNumber,
    message: `Clusteer: ${type.toUpperCase()} transaction of ${amount} ${currency} completed. Check your account for details.`,
  }),

  /**
   * Withdrawal confirmation
   */
  withdrawalConfirmation: (phoneNumber: string, amount: string): SMSTemplate => ({
    to: phoneNumber,
    message: `Clusteer: Withdrawal of ₦${amount} has been initiated. Funds should arrive in 1-3 business days.`,
  }),

  /**
   * KYC status
   */
  kycStatus: (phoneNumber: string, status: 'approved' | 'rejected'): SMSTemplate => ({
    to: phoneNumber,
    message:
      status === 'approved'
        ? `Clusteer: Your KYC verification has been approved! You now have access to all features.`
        : `Clusteer: Your KYC verification needs review. Please check your email for details.`,
  }),

  /**
   * Security alert
   */
  securityAlert: (phoneNumber: string, alertType: string): SMSTemplate => ({
    to: phoneNumber,
    message: `SECURITY ALERT: ${alertType} on your Clusteer account. If this wasn't you, contact support immediately.`,
  }),
};
