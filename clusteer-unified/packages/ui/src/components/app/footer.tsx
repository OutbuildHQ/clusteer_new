"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";

export function Footer() {
	const [overall, setOverall] = useState<"operational" | "degraded" | "down" | null>(null);

	useEffect(() => {
		const controller = new AbortController();
		fetch("/api/status", { signal: controller.signal })
			.then((r) => r.json())
			.then((d) => setOverall(d.overall ?? null))
			.catch(() => {
				// leave null — omit the badge rather than assert a status we can't verify
			});
		return () => controller.abort();
	}, []);

	const statusLabel =
		overall === "operational"
			? "All systems operational"
			: overall === "degraded"
				? "Some systems degraded"
				: overall === "down"
					? "Service disruption"
					: null;

	return (
		<>
			{/* gradient divider */}
			<div className="h-px bg-gradient-to-r from-transparent via-light-green/40 to-transparent max-w-[1280px] mx-auto" />
			<footer className="bg-custom-black text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-8">
				<div className="max-w-[1280px] mx-auto">
					<h3 className="font-display text-xl sm:text-3xl lg:text-4xl font-bold tracking-[-0.04em] text-white mb-8 sm:mb-12">
						Stables to Naira. <em className="italic text-light-green">That&apos;s it.</em>
					</h3>
					<div className="flex flex-col lg:flex-row lg:justify-between gap-10 sm:gap-12 mb-10 sm:mb-16">
						<div className="lg:max-w-[320px] shrink-0">
							<Logo inverted />
							<p className="mt-4 sm:mt-5 text-[13px] sm:text-[14px] leading-[1.6] text-white/60 max-w-[280px]">
								Stablecoins to naira, fast. Built for traders, freelancers, and anyone moving money
								in and out of Nigeria.
							</p>
							{statusLabel && (
								<div className="inline-flex items-center gap-2 mt-5 px-3 py-1.5 rounded-full bg-light-green/[0.12] font-mono text-[11px] font-medium text-light-green">
									<span className="live-dot size-1.5 rounded-full bg-light-green" />
									{statusLabel}
								</div>
							)}
							{/* Socials */}
							<div className="flex items-center gap-3 mt-6">
								{[
									{
										label: "Follow Clusteer on X",
										href: "https://x.com/clusteer",
										icon: (
											<svg
												aria-hidden="true"
												className="size-4"
												viewBox="0 0 24 24"
												fill="currentColor"
											>
												<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
											</svg>
										),
									},
								].map((s) => (
									<a
										key={s.label}
										href={s.href}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={s.label}
										className="size-9 rounded-full border border-white/20 bg-white/5 inline-flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
									>
										{s.icon}
									</a>
								))}
							</div>
							<div className="mt-5 flex flex-wrap gap-2">
								<span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-2 text-xs text-white/80">
									<svg className="size-4 text-white" viewBox="0 0 24 24" fill="currentColor">
										<path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 21.99C7.79 22.03 6.8 20.68 5.96 19.47C4.25 16.97 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
									</svg>
									iOS — Coming soon
								</span>
								<span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-2 text-xs text-white/80">
									<svg className="size-4 text-white" viewBox="0 0 24 24" fill="currentColor">
										<path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.61 3 21.09 3 20.5ZM16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12ZM20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.5 12.92 20.16 13.19L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81ZM6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z" />
									</svg>
									Android — Coming soon
								</span>
							</div>
						</div>
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
							{[
								{
									t: "Product",
									l: [
										{ label: "Buy stables", href: "/buy" },
										{ label: "Sell stables", href: "/sell" },
										{ label: "Payments", href: "/payments" },
										{ label: "Markets", href: "/live-markets" },
										{ label: "Mobile app", href: "/mobile" },
									],
								},
								{
									t: "Company",
									l: [
										{ label: "About", href: "/about" },
										{ label: "Careers", href: "/careers" },
										{ label: "Press", href: "/press" },
										{ label: "Contact", href: "/contact" },
										{ label: "Status", href: "/status" },
									],
								},
								{
									t: "Resources",
									l: [
										{ label: "Help center", href: "/help" },
										{ label: "Rate alerts", href: "/rate-alerts" },
										{ label: "Trust", href: "#trust" },
									],
								},
								{
									t: "Legal",
									l: [
										{ label: "Terms", href: "/terms-of-service" },
										{ label: "Privacy", href: "/privacy-policy" },
										{ label: "AML/CFT", href: "/aml-cft" },
										{ label: "Cookie policy", href: "/cookie-policy" },
									],
								},
							].map((c) => (
								<div key={c.t}>
									<div className="font-mono text-[11px] font-semibold text-white/40 tracking-[1.5px] mb-4">
										{c.t.toUpperCase()}
									</div>
									<ul className="flex flex-col gap-2.5">
										{c.l.map((it) => (
											<li key={it.label}>
												{it.href.startsWith("#") ? (
													<a
														href={it.href}
														className="group text-sm text-white/60 hover:text-light-green transition-colors duration-200"
													>
														{it.label}
													</a>
												) : (
													<Link
														href={it.href}
														className="group text-sm text-white/60 hover:text-light-green transition-colors duration-200"
													>
														{it.label}
													</Link>
												)}
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					</div>
					<div className="pt-6 sm:pt-7 border-t border-white/10">
						<p className="text-[11px] sm:text-xs text-white/40 leading-relaxed max-w-3xl mb-4 sm:mb-5">
							Clusteer is a financial technology product of Outbuild Ltd (RC 8076384), not a bank.
							We operate a non-custodial model — your funds are always yours — and process
							transactions through partnerships with fully licensed, nationally regulated payment
							and digital-asset partners.
						</p>
						<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-white/50">
							<span>&copy; {new Date().getFullYear()} Clusteer. All rights reserved.</span>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
}
