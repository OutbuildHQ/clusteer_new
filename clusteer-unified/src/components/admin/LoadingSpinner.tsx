import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
	size?: "sm" | "md" | "lg";
	text?: string;
	fullScreen?: boolean;
}

export default function LoadingSpinner({
	size = "md",
	text,
	fullScreen = false
}: LoadingSpinnerProps) {
	const sizeClasses = {
		sm: "w-4 h-4",
		md: "w-8 h-8",
		lg: "w-12 h-12",
	};

	const spinner = (
		<div className="flex flex-col items-center justify-center gap-3">
			<Loader2 className={`${sizeClasses[size]} animate-spin text-[#014F01]`} />
			{text && <p className="text-sm text-gray-600">{text}</p>}
		</div>
	);

	if (fullScreen) {
		return (
			<div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
				{spinner}
			</div>
		);
	}

	return spinner;
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
	return (
		<div className="space-y-3 p-6">
			{Array.from({ length: rows }).map((_, i) => (
				<div key={i} className="flex gap-4 animate-pulse">
					<div className="w-10 h-10 bg-gray-200 rounded-full"></div>
					<div className="flex-1 space-y-2">
						<div className="h-4 bg-gray-200 rounded w-3/4"></div>
						<div className="h-3 bg-gray-100 rounded w-1/2"></div>
					</div>
					<div className="w-20 h-8 bg-gray-200 rounded"></div>
				</div>
			))}
		</div>
	);
}

export function CardSkeleton() {
	return (
		<div className="bg-white rounded-lg border border-[#E9EAEB] p-6 animate-pulse">
			<div className="flex items-center justify-between mb-4">
				<div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
			</div>
			<div className="space-y-2">
				<div className="h-3 bg-gray-200 rounded w-1/2"></div>
				<div className="h-8 bg-gray-100 rounded w-3/4"></div>
			</div>
		</div>
	);
}

export function FormSkeleton() {
	return (
		<div className="space-y-4 animate-pulse">
			{Array.from({ length: 4 }).map((_, i) => (
				<div key={i} className="space-y-2">
					<div className="h-4 bg-gray-200 rounded w-1/4"></div>
					<div className="h-10 bg-gray-100 rounded"></div>
				</div>
			))}
		</div>
	);
}
