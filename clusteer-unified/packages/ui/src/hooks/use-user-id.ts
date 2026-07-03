"use client";

import { useQuery } from "@tanstack/react-query";

interface UserProfile {
	id: string;
	email: string;
	username: string;
	firstName: string;
	lastName: string;
	[key: string]: unknown;
}

/**
 * The current user's profile, derived server-side.
 *
 * auth_token is httpOnly (by design, for XSS protection) — client JS can never
 * read it via document.cookie. /api/user/profile already decodes it server-side
 * (see getAuthFromRequest in api-helpers.ts) and returns { data: {...} }, so we
 * fetch that instead of trying to parse a cookie we can't see.
 */
function useUserProfileQuery() {
	return useQuery({
		queryKey: ["current-user-profile"],
		queryFn: async (): Promise<UserProfile | null> => {
			const res = await fetch("/api/user/profile");
			if (!res.ok) return null;
			const json = await res.json();
			return json?.data ?? null;
		},
		staleTime: 5 * 60 * 1000,
		retry: false,
	});
}

export function useUserId(): string | null {
	const { data } = useUserProfileQuery();
	return data?.id ?? null;
}

export function useUserProfile(): UserProfile | null {
	const { data } = useUserProfileQuery();
	return data ?? null;
}
