"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, ChevronDown } from "lucide-react";
import { Logo } from "@/components/brand/logo";
const menus = [
	{
		label: "Products",
		intro: "Two directions. One place to start.",
		featured: { label: "Explore the walkthrough", href: "/demo" },
		links: [
			{ label: "Buy stablecoins", href: "/buy", detail: "From naira to your own wallet." },
			{
				label: "Sell stablecoins",
				href: "/sell",
				detail: "From stablecoins to your Nigerian bank.",
			},
			{
				label: "Explore the experience",
				href: "/demo",
				detail: "From your first quote to your final receipt.",
			},
		],
	},
	{
		label: "Company",
		intro: "Built around the way money moves.",
		featured: { label: "Meet Clusteer", href: "/about" },
		links: [
			{ label: "About Clusteer", href: "/about", detail: "Our purpose and approach." },
			{ label: "Contact", href: "/contact", detail: "Talk to the team." },
			{ label: "Careers", href: "/careers", detail: "Help shape what comes next." },
			{ label: "Press", href: "/press", detail: "Company information and media enquiries." },
		],
	},
	{
		label: "Resources",
		intro: "Understand the details before you decide.",
		featured: { label: "Find an answer", href: "/help" },
		links: [
			{ label: "Help centre", href: "/help", detail: "Answers for every step." },
			{ label: "Fees & rates", href: "/fees", detail: "What to look for in your quote." },
			{
				label: "Safety & fund flow",
				href: "/security",
				detail: "How a conversion moves from start to finish.",
			},
			{ label: "Service status", href: "/status", detail: "Check the status of our services." },
		],
	},
];
export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
	const [open, setOpen] = useState<string | null>(null);
	const [mobile, setMobile] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const header = useRef<HTMLElement>(null);
	const pathname = usePathname();
	useEffect(() => {
		setOpen(null);
		setMobile(false);
	}, [pathname]);
	useEffect(() => {
		const update = () => setScrolled(window.scrollY > 48);
		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, []);
	useEffect(() => {
		if (!open && !mobile) return;
		const dismiss = (event: PointerEvent) => {
			if (!header.current?.contains(event.target as Node)) {
				setOpen(null);
				setMobile(false);
			}
		};
		const escape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				const trigger = mobile ? "cl-menu-button" : `nav-${open}`;
				setOpen(null);
				setMobile(false);
				document.getElementById(trigger)?.focus();
			}
		};
		document.addEventListener("pointerdown", dismiss);
		document.addEventListener("keydown", escape);
		return () => {
			document.removeEventListener("pointerdown", dismiss);
			document.removeEventListener("keydown", escape);
		};
	}, [open, mobile]);
	const dark = overlay && !scrolled && !open && !mobile;
	return (
		<header
			ref={header}
			className={`cl-site-header cl-navigation ${overlay ? "cl-header-overlay" : ""} ${dark ? "is-transparent" : "is-paper"}`}
			onBlur={(e) => {
				if (!e.currentTarget.contains(e.relatedTarget)) setOpen(null);
			}}
		>
			<div className="cl-header-inner">
				<Link href="/" aria-label="Clusteer home">
					<Logo inverted={dark} />
				</Link>
				<nav className="cl-desktop-nav" aria-label="Main navigation">
					{menus.map((menu, i) => (
						<div className="cl-nav-group" key={menu.label}>
							<button
								id={`nav-${menu.label}`}
								aria-expanded={open === menu.label}
								aria-controls={`panel-${menu.label}`}
								onClick={() => setOpen(open === menu.label ? null : menu.label)}
							>
								{menu.label}
								<ChevronDown size={13} />
							</button>
							{open === menu.label && (
								<div className="cl-mega-menu" id={`panel-${menu.label}`}>
									<div className="cl-mega-intro">
										<span>{menu.label}</span>
										<p>{menu.intro}</p>
										<Link href={menu.featured.href} onClick={() => setOpen(null)}>
											{menu.featured.label} <ArrowUpRight size={16} />
										</Link>
									</div>
									<div className="cl-mega-links">
										{menu.links.map((link) => (
											<Link key={link.href} href={link.href} onClick={() => setOpen(null)}>
												<strong>
													{link.label}
													<ArrowUpRight size={15} />
												</strong>
												<span>{link.detail}</span>
											</Link>
										))}
									</div>
									{i === 0 && (
										<div className="cl-mega-note">
											In development <Link href="/payments">Payment requests</Link>
											<Link href="/mobile">Mobile app</Link>
											<Link href="/rate-alerts">Rate alerts</Link>
											<Link href="/live-markets">Market view</Link>
										</div>
									)}
								</div>
							)}
						</div>
					))}
					<a href="/#how">How it works</a>
				</nav>
				<div className="cl-header-actions">
					<Link className="cl-signin" href="/login">
						Sign in
					</Link>
					<Link href="/early-access" className="cl-button cl-header-cta">
						Join the waitlist <ArrowUpRight size={14} />
					</Link>
					<button
						id="cl-menu-button"
						className="cl-menu-button"
						aria-label={mobile ? "Close menu" : "Open menu"}
						aria-expanded={mobile}
						aria-controls="cl-mobile-navigation"
						onClick={() => setMobile(!mobile)}
					>
						{mobile ? <X size={23} /> : <Menu size={23} />}
					</button>
				</div>
			</div>
			{mobile && (
				<nav id="cl-mobile-navigation" className="cl-mobile-nav" aria-label="Mobile navigation">
					{menus.map((menu) => (
						<details key={menu.label}>
							<summary>
								{menu.label}
								<ChevronDown size={17} />
							</summary>
							<div>
								{menu.links.map((link) => (
									<Link key={link.href} href={link.href} onClick={() => setMobile(false)}>
										{link.label}
										<ArrowUpRight size={15} />
									</Link>
								))}
								{menu.label === "Products" && (
									<div className="cl-mobile-planned">
										<span>In development</span>
										{[
											["Payment requests", "/payments"],
											["Mobile app", "/mobile"],
											["Rate alerts", "/rate-alerts"],
											["Market view", "/live-markets"],
										].map(([label, href]) => (
											<Link href={href} key={href} onClick={() => setMobile(false)}>
												{label}
												<ArrowUpRight size={15} />
											</Link>
										))}
									</div>
								)}
							</div>
						</details>
					))}
					<a href="/#how" onClick={() => setMobile(false)}>
						How it works <ArrowUpRight size={15} />
					</a>
					<div className="cl-mobile-account">
						<Link href="/login">Sign in</Link>
						<Link href="/early-access" className="cl-button cl-button-dark">
							Join the waitlist
						</Link>
					</div>
				</nav>
			)}
		</header>
	);
}
