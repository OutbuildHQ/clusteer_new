"use client";

import { useQuery } from "@tanstack/react-query";

/**
 * The current user's ID, derived server-side.
 *
 * auth_token is httpOnly (by design, for XSS protection) — client JS can never
 * read it via document.cookie. /api/user/profile already decodes it server-side
 * (see getAuthFromRequest in api-helpers.ts) and returns { data: { id, ... } },
 * so we fetch that instead of trying to parse a cookie we can't see.
 */
export function useUserId(): string | null {
	const { data } = useQuery({
		queryKey: ["current-user-id"],
		queryFn: async () => {
			const res = await fetch("/api/user/profile");
			if (!res.ok) return null;
			const json = await res.json();
			return json?.data?.id ?? null;
		},
		staleTime: 5 * 60 * 1000,
		retry: false,
	});
	return data ?? null;
}
