"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	baseX: number;
	baseY: number;
	radius: number;
	opacity: number;
}

interface ParticleFieldProps {
	className?: string;
	/** Number of particles — auto-reduced on mobile */
	count?: number;
	/** Dot color in CSS format. Defaults to brand palette via getComputedStyle */
	color?: string;
	/** Line connection max distance (px) */
	connectionDistance?: number;
	/** Mouse interaction radius (px) */
	interactionRadius?: number;
	/** Whether dots attract to cursor (true) or repel (false) */
	attract?: boolean;
	/** Parallax scroll multiplier (0 = none, 0.3 = subtle) */
	parallax?: number;
	/** Variant: 'default' uses brand color, 'light' uses white (for dark backgrounds) */
	variant?: "default" | "light";
	/** Whether mouse/touch interaction is enabled */
	interactive?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ParticleField({
	className,
	count = 90,
	connectionDistance = 120,
	interactionRadius = 180,
	attract = true,
	parallax = 0.3,
	variant = "default",
	interactive = true,
}: ParticleFieldProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const particles = useRef<Particle[]>([]);
	const mouse = useRef({ x: -9999, y: -9999, active: false });
	const scrollOffset = useRef(0);
	const rafId = useRef<number>(0);
	const resizeObserver = useRef<ResizeObserver | null>(null);

	/* ---- resolve color from CSS vars ---- */
	const getColor = useCallback(() => {
		if (variant === "light") return { r: 255, g: 255, b: 255 };
		// Try to read brand-300 from computed styles
		try {
			const root = document.documentElement;
			const style = getComputedStyle(root);
			// oklch isn't directly parseable to RGB, so use a fallback
			// Brand blue ~= hsl(224, 76%, 48%) → rgb(41, 98, 204)
			return { r: 41, g: 98, b: 204 };
		} catch {
			return { r: 41, g: 98, b: 204 };
		}
	}, [variant]);

	/* ---- init particles ---- */
	const initParticles = useCallback((width: number, height: number) => {
		const isMobile = width < 768;
		const n = isMobile ? Math.min(count, 50) : count;
		const arr: Particle[] = [];
		for (let i = 0; i < n; i++) {
			const x = Math.random() * width;
			const y = Math.random() * height;
			arr.push({
				x,
				y,
				baseX: x,
				baseY: y,
				vx: (Math.random() - 0.5) * 0.3,
				vy: (Math.random() - 0.5) * 0.3,
				radius: 1.5 + Math.random() * 1.5,
				opacity: 0.15 + Math.random() * 0.15,
			});
		}
		particles.current = arr;
	}, [count]);

	/* ---- animation loop ---- */
	const animate = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const w = canvas.width;
		const h = canvas.height;
		const dpr = window.devicePixelRatio || 1;
		const { r, g, b } = getColor();
		const pts = particles.current;
		const mx = mouse.current.x * dpr;
		const my = mouse.current.y * dpr;
		const isActive = mouse.current.active && interactive;
		const iRadius = interactionRadius * dpr;
		const cDist = connectionDistance * dpr;
		const scrollY = scrollOffset.current * parallax * dpr;

		ctx.clearRect(0, 0, w, h);

		// Update positions
		for (const p of pts) {
			// Drift
			p.x += p.vx;
			p.y += p.vy;

			// Bounce off edges (with scroll offset)
			const drawY = p.y - scrollY;
			if (p.x < 0 || p.x > w) p.vx *= -1;
			if (p.y < 0 || p.y > h + Math.abs(scrollY) * 2) p.vy *= -1;

			// Mouse interaction
			if (isActive) {
				const dx = mx - p.x;
				const dy = my - (p.y - scrollY);
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist < iRadius && dist > 0) {
					const force = (iRadius - dist) / iRadius;
					const angle = Math.atan2(dy, dx);
					const strength = force * 0.8;
					if (attract) {
						p.vx += Math.cos(angle) * strength;
						p.vy += Math.sin(angle) * strength;
					} else {
						p.vx -= Math.cos(angle) * strength;
						p.vy -= Math.sin(angle) * strength;
					}
				}
			}

			// Damping — return to drift speed
			p.vx *= 0.985;
			p.vy *= 0.985;

			// Gentle pull back toward base position (prevents permanent drift-away)
			p.vx += (p.baseX - p.x) * 0.0003;
			p.vy += (p.baseY - p.y) * 0.0003;

			// Speed limit
			const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
			if (speed > 2) {
				p.vx = (p.vx / speed) * 2;
				p.vy = (p.vy / speed) * 2;
			}
		}

