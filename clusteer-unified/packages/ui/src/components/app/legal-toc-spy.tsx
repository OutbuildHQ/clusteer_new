"use client";

import { useEffect } from "react";

/**
 * Scroll-spy for the legal-page TOC.
 * Highlights the `.toc-link` whose target `.lg-sec[id]` is currently in view,
 * updating live as the reader scrolls (and on click, via the resulting scroll).
 */
export function LegalTocSpy() {
	useEffect(() => {
		const links = Array.from(
			document.querySelectorAll<HTMLAnchorElement>(".toc-link"),
		);
		const sections = Array.from(
			document.querySelectorAll<HTMLElement>(".lg-sec[id]"),
		);
		if (!links.length || !sections.length) return;

		const map = new Map<string, HTMLAnchorElement>();
		links.forEach((l) => {
			const href = l.getAttribute("href") || "";
			if (href.startsWith("#")) map.set(href.slice(1), l);
		});

		const setActive = (id: string) => {
			links.forEach((l) => l.classList.remove("active"));
			map.get(id)?.classList.add("active");
		};

		let raf = 0;
		const onScroll = () => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(() => {
				let current = sections[0].id;
				for (const s of sections) {
					if (s.getBoundingClientRect().top <= 120) current = s.id;
					else break;
				}
				setActive(current);
			});
		};

		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", onScroll);
			cancelAnimationFrame(raf);
		};
	}, []);

	return null;
}
