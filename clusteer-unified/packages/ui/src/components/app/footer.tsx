import Link from "next/link";
import { Logo } from "@/components/brand/logo";
const groups = [
	{
		title: "Explore",
		links: [
			["How it works", "/#how"],
			["Buy stablecoins", "/buy"],
			["Sell stablecoins", "/sell"],
			["See how it works", "/demo"],
			["Fees & rates", "/fees"],
		],
	},
	{
		title: "Clusteer",
		links: [
			["About us", "/about"],
			["Contact", "/contact"],
			["Help centre", "/help"],
			["Service status", "/status"],
			["Careers", "/careers"],
			["Press", "/press"],
		],
	},
	{
		title: "The details",
		links: [
			["Safety & fund flow", "/security"],
			["Terms of service", "/terms-of-service"],
			["Privacy policy", "/privacy-policy"],
			["AML / CFT", "/aml-cft"],
			["Cookie policy", "/cookie-policy"],
		],
	},
];
export function Footer() {
	return (
		<footer className="cl-footer">
			<div className="cl-container">
				<div className="cl-footer-top">
					<div>
						<Logo inverted />
						<p>
							Global money.
							<br />
							Closer to home.
						</p>
						<a href="https://x.com/clusteer" target="_blank" rel="noreferrer">
							Follow Clusteer on X ↗
						</a>
					</div>
					{groups.map((group) => (
						<div key={group.title}>
							<h2>{group.title}</h2>
							<ul>
								{group.links.map(([label, href]) => (
									<li key={href}>
										<Link href={href}>{label}</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
				<div className="cl-footer-bottom">
					<p>
						Clusteer is a financial technology product of Outbuild Ltd (RC 8076384), not a bank. We
						operate a non-custodial model — your funds are always yours — and process transactions
						through partnerships with fully licensed, nationally regulated payment and digital-asset
						partners.
					</p>
					<span>© {new Date().getFullYear()} Clusteer</span>
				</div>
			</div>
		</footer>
	);
}
