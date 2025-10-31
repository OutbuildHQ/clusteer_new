"use client";

import { useEffect, useState } from "react";

interface StatProps {
	end: number;
	label: string;
	prefix?: string;
	suffix?: string;
}

function AnimatedStat({ end, label, prefix = "", suffix = "" }: StatProps) {
	const [count, setCount] = useState(0);

	useEffect(() => {
		const duration = 2000; // 2 seconds
		const steps = 60;
		const increment = end / steps;
		let current = 0;

		const timer = setInterval(() => {
			current += increment;
			if (current >= end) {
				setCount(end);
				clearInterval(timer);
			} else {
				setCount(Math.floor(current));
			}
		}, duration / steps);

		return () => clearInterval(timer);
	}, [end]);

	return (
		<div className="flex flex-col items-center text-center">
			<div className="text-3xl lg:text-4xl font-bold text-dark-green mb-2">
				{prefix}
				{count.toLocaleString()}
				{suffix}
			</div>
			<div className="text-sm lg:text-base text-gray-600 font-medium">
				{label}
			</div>
		</div>
	);
}

export default function StatsBanner() {
	return (
		<section className="bg-[#F0EBE6] border-y-2 border-black py-12 lg:py-16">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
					<AnimatedStat end={50} label="Traded Volume" prefix="₦" suffix="B+" />
					<AnimatedStat end={1000} label="Active Traders" suffix="+" />
					<AnimatedStat end={99} label="Uptime" suffix=".8%" />
					<AnimatedStat end={4} label="Average Rating" suffix=".9/5" />
				</div>
			</div>
		</section>
	);
}