		// Draw connections
		for (let i = 0; i < pts.length; i++) {
			for (let j = i + 1; j < pts.length; j++) {
				const dx = pts[i].x - pts[j].x;
				const dy = (pts[i].y - scrollY) - (pts[j].y - scrollY);
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist < cDist) {
					const opacity = (1 - dist / cDist) * 0.12;
					ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(pts[i].x, pts[i].y - scrollY);
					ctx.lineTo(pts[j].x, pts[j].y - scrollY);
					ctx.stroke();
				}
			}
		}

		// Detect cluster zones (5+ particles within 80px)
		const clusterRadius = 80 * dpr;
		for (let i = 0; i < pts.length; i++) {
			let neighbors = 0;
			for (let j = 0; j < pts.length; j++) {
				if (i === j) continue;
				const dx = pts[i].x - pts[j].x;
				const dy = pts[i].y - pts[j].y;
				if (Math.sqrt(dx * dx + dy * dy) < clusterRadius) neighbors++;
			}
			if (neighbors >= 4) {
				// Draw cluster glow
				const gradient = ctx.createRadialGradient(
					pts[i].x, pts[i].y - scrollY, 0,
					pts[i].x, pts[i].y - scrollY, clusterRadius * 0.6,
				);
				gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.04)`);
				gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
				ctx.fillStyle = gradient;
				ctx.beginPath();
				ctx.arc(pts[i].x, pts[i].y - scrollY, clusterRadius * 0.6, 0, Math.PI * 2);
				ctx.fill();
			}
		}

		// Draw particles
		for (const p of pts) {
			ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
			ctx.beginPath();
			ctx.arc(p.x, p.y - scrollY, p.radius * dpr, 0, Math.PI * 2);
			ctx.fill();
		}

		rafId.current = requestAnimationFrame(animate);
	}, [getColor, connectionDistance, interactionRadius, attract, parallax, interactive]);

	/* ---- setup & teardown ---- */
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const dpr = window.devicePixelRatio || 1;

		const resize = () => {
			const rect = canvas.getBoundingClientRect();
			canvas.width = rect.width * dpr;
			canvas.height = rect.height * dpr;
			initParticles(canvas.width, canvas.height);
		};

		resize();

		// Observe container resize
		resizeObserver.current = new ResizeObserver(resize);
		resizeObserver.current.observe(canvas);

		// Mouse/touch handlers
		const onMouseMove = (e: MouseEvent) => {
			const rect = canvas.getBoundingClientRect();
			mouse.current.x = e.clientX - rect.left;
			mouse.current.y = e.clientY - rect.top;
			mouse.current.active = true;
		};
		const onMouseLeave = () => {
			mouse.current.active = false;
		};
		const onTouchMove = (e: TouchEvent) => {
			const rect = canvas.getBoundingClientRect();
			const touch = e.touches[0];
			mouse.current.x = touch.clientX - rect.left;
			mouse.current.y = touch.clientY - rect.top;
			mouse.current.active = true;
		};
		const onTouchEnd = () => {
			mouse.current.active = false;
		};
		const onScroll = () => {
			const rect = canvas.getBoundingClientRect();
			scrollOffset.current = -rect.top;
		};

		canvas.addEventListener("mousemove", onMouseMove);
		canvas.addEventListener("mouseleave", onMouseLeave);
		canvas.addEventListener("touchmove", onTouchMove, { passive: true });
		canvas.addEventListener("touchend", onTouchEnd);
		window.addEventListener("scroll", onScroll, { passive: true });

		rafId.current = requestAnimationFrame(animate);

		return () => {
			cancelAnimationFrame(rafId.current);
			resizeObserver.current?.disconnect();
			canvas.removeEventListener("mousemove", onMouseMove);
			canvas.removeEventListener("mouseleave", onMouseLeave);
			canvas.removeEventListener("touchmove", onTouchMove);
			canvas.removeEventListener("touchend", onTouchEnd);
			window.removeEventListener("scroll", onScroll);
		};
	}, [initParticles, animate]);

	return (
		<canvas
			ref={canvasRef}
			className={cn("absolute inset-0 size-full pointer-events-auto", className)}
			aria-hidden
		/>
	);
}
