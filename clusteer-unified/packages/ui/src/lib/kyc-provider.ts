/**
 * KYC Provider Integration
 * Supports multiple KYC providers for Nigeria: Smile Identity, Youverify, Prembly
 */

interface KYCVerificationRequest {
	userId: string;
	verificationType: 'BVN' | 'NIN';
	documentNumber: string;
	firstName?: string;
	lastName?: string;
	dateOfBirth?: string;
	phoneNumber?: string;
}

interface KYCVerificationResponse {
	success: boolean;
	verified: boolean;
	message: string;
	data?: {
		fullName?: string;
		dateOfBirth?: string;
		gender?: string;
		phoneNumber?: string;
		address?: string;
		photoUrl?: string;
		confidence?: number;
	};
	error?: string;
}

/**
 * Smile Identity Integration (Recommended for Nigeria)
 * Docs: https://docs.smileidentity.com
 */
export class SmileIdentityProvider {
	private apiKey: string;
	private partnerId: string;
	private apiUrl: string;
	private isProduction: boolean;

	constructor() {
		this.apiKey = process.env.SMILE_IDENTITY_API_KEY || '';
		this.partnerId = process.env.SMILE_IDENTITY_PARTNER_ID || '';
		this.isProduction = process.env.NODE_ENV === 'production';
		this.apiUrl = this.isProduction
			? 'https://api.smileidentity.com/v1'
			: 'https://testapi.smileidentity.com/v1';
	}

