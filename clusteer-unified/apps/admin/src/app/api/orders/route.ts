/**
 * Admin Orders proxy route
 * GET /api/admin/orders — proxies to Spring Boot GET /v1/order/all
 */

import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";

const SPRING_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function GET(request: NextRequest) {
  const adminOrError = await requirePermission("orders.read");
  if (adminOrError instanceof Response) {
    return adminOrError;
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const size = searchParams.get("size") || "20";
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const params = new URLSearchParams({ page, size });
    if (search) params.set("search", search);
    if (status) params.set("status", status);

    const springUrl = `${SPRING_BASE}/v1/order/all?${params.toString()}`;

    // NextRequest's own cookie store matches by exact name — safe by
    // construction, unlike a hand-rolled regex over the raw header.
    const token = request.cookies.get("admin_token")?.value ?? "";

    const res = await fetch(springUrl, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json({
          status: true,
          data: [],
          metadata: { page: Number(page), size: Number(size), total: 0, totalPages: 0 },
        });
      }
      const errBody = await res.json().catch(() => ({}));
      return NextResponse.json(
        { status: false, message: errBody.message || "Failed to fetch orders from backend" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Admin orders fetch error:", error);

    if (error.cause?.code === "ECONNREFUSED" || error.cause?.code === "ETIMEDOUT") {
      return NextResponse.json(
        { status: false, message: "Backend service temporarily unavailable" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { status: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
