import Image from "next/image";
import Link from "next/link";

interface AuthFrameProps {
	title: string;
	subtitle?: string;
	children: React.ReactNode;
}

export default function AuthFrame({ title, subtitle, children }: AuthFrameProps) {
	return (
		<div className="min-h-screen bg-[var(--cl-bg)] flex items-center justify-center px-4 py-12">
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
					<h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[var(--cl-text)]">
						{title}
					</h1>
					{subtitle && (
						<p className="mt-2 text-[15px] text-[var(--cl-text-2)] leading-relaxed">
							{subtitle}
						</p>
					)}
				</div>
				<div className="bg-[var(--cl-surface)] border border-[var(--cl-line)] rounded-[var(--cl-r-lg)] p-6 shadow-[var(--cl-shadow-2)]">
					<div className="flex flex-col gap-5">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}
