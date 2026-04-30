import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
	size?: "sm" | "md" | "lg";
	text?: string;
	fullScreen?: boolean;
	overlay?: boolean;
}

export default function LoadingSpinner({
	size = "md",
	text,
	fullScreen = false,
	overlay = false
}: LoadingSpinnerProps) {
	const sizeClasses = {
		sm: "w-4 h-4",
		md: "w-8 h-8",
		lg: "w-12 h-12",
	};

	const spinner = (
		<div className="flex flex-col items-center justify-center gap-3">
			<Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
			{text && <p className="text-sm text-muted-foreground">{text}</p>}
		</div>
	);

	if (fullScreen || overlay) {
		return (
			<div className="fixed inset-0 bg-card/80 backdrop-blur-sm flex items-center justify-center z-50">
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
					<div className="w-10 h-10 bg-muted rounded-full"></div>
					<div className="flex-1 space-y-2">
						<div className="h-4 bg-muted rounded w-3/4"></div>
						<div className="h-3 bg-muted rounded w-1/2"></div>
					</div>
					<div className="w-20 h-8 bg-muted rounded"></div>
				</div>
			))}
		</div>
	);
}

export function CardSkeleton() {
	return (
		<div className="bg-card rounded-lg border border-border p-6 animate-pulse">
			<div className="flex items-center justify-between mb-4">
				<div className="w-12 h-12 bg-muted rounded-lg"></div>
			</div>
			<div className="space-y-2">
				<div className="h-3 bg-muted rounded w-1/2"></div>
				<div className="h-8 bg-muted rounded w-3/4"></div>
			</div>
		</div>
	);
}

export function FormSkeleton() {
	return (
		<div className="space-y-4 animate-pulse">
			{Array.from({ length: 4 }).map((_, i) => (
				<div key={i} className="space-y-2">
					<div className="h-4 bg-muted rounded w-1/4"></div>
					<div className="h-10 bg-muted rounded"></div>
				</div>
			))}
		</div>
	);
}
