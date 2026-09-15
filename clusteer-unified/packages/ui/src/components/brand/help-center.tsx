"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, X, ArrowUpRight } from "lucide-react";
import { helpTopics } from "@/lib/marketing-content";
import { MarketingFaq } from "./marketing-sections";
export function HelpCenter({ faq = false }: { faq?: boolean }) {
	const [query, setQuery] = useState("");
	const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
	const results = helpTopics
		.flatMap((topic) => topic.faqs)
		.filter((item) => terms.every((term) => `${item.q} ${item.a}`.toLowerCase().includes(term)));
	return (
		<main>
			<header className="cl-page-intro cl-container">
				<span>{faq ? "Frequently asked questions" : "Help centre"}</span>
				<h1>{faq ? "A few things worth knowing." : "What can we help with?"}</h1>
				<p>Find answers about access, conversions, wallets and getting help with an order.</p>
				<div className="cl-help-search">
					<Search size={18} />
					<input
						aria-label="Search help articles"
						type="search"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search for a question or topic"
					/>
					{query && (
						<button aria-label="Clear search" onClick={() => setQuery("")}>
							<X size={17} />
						</button>
					)}
				</div>
			</header>
			<div className="cl-read-layout cl-container">
				<nav className="cl-read-sidebar" aria-label="Help topics">
					{helpTopics.map((topic) => (
						<a href={`#${topic.id}`} key={topic.id} onClick={() => setQuery("")}>
							{topic.title}
						</a>
					))}
					<Link href="/contact">
						Contact support <ArrowUpRight size={13} />
					</Link>
				</nav>
				<div>
					{terms.length ? (
						<section className="cl-help-topic">
							<h2 role="status">
								{results.length} {results.length === 1 ? "answer" : "answers"} found
							</h2>
							{results.length ? (
								<MarketingFaq items={results} />
							) : (
								<p>
									Try a different word, or{" "}
									<Link className="underline" href="/contact">
										contact the team
									</Link>
									.
								</p>
							)}
						</section>
					) : (
						helpTopics.map((topic) => (
							<section id={topic.id} className="cl-help-topic" key={topic.id}>
								<h2>{topic.title}</h2>
								<p>{topic.description}</p>
								<MarketingFaq items={topic.faqs} />
							</section>
						))
					)}
				</div>
			</div>
		</main>
	);
}
