// TEMPORARY: Disabled Supabase, returning empty transactions
// TODO: Implement with Django/Spring Boot backend
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const token = request.cookies.get("auth_token")?.value;
		if (!token) {
			return NextResponse.json(
				{ status: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		// TEMPORARY: Return empty transactions until backend is configured
		// TODO: Fetch from Django or Spring Boot backend
		const searchParams = request.nextUrl.searchParams;
		const page = parseInt(searchParams.get("page") || "1");
		const size = parseInt(searchParams.get("size") || "10");

		// Return empty transactions
		const formattedTransactions: any[] = [];
		const count = 0;
		const totalPages = 0;

		return NextResponse.json({
			status: true,
			data: formattedTransactions,
			metadata: {
				page,
				size,
				totalItems: count,
				totalPages,
			},
		});
	} catch (error) {
		console.error("Transaction fetch error:", error);
		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
