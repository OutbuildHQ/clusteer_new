import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface RetryOptions {
	maxRetries?: number;
	initialDelay?: number;
	maxDelay?: number;
}

interface AuthResult {
	user: User | null;
	error: Error | null;
	isNetworkError: boolean;
}

/**
 * Sleep for a specified number of milliseconds
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Check if an error is a network error
 */
function isNetworkError(error: any): boolean {
	if (!error) return false;

	const errorMessage = error.message?.toLowerCase() || '';
	const errorCode = error.code?.toLowerCase() || '';

	return (
		errorCode === 'enotfound' ||
		errorCode === 'econnrefused' ||
		errorCode === 'etimedout' ||
		errorMessage.includes('fetch failed') ||
		errorMessage.includes('network') ||
		errorMessage.includes('enotfound') ||
		errorMessage.includes('getaddrinfo')
	);
}

/**
 * Get user from Supabase with retry logic for network errors
 */
export async function getSupabaseUserWithRetry(
	token: string,
	options: RetryOptions = {}
): Promise<AuthResult> {
	const {
		maxRetries = 3,
		initialDelay = 1000,
		maxDelay = 4000
	} = options;

	let lastError: Error | null = null;
	let delay = initialDelay;

	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			const { data: { user }, error } = await supabase.auth.getUser(token);

			if (error) {
				// Check if it's a network error
				if (isNetworkError(error)) {
					lastError = error;

					// Don't retry on last attempt
					if (attempt < maxRetries) {
						console.log(`Network error on attempt ${attempt + 1}/${maxRetries + 1}, retrying in ${delay}ms...`);
						await sleep(delay);
						delay = Math.min(delay * 2, maxDelay); // Exponential backoff
						continue;
					}

					return {
						user: null,
						error: new Error(`Service temporarily unavailable after ${maxRetries + 1} attempts`),
						isNetworkError: true
					};
				}

				// Not a network error (likely auth error), return immediately
				return {
					user: null,
					error,
					isNetworkError: false
				};
			}

			// Success
			return {
				user,
				error: null,
				isNetworkError: false
			};

		} catch (error: any) {
			lastError = error;

			// Check if it's a network error
			if (isNetworkError(error)) {
				// Don't retry on last attempt
				if (attempt < maxRetries) {
					console.log(`Network error on attempt ${attempt + 1}/${maxRetries + 1}, retrying in ${delay}ms...`);
					await sleep(delay);
					delay = Math.min(delay * 2, maxDelay); // Exponential backoff
					continue;
				}
			}

			// Either not a network error or out of retries
			return {
				user: null,
				error: lastError,
				isNetworkError: isNetworkError(error)
			};
		}
	}

	// Should never reach here, but just in case
	return {
		user: null,
		error: lastError || new Error('Unknown error'),
		isNetworkError: lastError ? isNetworkError(lastError) : false
	};
}
