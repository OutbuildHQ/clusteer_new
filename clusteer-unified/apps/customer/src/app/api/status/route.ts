import { NextResponse } from "next/server";
import { getSystemStatus } from "@/lib/system-status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Public system-status endpoint. Returns live reachability of each service.
 * Consumed by the /status page and usable by external uptime monitors.
 */
export async function GET() {
	const status = await getSystemStatus();
	return NextResponse.json(status, {
		headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=60" },
	});
}
