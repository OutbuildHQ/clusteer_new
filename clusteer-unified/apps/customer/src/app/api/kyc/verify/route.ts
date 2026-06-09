import { NextRequest, NextResponse } from "next/server";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limiter";

// Enhanced BVN/NIN validation
function validateDocumentNumber(documentNumber: string, type: string): { valid: boolean; message?: string } {
	// Length check
	if (documentNumber.length !== 11) {
		return { valid: false, message: `${type} must be exactly 11 digits` };
	}

	// Digits only
	if (!/^\d+$/.test(documentNumber)) {
		return { valid: false, message: `${type} must contain only digits` };
	}

	// Not all same digit (e.g., 11111111111)
	if (/^(\d)\1{10}$/.test(documentNumber)) {
		return { valid: false, message: `Invalid ${type} format` };
	}

	// Not sequential (e.g., 12345678901)
	const isSequential = documentNumber.split('').every((char, i, arr) => {
		if (i === 0) return true;
		return parseInt(char) === parseInt(arr[i - 1]) + 1;
	});

	if (isSequential) {
		return { valid: false, message: `Invalid ${type} format` };
	}

	return { valid: true };
}

export async function POST(request: NextRequest) {
	// Rate limit: 3 KYC submissions per 24 hours per IP
	const rateLimitRes = rateLimit(request, RateLimitPresets.strict);
	if (rateLimitRes) return rateLimitRes;

	try {
		// Get the auth token from cookies (already verified by middleware)
		const token = request.cookies.get("auth_token")?.value;

		if (!token) {
			return NextResponse.json(
				{ status: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Decode Firebase JWT to get user ID
		const parts = token.split('.');
		if (parts.length !== 3) {
			return NextResponse.json(
				{ status: false, message: "Invalid token format" },
				{ status: 401 }
			);
		}

		let userId: string;
		let userEmail: string;
		try {
			const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
			userId = payload.user_id || payload.sub;
			userEmail = payload.email || '';
		} catch (error) {
			console.error("Failed to decode token payload:", error);
			return NextResponse.json(
				{ status: false, message: "Invalid token" },
				{ status: 401 }
			);
		}

		const body = await request.json();
		const { verificationType, data } = body;

		// Validate input
		if (!verificationType || !data) {
			return NextResponse.json(
				{ status: false, message: "Verification type and data are required" },
				{ status: 400 }
			);
		}

		// Validate verification type
		if (!['BVN', 'NIN'].includes(verificationType)) {
			return NextResponse.json(
				{ status: false, message: "Invalid verification type. Must be BVN or NIN" },
				{ status: 400 }
			);
		}

		// Prepare verification request
		let documentNumber: string;
		if (verificationType === 'BVN') {
			documentNumber = data.bvn || data.documentNumber;
		} else {
			documentNumber = data.nin || data.documentNumber;
		}

		if (!documentNumber) {
			return NextResponse.json(
				{ status: false, message: `${verificationType} number is required` },
				{ status: 400 }
			);
		}

		// Enhanced document number validation
		const validationResult = validateDocumentNumber(documentNumber, verificationType);
		if (!validationResult.valid) {
			return NextResponse.json(
				{ status: false, message: validationResult.message },
				{ status: 400 }
			);
		}

		// Get Django backend configuration
		const djangoUrl = process.env.BLOCKCHAIN_ENGINE_URL || "http://localhost:8000";
		const djangoApiKey = process.env.BLOCKCHAIN_ENGINE_API_KEY;

		if (!djangoApiKey) {
			console.error("BLOCKCHAIN_ENGINE_API_KEY not configured");
			return NextResponse.json(
				{ status: false, message: "Backend not configured" },
				{ status: 500 }
			);
		}

		// Check for duplicate document number in Django
		try {
			const duplicateCheckResponse = await fetch(
				`${djangoUrl}/api/v1/user/${userId}/check-duplicate-document/`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-API-KEY": djangoApiKey,
					},
					body: JSON.stringify({
						document_number: documentNumber,
						verification_type: verificationType,
					}),
				}
			);

			if (duplicateCheckResponse.ok) {
				const duplicateData = await duplicateCheckResponse.json();
				if (duplicateData.exists) {
					return NextResponse.json(
						{
							status: false,
							message: `This ${verificationType} is already registered to another account`,
						},
						{ status: 409 }
					);
				}
			}
		} catch {
			// Continue with verification even if duplicate check fails
		}

		// Fetch user profile to get name/DOB for provider cross-reference
		let firstName = data.firstName || "";
		let lastName = data.lastName || "";
		let dateOfBirth = data.dateOfBirth || "";
		let phoneNumber = data.phoneNumber || "";
		try {
			const profileRes = await fetch(
				`${djangoUrl}/api/v1/user/${userId}/profile/`,
				{ headers: { "Content-Type": "application/json", "X-API-KEY": djangoApiKey } }
			);
			if (profileRes.ok) {
				const profileData = await profileRes.json();
				const profile = profileData.data || profileData;
				firstName = firstName || profile.first_name || profile.firstName || "";
				lastName = lastName || profile.last_name || profile.lastName || "";
				dateOfBirth = dateOfBirth || profile.date_of_birth || profile.dateOfBirth || "";
				phoneNumber = phoneNumber || profile.phone || profile.phone_number || "";
			}
		} catch {
			// Profile fetch failed — proceed with whatever we have
		}

		// Submit KYC verification to Django backend
		try {
			const kycResponse = await fetch(
				`${djangoUrl}/api/v1/user/${userId}/kyc-verification/`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-API-KEY": djangoApiKey,
					},
					body: JSON.stringify({
						verification_type: verificationType,
						document_number: documentNumber,
						first_name: firstName,
						last_name: lastName,
						date_of_birth: dateOfBirth,
						phone_number: phoneNumber,
						email: userEmail,
					}),
				}
			);

			if (!kycResponse.ok) {
				const errorData = await kycResponse.json();
				console.error("Django KYC verification error:", errorData);

				return NextResponse.json(
					{
						status: false,
						message: errorData.message || "Verification request failed",
					},
					{ status: kycResponse.status }
				);
			}

			const kycResult = await kycResponse.json();

			return NextResponse.json({
				status: kycResult.status,
				message: kycResult.message,
				data: kycResult.data,
			});
		} catch (error) {
			console.error("Django backend connection error:", error);
			return NextResponse.json(
				{
					status: false,
					message: "Unable to connect to verification service. Please try again later.",
				},
				{ status: 503 }
			);
		}
	} catch (error) {
		console.error("KYC verification error:", error);
		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred during verification" },
			{ status: 500 }
		);
	}
}
