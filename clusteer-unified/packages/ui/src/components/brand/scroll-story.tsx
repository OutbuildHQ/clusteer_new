"use client";
/* THESIS: Approach a real working surface, then follow one conversion.
 * OWN-WORLD: A walnut waterfront workspace, forest ink, paper, restrained lime.
 * STORY: Understand the two-way offer, inspect the quote, follow the receipt.
 * FIRST VIEWPORT: Centred offer above a physical laptop on the architectural desk.
 * FORM: Extension of the approved Mercury direction. One native-scroll camera push;
 * chassis recedes as the HTML product reaches reading size. Static on small screens. */
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { ProductWalkthrough } from "./product-walkthrough";
export function ScrollStory({ product }: { product?: ReactNode } = {}) {
	const root = useRef<HTMLElement>(null);
	const focusOnArrival = useRef(false);
	const [stage, setStage] = useState(0);
	const [ready, setReady] = useState(false);
	const [initialized, setInitialized] = useState(false);
	const [arrived, setArrived] = useState(false);
	const [introVisible, setIntroVisible] = useState(true);
	const focusProduct = () => {
		root.current?.querySelector<HTMLElement>(".cl-story-device")?.focus({ preventScroll: true });
	};
	const explore = () => {
		const element = root.current;
		if (!element) return;
		const device = element.querySelector<HTMLElement>(".cl-story-device");
		const top = ready
			? window.scrollY +
				element.getBoundingClientRect().top +
				(element.offsetHeight - window.innerHeight) * 0.54
			: window.scrollY + (device?.getBoundingClientRect().top ?? 0) - 88;
		focusOnArrival.current = ready && !arrived;
		if (!focusOnArrival.current) focusProduct();
		window.scrollTo({ top, behavior: ready ? "smooth" : "auto" });
	};
	useEffect(() => {
		if (!initialized || !window.location.hash) return;
		// Restore a direct section link after the desktop scene has its final layout height.
		const target = document.getElementById(window.location.hash.slice(1));
		if (target && !root.current?.contains(target)) {
			target.scrollIntoView({ behavior: "instant", block: "start" });
		}
	}, [initialized]);
	useEffect(() => {
		if (arrived && focusOnArrival.current) {
			focusOnArrival.current = false;
			focusProduct();
		}
	}, [arrived]);
	useEffect(() => {
		const element = root.current;
		if (!element) return;
		const query = window.matchMedia(
			"(min-width: 1000px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)"
		);
		let frame = 0,
			finalScale = 1;
		const measure = () => {
			const height = element.querySelector<HTMLElement>(".cl-product-window")?.offsetHeight || 600;
			finalScale = Math.min(1, (window.innerHeight - 144) / height);
		};
		const render = () => {
			frame = 0;
			if (!query.matches) return;
			const rect = element.getBoundingClientRect();
			const p = Math.max(0, Math.min(1, -rect.top / (element.offsetHeight - window.innerHeight)));
			const approach = Math.min(1, p / 0.5);
			const ease = approach * approach * (3 - 2 * approach);
			element.style.setProperty("--scene-scale", `${1 + ease * 0.65}`);
			element.style.setProperty(
				"--scene-opacity",
				`${1 - Math.min(1, Math.max(0, (p - 0.25) / 0.3))}`
			);
			element.style.setProperty("--copy-opacity", `${Math.max(0, 1 - p / 0.18)}`);
			element.style.setProperty("--copy-y", `${-Math.min(1, p / 0.18) * 85}px`);
			element.style.setProperty("--window-scale", `${0.48 + ease * (finalScale - 0.48)}`);
			element.style.setProperty(
				"--window-y",
				`${(window.innerHeight * 0.27 - 12) * (1 - ease) + 12}px`
			);
			element.style.setProperty(
				"--caption-opacity",
				`${Math.min(1, Math.max(0, (p - 0.4) / 0.12))}`
			);
			element.style.setProperty(
				"--chassis-opacity",
				`${1 - Math.min(1, Math.max(0, (p - 0.3) / 0.2))}`
			);
			element.style.setProperty("--device-tilt", `${-5 * (1 - ease)}deg`);
			const introIsVisible = p < 0.18;
			const productIsReady = p >= 0.5;
			// Move focus to the named scene before its current subtree becomes inert.
			// This covers both downward and reverse scrolling without moving the page.
			const intro = element.querySelector(".cl-story-intro");
			const device = element.querySelector(".cl-story-device");
			if (
				(!introIsVisible && intro?.contains(document.activeElement)) ||
				(!productIsReady &&
					(device?.contains(document.activeElement) ||
						element.querySelector(".cl-story-caption")?.contains(document.activeElement)))
			) {
				element.focus({ preventScroll: true });
			}
			setIntroVisible(introIsVisible);
			setArrived(productIsReady);
		};
		const tick = () => {
			if (!frame) frame = requestAnimationFrame(render);
		};
		const change = () => {
			measure();
			setReady(query.matches);
			setArrived(!query.matches);
			setIntroVisible(true);
			if (!query.matches) {
				[
					"--scene-scale",
					"--scene-opacity",
					"--copy-opacity",
					"--copy-y",
					"--window-scale",
					"--window-y",
					"--caption-opacity",
					"--chassis-opacity",
					"--device-tilt",
				].forEach((property) => element.style.removeProperty(property));
			}
			tick();
		};
		change();
		setInitialized(true);
		query.addEventListener("change", change);
		window.addEventListener("scroll", tick, { passive: true });
		window.addEventListener("resize", change);
		const observer = new ResizeObserver(() => {
			measure();
			tick();
		});
		const product = element.querySelector(".cl-product-window");
		if (product) observer.observe(product);
		return () => {
			cancelAnimationFrame(frame);
			query.removeEventListener("change", change);
			window.removeEventListener("scroll", tick);
			window.removeEventListener("resize", change);
			observer.disconnect();
		};
	}, []);
	return (
		<section
			ref={root}
			tabIndex={-1}
			className={`cl-scroll-story ${ready ? "has-scroll-motion" : ""} ${arrived ? "is-arrived" : ""}`}
			aria-label="Explore a conversion at your own pace"
		>
			<div className="cl-story-sticky">
				<div className="cl-scene">
					<Image src="/images/clusteer-workspace.webp" alt="" fill priority sizes="100vw" />
					<div className="cl-scene-shade" />
				</div>
				<div className="cl-story-intro" inert={ready && !introVisible ? true : undefined}>
					<span className="cl-launch">
						<span />
						For Nigeria · Early access
					</span>
					<h1>
						Stablecoins to naira.
						<br />
						And back again.
					</h1>
					<p>
						Sell stablecoins for naira in your bank account.
						<br />
						Or buy with naira for your own wallet.
					</p>
					<div className="cl-hero-actions">
						<Link className="cl-button" href="/early-access">
							Join the waitlist <ArrowRight size={16} />
						</Link>
						<button type="button" className="cl-button cl-button-ghost" onClick={explore}>
							Explore dashboard
						</button>
					</div>
				</div>
				<div className="cl-story-caption" inert={ready && !arrived ? true : undefined}>
					<span>
						{
							[
								product ? "Your conversions, all in view." : "Try an amount. Explore at your pace.",
								"Every step, accounted for.",
								"A record of where it all went.",
							][stage]
						}
					</span>
					<button type="button" onClick={explore}>
						Explore dashboard <ArrowRight size={14} />
					</button>
				</div>
				<div
					className="cl-story-device"
					tabIndex={-1}
					role="region"
					aria-label="Interactive Clusteer dashboard"
					inert={ready && !arrived ? true : undefined}
				>
					<div className="cl-device-screen">
						{product ?? <ProductWalkthrough stage={stage} onStageChange={setStage} compact />}
					</div>
					<div className="cl-device-base" aria-hidden="true">
						<div className="cl-device-keyboard">
							{Array.from({ length: 42 }, (_, i) => (
								<i key={i} />
							))}
						</div>
						<span />
					</div>
				</div>
				<div className="cl-story-bottom">
					<a href="#how">
						Skip to overview <ArrowDown size={13} />
					</a>
				</div>
			</div>
		</section>
	);
}
