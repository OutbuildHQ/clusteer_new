"use client";

import { useMemo } from "react";

/**
 * Extract the Firebase user ID from the auth_token cookie.
 * The middleware already verified the JWT — we just decode the payload.
 */
export function useUserId(): string | null {
	return useMemo(() => {
		if (typeof window === "undefined") return null;
		const match = document.cookie.match(/auth_token=([^;]+)/);
		if (!match) return null;
		try {
			const payload = JSON.parse(atob(match[1].split(".")[1]));
			return payload.user_id || payload.sub || null;
		} catch {
			return null;
		}
	}, []);
}
