/**
 * Legacy Supabase helpers — deprecated.
 * Supabase has been replaced by Firebase Auth + Django backend.
 * This stub exists only to prevent import errors from old components.
 */

interface AuthResult {
	user: null;
	error: Error;
	isNetworkError: boolean;
}

export async function getSupabaseUserWithRetry(): Promise<AuthResult> {
	return {
		user: null,
		error: new Error("Supabase has been removed. Use Firebase Auth instead."),
		isNetworkError: false,
	};
}
