/**
 * Admin Fees proxy route
 * GET  /api/admin/fees — merges Spring Boot /v1/system/transaction-fee + /v1/system/parameters
 * PUT  /api/admin/fees — updates a fee rule via Spring Boot
 */

import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";

const SPRING_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// NextRequest's own cookie store matches by exact name — safe by
// construction, unlike a hand-rolled regex over the raw header (which a
// differently-named cookie sharing "admin_token" as a suffix could collide
// with; see docs/RELEASE_READINESS_REMEDIATION.md's auth-bridge finding for
// the real instance of this bug class elsewhere in the app).
function getAdminToken(request: NextRequest): string {
  return request.cookies.get("admin_token")?.value ?? "";
}

export async function GET(request: NextRequest) {
  const adminOrError = await requirePermission("settings.read");
  if (adminOrError instanceof Response) {
    return adminOrError;
  }

  try {
    const token = getAdminToken(request);
    const authHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const [feeRes, paramsRes] = await Promise.allSettled([
      fetch(`${SPRING_BASE}/v1/system/transaction-fee`, { headers: authHeaders }),
      fetch(`${SPRING_BASE}/v1/system/parameters`, { headers: authHeaders }),
    ]);

    const feeData =
      feeRes.status === "fulfilled" && feeRes.value.ok
        ? await feeRes.value.json().catch(() => null)
        : null;

    const paramsData =
      paramsRes.status === "fulfilled" && paramsRes.value.ok
        ? await paramsRes.value.json().catch(() => null)
        : null;

    return NextResponse.json({
      status: true,
      fees: feeData?.data ?? feeData ?? null,
      parameters: paramsData?.data ?? paramsData ?? null,
    });
  } catch (error: any) {
    console.error("Admin fees fetch error:", error);
    return NextResponse.json(
      { status: false, message: "Failed to fetch fee configuration" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const adminOrError = await requirePermission("settings.write");
  if (adminOrError instanceof Response) {
    return adminOrError;
  }

  try {
    const token = getAdminToken(request);
    const body = await request.json();

    const res = await fetch(`${SPRING_BASE}/v1/system/transaction-fee`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      return NextResponse.json(
        { status: false, message: errBody.message || "Failed to update fee" },
        { status: res.status }
      );
    }

    const data = await res.json().catch(() => ({ status: true }));
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Admin fees update error:", error);
    return NextResponse.json(
      { status: false, message: "Failed to update fee configuration" },
      { status: 500 }
    );
  }
}
