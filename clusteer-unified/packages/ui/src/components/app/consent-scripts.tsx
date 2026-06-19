"use client";

import { useEffect } from "react";

/**
 * Loads analytics / marketing scripts ONLY after the matching cookie consent
 * is granted (read from the same `clusteer-cookie-consent` localStorage key the
 * CookieConsent banner writes). Reacts live to the `clusteer-consent-change`
 * event so opting in takes effect without a reload.
 *
 * Nothing loads unless the relevant env var is set:
 *   - NEXT_PUBLIC_GA_ID        → Google Analytics (analytics consent)
 *   - NEXT_PUBLIC_META_PIXEL_ID → Meta Pixel       (marketing consent)
 */

const STORAGE_KEY = "clusteer-cookie-consent";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

type Prefs = { analytics: boolean; marketing: boolean };

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
	interface Window {
		dataLayer?: any[];
		gtag?: (...args: any[]) => void;
		fbq?: any;
		_fbq?: any;
	}
	interface WindowEventMap {
		"clusteer-consent-change": CustomEvent<Prefs>;
	}
}

let gaLoaded = false;
let metaLoaded = false;

function readPrefs(): Prefs {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as Prefs) : { analytics: false, marketing: false };
	} catch {
		return { analytics: false, marketing: false };
	}
}

function loadGA() {
	if (gaLoaded || !GA_ID) return;
	gaLoaded = true;
	const s = document.createElement("script");
	s.async = true;
	s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
	document.head.appendChild(s);
	window.dataLayer = window.dataLayer || [];
	window.gtag = function gtag() {
		// eslint-disable-next-line prefer-rest-params
		window.dataLayer!.push(arguments);
	};
	window.gtag("js", new Date());
	window.gtag("config", GA_ID, { anonymize_ip: true });
}

function loadMeta() {
	if (metaLoaded || !META_PIXEL_ID || window.fbq) return;
	metaLoaded = true;
	const n: any = (window.fbq = function () {
		// eslint-disable-next-line prefer-rest-params
		n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
	});
	if (!window._fbq) window._fbq = n;
	n.push = n;
	n.loaded = true;
	n.version = "2.0";
	n.queue = [];
	const s = document.createElement("script");
	s.async = true;
	s.src = "https://connect.facebook.net/en_US/fbevents.js";
	document.head.appendChild(s);
	window.fbq("init", META_PIXEL_ID);
	window.fbq("track", "PageView");
}

function apply(prefs: Prefs) {
	if (prefs.analytics) loadGA();
	if (prefs.marketing) loadMeta();
}

export function ConsentScripts() {
	useEffect(() => {
		apply(readPrefs());
		const onChange = (e: Event) => {
			const detail = (e as CustomEvent<Prefs>).detail;
			apply(detail ?? readPrefs());
		};
		window.addEventListener("clusteer-consent-change", onChange);
		return () => window.removeEventListener("clusteer-consent-change", onChange);
	}, []);
	return null;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