	async verifyBVN(request: KYCVerificationRequest): Promise<KYCVerificationResponse> {
		try {
			if (!this.apiKey || !this.partnerId) {
				throw new Error('Smile Identity credentials not configured');
			}

			const response = await fetch(`${this.apiUrl}/id_verification`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${this.apiKey}`,
				},
				body: JSON.stringify({
					partner_id: this.partnerId,
					source_sdk: 'rest_api',
					source_sdk_version: '1.0.0',
					country: 'NG',
					id_type: 'BVN',
					id_number: request.documentNumber,
					first_name: request.firstName,
					last_name: request.lastName,
					dob: request.dateOfBirth, // Format: YYYY-MM-DD
					phone_number: request.phoneNumber,
					user_id: request.userId,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				return {
					success: false,
					verified: false,
					message: 'BVN verification failed',
					error: error.message || 'Unknown error',
				};
			}

			const result = await response.json();

			// Smile Identity response structure
			const isVerified = result.ResultCode === '1012'; // Success code
			const confidence = parseFloat(result.ConfidenceValue || '0');

			return {
				success: true,
				verified: isVerified && confidence >= 80, // 80% confidence threshold
				message: isVerified ? 'BVN verified successfully' : 'BVN verification failed',
				data: isVerified ? {
					fullName: `${result.FullData?.FirstName || ''} ${result.FullData?.LastName || ''}`.trim(),
					dateOfBirth: result.FullData?.DateOfBirth,
					gender: result.FullData?.Gender,
					phoneNumber: result.FullData?.PhoneNumber,
					photoUrl: result.FullData?.Photo,
					confidence: confidence,
				} : undefined,
			};
		} catch (error) {
			console.error('Smile Identity BVN verification error:', error);
			return {
				success: false,
				verified: false,
				message: 'BVN verification service unavailable',
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	}

	async verifyNIN(request: KYCVerificationRequest): Promise<KYCVerificationResponse> {
		try {
			if (!this.apiKey || !this.partnerId) {
				throw new Error('Smile Identity credentials not configured');
			}

			const response = await fetch(`${this.apiUrl}/id_verification`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${this.apiKey}`,
				},
				body: JSON.stringify({
					partner_id: this.partnerId,
					source_sdk: 'rest_api',
					source_sdk_version: '1.0.0',
					country: 'NG',
					id_type: 'NIN',
					id_number: request.documentNumber,
					first_name: request.firstName,
					last_name: request.lastName,
					dob: request.dateOfBirth,
					user_id: request.userId,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				return {
					success: false,
					verified: false,
					message: 'NIN verification failed',
					error: error.message || 'Unknown error',
				};
			}

			const result = await response.json();

			const isVerified = result.ResultCode === '1012';
			const confidence = parseFloat(result.ConfidenceValue || '0');

			return {
				success: true,
				verified: isVerified && confidence >= 80,
				message: isVerified ? 'NIN verified successfully' : 'NIN verification failed',
				data: isVerified ? {
					fullName: `${result.FullData?.FirstName || ''} ${result.FullData?.LastName || ''}`.trim(),
					dateOfBirth: result.FullData?.DateOfBirth,
					gender: result.FullData?.Gender,
					phoneNumber: result.FullData?.PhoneNumber,
					address: result.FullData?.Address,
					photoUrl: result.FullData?.Photo,
					confidence: confidence,
				} : undefined,
			};
		} catch (error) {
			console.error('Smile Identity NIN verification error:', error);
			return {
				success: false,
				verified: false,
				message: 'NIN verification service unavailable',
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	}
}

/**
 * Youverify Integration (Alternative provider)
 * Docs: https://developers.youverify.co
 */
export class YouverifyProvider {
	private apiKey: string;
	private apiUrl: string;

	constructor() {
		this.apiKey = process.env.YOUVERIFY_API_KEY || '';
		this.apiUrl = 'https://api.youverify.co/v2';
	}

	async verifyBVN(request: KYCVerificationRequest): Promise<KYCVerificationResponse> {
		try {
			if (!this.apiKey) {
				throw new Error('Youverify API key not configured');
			}

			const response = await fetch(`${this.apiUrl}/identities/verifications/ng/bvn`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Token': this.apiKey,
				},
				body: JSON.stringify({
					id: request.documentNumber,
					isSubjectConsent: true,
					metadata: {
						userId: request.userId,
					},
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				return {
					success: false,
					verified: false,
					message: 'BVN verification failed',
					error: result.message || 'Unknown error',
				};
			}

			const isVerified = result.success === true && result.data?.status === 'verified';

			return {
				success: true,
				verified: isVerified,
				message: isVerified ? 'BVN verified successfully' : 'BVN verification failed',
				data: isVerified ? {
					fullName: result.data?.fullName,
					dateOfBirth: result.data?.dateOfBirth,
					gender: result.data?.gender,
					phoneNumber: result.data?.phone,
				} : undefined,
			};
		} catch (error) {
			console.error('Youverify BVN verification error:', error);
			return {
				success: false,
				verified: false,
				message: 'BVN verification service unavailable',
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	}

	async verifyNIN(request: KYCVerificationRequest): Promise<KYCVerificationResponse> {
		try {
			if (!this.apiKey) {
				throw new Error('Youverify API key not configured');
			}

			const response = await fetch(`${this.apiUrl}/identities/verifications/ng/nin`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Token': this.apiKey,
				},
				body: JSON.stringify({
					id: request.documentNumber,
					isSubjectConsent: true,
					metadata: {
						userId: request.userId,
					},
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				return {
					success: false,
					verified: false,
					message: 'NIN verification failed',
					error: result.message || 'Unknown error',
				};
			}

			const isVerified = result.success === true && result.data?.status === 'verified';

			return {
				success: true,
				verified: isVerified,
				message: isVerified ? 'NIN verified successfully' : 'NIN verification failed',
				data: isVerified ? {
					fullName: result.data?.fullName,
					dateOfBirth: result.data?.dateOfBirth,
					gender: result.data?.gender,
					phoneNumber: result.data?.phone,
					address: result.data?.address,
				} : undefined,
			};
		} catch (error) {
			console.error('Youverify NIN verification error:', error);
			return {
				success: false,
				verified: false,
				message: 'NIN verification service unavailable',
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	}
}

/**
 * Factory function to get KYC provider based on configuration
 */
export function getKYCProvider() {
	const provider = process.env.KYC_PROVIDER || 'smile_identity';

	switch (provider.toLowerCase()) {
		case 'youverify':
			return new YouverifyProvider();
		case 'smile_identity':
		default:
			return new SmileIdentityProvider();
	}
}

/**
 * Main KYC verification function
 */
export async function verifyKYC(
	request: KYCVerificationRequest
): Promise<KYCVerificationResponse> {
	const provider = getKYCProvider();

	if (request.verificationType === 'BVN') {
		return provider.verifyBVN(request);
	} else if (request.verificationType === 'NIN') {
		return provider.verifyNIN(request);
	}

	return {
		success: false,
		verified: false,
		message: 'Invalid verification type',
		error: 'Only BVN and NIN verification types are supported',
	};
}
