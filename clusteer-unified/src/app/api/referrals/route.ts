/**
 * Referrals proxy route — stub
 * GET /api/referrals — returns null so the page falls back to mock data gracefully
 * When Spring Boot exposes a referrals endpoint, wire it here.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  const auth = getAuthFromRequest(request);
  if (!auth) {
    return NextResponse.json(
      { status: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  // Stub: no live Spring Boot endpoint wired yet.
  // The page falls back to mock data when data is null.
  return NextResponse.json({ status: true, data: null });
}
