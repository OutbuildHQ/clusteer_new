import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    version: "2.0.0-firebase",
    timestamp: new Date().toISOString(),
    authEndpoint: "/api/auth-firebase",
    deployment: "production",
    commit: "71aba01",
  });
}
