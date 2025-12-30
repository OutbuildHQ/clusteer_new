import { NextRequest, NextResponse } from "next/server";

// Allowed MIME types for document uploads
const ALLOWED_MIME_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
	'application/pdf',
];

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Maximum total upload size per request: 15MB (for 3 documents)
const MAX_TOTAL_SIZE = 15 * 1024 * 1024;

// Validate file type by checking magic bytes (file signature)
function validateFileSignature(buffer: Buffer, mimeType: string): boolean {
	const signatures: Record<string, number[][]> = {
		'image/jpeg': [[0xFF, 0xD8, 0xFF]],
		'image/jpg': [[0xFF, 0xD8, 0xFF]],
		'image/png': [[0x89, 0x50, 0x4E, 0x47]],
		'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF header
		'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
	};

	const allowedSignatures = signatures[mimeType];
	if (!allowedSignatures) return false;

	return allowedSignatures.some(signature =>
		signature.every((byte, index) => buffer[index] === byte)
	);
}

export async function POST(request: NextRequest) {
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
		try {
			const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
			userId = payload.user_id || payload.sub;
		} catch (error) {
			console.error("Failed to decode token payload:", error);
			return NextResponse.json(
				{ status: false, message: "Invalid token" },
				{ status: 401 }
			);
		}

		// Parse multipart form data
		const formData = await request.formData();

		const documentType = formData.get('documentType') as string;
		const documentFront = formData.get('documentFront') as File | null;
		const documentBack = formData.get('documentBack') as File | null;
		const selfie = formData.get('selfie') as File | null;

		// Validate document type
		if (!documentType || !['id_card', 'passport', 'drivers_license'].includes(documentType)) {
			return NextResponse.json(
				{ status: false, message: "Invalid document type" },
				{ status: 400 }
			);
		}

		// Validate at least one file is provided
		if (!documentFront && !selfie) {
			return NextResponse.json(
				{ status: false, message: "At least one document is required" },
				{ status: 400 }
			);
		}

		const files = [
			{ file: documentFront, name: 'documentFront' },
			{ file: documentBack, name: 'documentBack' },
			{ file: selfie, name: 'selfie' },
		].filter(f => f.file !== null) as { file: File; name: string }[];

		// Calculate total size
		const totalSize = files.reduce((sum, { file }) => sum + file.size, 0);
		if (totalSize > MAX_TOTAL_SIZE) {
			return NextResponse.json(
				{
					status: false,
					message: `Total upload size exceeds ${MAX_TOTAL_SIZE / (1024 * 1024)}MB limit`,
				},
				{ status: 400 }
			);
		}

		// Validate each file
		const validatedFiles: Array<{ name: string; buffer: Buffer; mimeType: string }> = [];

		for (const { file, name } of files) {
			// Check file size
			if (file.size > MAX_FILE_SIZE) {
				return NextResponse.json(
					{
						status: false,
						message: `File ${name} exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`,
					},
					{ status: 400 }
				);
			}

			// Check MIME type
			if (!ALLOWED_MIME_TYPES.includes(file.type)) {
				return NextResponse.json(
					{
						status: false,
						message: `File ${name} has unsupported format. Allowed: JPEG, PNG, WebP, PDF`,
					},
					{ status: 400 }
				);
			}

			// Read file buffer
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			// Validate file signature (magic bytes)
			if (!validateFileSignature(buffer, file.type)) {
				return NextResponse.json(
					{
						status: false,
						message: `File ${name} appears to be corrupted or has incorrect format`,
					},
					{ status: 400 }
				);
			}

			// Basic malware check: look for suspicious patterns
			// In production, use ClamAV or similar
			const suspiciousPatterns = [
				Buffer.from('eval(', 'utf-8'),
				Buffer.from('<script', 'utf-8'),
				Buffer.from('<?php', 'utf-8'),
				Buffer.from('#!/bin/', 'utf-8'),
			];

			for (const pattern of suspiciousPatterns) {
				if (buffer.includes(pattern)) {
					console.warn(`Suspicious content detected in file ${name} from user ${userId}`);
					return NextResponse.json(
						{
							status: false,
							message: `File ${name} contains suspicious content`,
						},
						{ status: 400 }
					);
				}
			}

			validatedFiles.push({ name, buffer, mimeType: file.type });
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

		// Upload files to Django backend
		try {
			const uploadFormData = new FormData();
			uploadFormData.append('document_type', documentType);

			for (const { name, buffer, mimeType } of validatedFiles) {
				const blob = new Blob([buffer], { type: mimeType });
				const extension = mimeType.split('/')[1];
				const filename = `${name}_${Date.now()}.${extension}`;
				uploadFormData.append(name, blob, filename);
			}

			const uploadResponse = await fetch(
				`${djangoUrl}/api/v1/user/${userId}/upload-kyc-documents/`,
				{
					method: "POST",
					headers: {
						"X-API-KEY": djangoApiKey,
					},
					body: uploadFormData,
				}
			);

			if (!uploadResponse.ok) {
				const errorData = await uploadResponse.json();
				console.error("Django upload error:", errorData);

				return NextResponse.json(
					{
						status: false,
						message: errorData.message || "Document upload failed",
					},
					{ status: uploadResponse.status }
				);
			}

			const uploadResult = await uploadResponse.json();

			console.log(`Documents uploaded successfully for user ${userId}`);

			return NextResponse.json({
				status: true,
				message: "Documents uploaded successfully",
				data: uploadResult.data,
			});
		} catch (error) {
			console.error("Django backend connection error:", error);
			return NextResponse.json(
				{
					status: false,
					message: "Unable to connect to upload service. Please try again later.",
				},
				{ status: 503 }
			);
		}
	} catch (error) {
		console.error("Document upload error:", error);
		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred during upload" },
			{ status: 500 }
		);
	}
}
