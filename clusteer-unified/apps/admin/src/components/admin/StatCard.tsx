import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
	title: string;
	value: string;
	change: number;
	icon: LucideIcon;
	subtitle?: string;
}

export default function StatCard({
	title,
	value,
	change,
	icon: Icon,
	subtitle,
}: StatCardProps) {
	const isPositive = change >= 0;

	return (
		<div className="bg-card rounded-lg border border-border p-4 sm:p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-primary/20 cursor-pointer">
			{/* Header */}
			<div className="flex items-center justify-between mb-3 sm:mb-4">
				<span className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</span>
				<div className="p-1.5 sm:p-2 bg-background rounded-lg transition-colors group-hover:bg-primary/5 flex-shrink-0">
					<Icon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
				</div>
			</div>

			{/* Value */}
			<div className="mb-2">
				<h3 className="text-2xl sm:text-3xl font-bold text-foreground break-words">{value}</h3>
				{subtitle && (
					<p className="text-xs sm:text-sm text-muted-foreground mt-1">{subtitle}</p>
				)}
			</div>

			{/* Change Indicator */}
			<div className="flex items-center gap-1 flex-wrap">
				{isPositive ? (
					<TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--c-lime-500)] flex-shrink-0" />
				) : (
					<TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-danger flex-shrink-0" />
				)}
				<span
					className={`text-xs sm:text-sm font-medium ${
						isPositive ? "text-[var(--c-lime-500)]" : "text-danger"
					}`}
				>
					{isPositive ? "+" : ""}
					{change}%
				</span>
				<span className="text-xs sm:text-sm text-muted-foreground ml-1">vs last month</span>
			</div>
		</div>
	);
}
