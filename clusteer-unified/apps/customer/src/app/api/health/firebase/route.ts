import { NextResponse } from "next/server";
import { isFirebaseConfigured } from "@/lib/firebase";

export async function GET() {
  return NextResponse.json({
    firebaseConfigured: isFirebaseConfigured,
    environment: process.env.NODE_ENV,
    hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    apiKeyPrefix: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10) + "...",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}
