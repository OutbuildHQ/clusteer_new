/**
 * Firebase Cloud Messaging (FCM) push notification service.
 *
 * Server-side only — use in Next.js API routes.
 *
 * Setup:
 *   1. Enable Cloud Messaging in Firebase Console
 *   2. Set FIREBASE_PROJECT_ID in .env.local
 *   3. Set FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY for service account
 *
 * Client-side:
 *   Register service worker and get FCM token, then POST to /api/user/fcm/update
 */

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "";

interface PushPayload {
	token: string;
	title: string;
	body: string;
	data?: Record<string, string>;
	icon?: string;
}

/**
 * Send a push notification via FCM HTTP v1 API.
 * Requires a valid OAuth2 access token (from service account).
 *
 * For MVP: this is a stub that logs the payload.
 * Wire to real FCM when service account is configured.
 */
export async function sendPushNotification({ token, title, body, data, icon }: PushPayload): Promise<boolean> {
	if (!PROJECT_ID) {
		console.warn("[fcm] Firebase project ID not configured, skipping push");
		return false;
	}

	// TODO: Implement OAuth2 token exchange using service account credentials
	// For now, log the notification for development
	console.log("[fcm] Push notification (stub):", { token: token.slice(0, 20) + "...", title, body, data });

	// When ready, uncomment and implement:
	// const accessToken = await getServiceAccountToken();
	// const res = await fetch(`https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`, {
	//   method: "POST",
	//   headers: {
	//     Authorization: `Bearer ${accessToken}`,
	//     "Content-Type": "application/json",
	//   },
	//   body: JSON.stringify({
	//     message: {
	//       token,
	//       notification: { title, body },
	//       data,
	//       webpush: {
	//         notification: { icon: icon || "/assets/icons/clusteer_logo.svg" },
	//       },
	//     },
	//   }),
	// });
	// return res.ok;

	return true;
}

// ── Pre-built notification templates ──

export async function notifyDepositReceived(fcmToken: string, amount: string, chain: string) {
	return sendPushNotification({
		token: fcmToken,
		title: "Deposit received!",
		body: `${amount} USDT received on ${chain}`,
		data: { type: "deposit", chain },
	});
}

export async function notifyTradeFilled(fcmToken: string, side: string, amount: string) {
	return sendPushNotification({
		token: fcmToken,
		title: `${side === "buy" ? "Buy" : "Sell"} order filled`,
		body: `${amount} USDT ${side === "buy" ? "purchased" : "sold"} successfully`,
		data: { type: "trade", side },
	});
}

export async function notifyWithdrawalComplete(fcmToken: string, amount: string) {
	return sendPushNotification({
		token: fcmToken,
		title: "Withdrawal complete",
		body: `₦${amount} has been sent to your bank account`,
		data: { type: "withdrawal" },
	});
}

export async function notifySecurityAlert(fcmToken: string, action: string) {
	return sendPushNotification({
		token: fcmToken,
		title: "Security alert",
		body: action,
		data: { type: "security" },
	});
}
