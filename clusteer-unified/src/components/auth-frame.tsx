import Image from "next/image";
import Link from "next/link";

interface AuthFrameProps {
	title: string;
	subtitle?: string;
	children: React.ReactNode;
}

export default function AuthFrame({ title, subtitle, children }: AuthFrameProps) {
	return (
		<div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
			<div className="w-full max-w-[420px]">
				<div className="text-center mb-8">
					<Link href="/" className="inline-block mb-8">
						<Image
							src="/assets/icons/logo_with_name.svg"
							alt="Clusteer"
							width={140}
							height={32}
							className="mx-auto"
						/>
					</Link>
					<h1 className="text-[28px] font-semibold tracking-[-0.02em] text-foreground">
						{title}
					</h1>
					{subtitle && (
						<p className="mt-2 text-[15px] text-muted-foreground leading-relaxed">
							{subtitle}
						</p>
					)}
				</div>
				<div className="bg-card border border-border rounded-lg p-6 shadow-md">
					<div className="flex flex-col gap-5">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}
