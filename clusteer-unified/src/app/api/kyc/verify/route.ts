import { supabaseAdmin } from "@/lib/supabase";
import { getSupabaseUserWithRetry } from "@/lib/supabase-helpers";
import { NextRequest, NextResponse } from "next/server";
import { verifyKYC } from "@/lib/kyc-provider";

export async function POST(request: NextRequest) {
	try {
		// Get the auth token from cookies
		const token = request.cookies.get("auth_token")?.value;

		if (!token) {
			return NextResponse.json(
				{ status: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Get user from Supabase with retry logic
		const { user: authUser, error: authError } = await getSupabaseUserWithRetry(token);

		if (authError || !authUser) {
			return NextResponse.json(
				{ status: false, message: "Invalid or expired token" },
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

		// Get user profile for additional data
		const { data: userProfile } = await supabaseAdmin
			.from("users")
			.select("*")
			.eq("id", authUser.id)
			.single();

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

		// Validate document number format
		const isValidLength = documentNumber.length === 11;
		const isAllDigits = /^\d+$/.test(documentNumber);
		const isAllSameDigit = /^(\d)\1{10}$/.test(documentNumber);

		if (!isValidLength || !isAllDigits || isAllSameDigit) {
			return NextResponse.json(
				{ status: false, message: `Invalid ${verificationType} format` },
				{ status: 400 }
			);
		}

		// Store verification request in database
		const { data: verificationRequest, error: vrError } = await supabaseAdmin
			.from("verification_requests")
			.insert({
				user_id: authUser.id,
				verification_type: verificationType,
				document_number: documentNumber,
				status: 'pending',
				submitted_data: data,
			})
			.select()
			.single();

		if (vrError) {
			console.error("Error creating verification request:", vrError);
		}

		// Call KYC provider
		console.log(`Starting ${verificationType} verification for user ${authUser.id}`);

		const verificationResult = await verifyKYC({
			userId: authUser.id,
			verificationType: verificationType as 'BVN' | 'NIN',
			documentNumber: documentNumber,
			firstName: userProfile?.first_name || data.firstName,
			lastName: userProfile?.last_name || data.lastName,
			dateOfBirth: data.dateOfBirth,
			phoneNumber: userProfile?.phone || data.phoneNumber,
		});

		console.log(`${verificationType} verification result:`, {
			success: verificationResult.success,
			verified: verificationResult.verified,
		});

		// Update verification request status
		if (verificationRequest) {
			await supabaseAdmin
				.from("verification_requests")
				.update({
					status: verificationResult.verified ? 'approved' : 'rejected',
					verification_response: verificationResult,
					updated_at: new Date().toISOString(),
				})
				.eq("id", verificationRequest.id);
		}

		// If verification successful, update user's is_verified status
		if (verificationResult.verified) {
			const { data: updatedUser, error: updateError } = await supabaseAdmin
				.from("users")
				.update({
					is_verified: true,
					first_name: verificationResult.data?.fullName?.split(' ')[0] || userProfile?.first_name,
					last_name: verificationResult.data?.fullName?.split(' ').slice(1).join(' ') || userProfile?.last_name,
					updated_at: new Date().toISOString(),
				})
				.eq("id", authUser.id)
				.select()
				.single();

			if (updateError) {
				console.error("Error updating user verification status:", updateError);
				return NextResponse.json(
					{ status: false, message: "Verification successful but failed to update profile" },
					{ status: 500 }
				);
			}

			console.log("User verification status updated successfully:", {
				userId: authUser.id,
				is_verified: updatedUser?.is_verified,
			});

			return NextResponse.json({
				status: true,
				message: "Identity verified successfully! Your account has been verified.",
				data: {
					is_verified: true,
					fullName: verificationResult.data?.fullName,
					confidence: verificationResult.data?.confidence,
				},
			});
		} else {
			// Verification failed
			return NextResponse.json({
				status: false,
				message: verificationResult.message || "Identity verification failed. Please check your details and try again.",
				data: {
					is_verified: false,
					error: verificationResult.error,
				},
			}, { status: 400 });
		}
	} catch (error) {
		console.error("KYC verification error:", error);
		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred during verification" },
			{ status: 500 }
		);
	}
}
