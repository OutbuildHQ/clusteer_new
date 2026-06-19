"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getPrivacySettings, updatePrivacySettings } from "@/lib/api/settings";

const STORAGE_KEY = "clusteer-cookie-consent";

interface CookiePrefs {
	analytics: boolean;
	marketing: boolean;
}

function loadPrefs(): CookiePrefs | null {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as CookiePrefs) : null;
	} catch {
		return null;
	}
}

function persistLocally(prefs: CookiePrefs) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
		// Let ConsentScripts react immediately (no reload) when consent changes.
		window.dispatchEvent(new CustomEvent("clusteer-consent-change", { detail: prefs }));
	} catch {
		// ignore
	}
}

/** Fire-and-forget sync to Django PrivacySettings */
async function syncToBackend(uid: string, prefs: CookiePrefs) {
	try {
		await updatePrivacySettings(uid, {
			analytical_cookies: prefs.analytics,
			marketing_cookies: prefs.marketing,
		});
	} catch {
		// non-blocking — localStorage is the source of truth
	}
}

export default function CookieConsent() {
	const [visible, setVisible] = useState(false);
	const [analytics, setAnalytics] = useState(false);
	const [marketing, setMarketing] = useState(false);
	const shouldReduceMotion = useReducedMotion();

	useEffect(() => {
		// If local pref already set, don't show — but still try to seed toggles from it
		const local = loadPrefs();
		if (local) {
			setAnalytics(local.analytics);
			setMarketing(local.marketing);
			return;
		}

		// No local pref → show banner after short delay
		const t = setTimeout(() => setVisible(true), 800);

		// Also listen for auth — if a user logs in, load their backend prefs
		// and use those instead of showing the banner again
		const unsub = auth
			? onAuthStateChanged(auth, async (user) => {
					if (!user) return;
					try {
						const serverPrefs = await getPrivacySettings(user.uid);
						const prefs: CookiePrefs = {
							analytics: serverPrefs.analytical_cookies,
							marketing: serverPrefs.marketing_cookies,
						};
						persistLocally(prefs);
						setAnalytics(prefs.analytics);
						setMarketing(prefs.marketing);
						setVisible(false); // dismiss banner — prefs loaded from server
					} catch {
						// server prefs unavailable — keep showing the banner
					}
			  })
			: () => {};

		return () => {
			clearTimeout(t);
			unsub();
		};
	}, []);

	function handleSave() {
		const prefs: CookiePrefs = { analytics, marketing };
		persistLocally(prefs);
		const uid = auth?.currentUser?.uid;
		if (uid) syncToBackend(uid, prefs);
		setVisible(false);
	}

	function handleAcceptAll() {
		const prefs: CookiePrefs = { analytics: true, marketing: true };
		setAnalytics(true);
		setMarketing(true);
		persistLocally(prefs);
		const uid = auth?.currentUser?.uid;
		if (uid) syncToBackend(uid, prefs);
		setVisible(false);
	}

	const variants = {
		hidden: { x: shouldReduceMotion ? 0 : -40, opacity: 0 },
		visible: { x: 0, opacity: 1 },
		exit: { x: shouldReduceMotion ? 0 : -40, opacity: 0 },
	};

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					key="cookie-consent"
					variants={variants}
					initial="hidden"
					animate="visible"
					exit="exit"
					transition={{ type: "spring", stiffness: 340, damping: 30 }}
					className="fixed bottom-6 left-6 z-50 w-[320px] max-w-[calc(100vw-3rem)]"
				>
					<div className="relative overflow-hidden rounded-[20px] border-2 border-custom-black bg-white shadow-[4px_4px_0px_0px_#21241D] p-5">
						{/* Faint watermark icon */}
						<div
							aria-hidden="true"
							className="pointer-events-none absolute -bottom-3 -right-3 text-light-green opacity-[0.07]"
						>
							<Cookie size={96} strokeWidth={1.2} />
						</div>

						{/* Header */}
						<div className="mb-3 flex items-center gap-2">
							<span className="flex h-7 w-7 items-center justify-center rounded-full bg-light-green border border-custom-black">
								<Cookie size={14} aria-hidden="true" className="text-custom-black" />
							</span>
							<p className="font-sora text-sm font-semibold text-custom-black leading-tight">
								Cookie preferences
							</p>
						</div>

						<p className="text-xs text-custom-black/60 leading-relaxed mb-4">
							We use cookies to improve your experience. You control what&apos;s on.
							Essential cookies are always required.{" "}
							<span className="text-custom-black/40">NDPR compliant.</span>
						</p>

						{/* Toggles */}
						<div className="space-y-3 mb-5">
							{/* Essential — always on */}
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs font-semibold text-custom-black">Essential</p>
									<p className="text-[10px] text-custom-black/50">Auth, security, core features</p>
								</div>
								<Switch
									checked
									disabled
									aria-label="Essential cookies (always on)"
									className="opacity-60 cursor-not-allowed data-[state=checked]:bg-light-green"
								/>
							</div>

							{/* Analytics */}
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs font-semibold text-custom-black">Analytics</p>
									<p className="text-[10px] text-custom-black/50">Usage patterns, performance</p>
								</div>
								<Switch
									checked={analytics}
									onCheckedChange={setAnalytics}
									aria-label="Analytics cookies"
									className="data-[state=checked]:bg-light-green border border-custom-black/20"
								/>
							</div>

							{/* Marketing */}
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs font-semibold text-custom-black">Marketing</p>
									<p className="text-[10px] text-custom-black/50">Personalised offers & ads</p>
								</div>
								<Switch
									checked={marketing}
									onCheckedChange={setMarketing}
									aria-label="Marketing cookies"
									className="data-[state=checked]:bg-light-green border border-custom-black/20"
								/>
							</div>
						</div>

						{/* Actions */}
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={handleSave}
								className="flex-1 h-8 text-xs rounded-full border-2 border-custom-black font-semibold hover:bg-warm-beige"
							>
								Save
							</Button>
							<button
								onClick={handleAcceptAll}
								className="btn-shine flex-1 h-8 text-xs rounded-full border-2 border-custom-black bg-light-green font-bold font-sora text-custom-black transition-all hover:shadow-[2px_2px_0px_0px_#21241D] active:translate-y-px"
							>
								Accept all
							</button>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
