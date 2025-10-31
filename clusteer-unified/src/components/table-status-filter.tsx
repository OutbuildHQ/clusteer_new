"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface TableStatusFilterProps<T extends string> {
	filters: readonly T[];
	activeFilter: T;
	onFilterChange: (filter: T) => void;
}

export function TableStatusFilter<T extends string>({
	filters,
	activeFilter,
	onFilterChange,
}: TableStatusFilterProps<T>) {
	return (
		<div className="flex rounded-xl border border-[#D0D5DD] overflow-hidden">
			{filters.map((filter) => (
				<Button
					key={filter}
					type="button"
					variant={activeFilter === filter ? "default" : "outline"}
					className="rounded-none border-0 border-r border-[#D0D5DD] last:border-0 h-10"
					onClick={() => onFilterChange(filter)}
				>
					<span
						className={cn("inline-block lowercase first-letter:uppercase", {
							"text-white": activeFilter === filter,
						})}
					>
						{filter}
					</span>
				</Button>
			))}
		</div>
	);
}
