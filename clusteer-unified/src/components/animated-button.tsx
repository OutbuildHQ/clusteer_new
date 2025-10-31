"use client";

import { DASHBOARD_LINK } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

const buttonVariants = cva(
	"relative text-black flex items-center justify-center gap-x-2 h-11 border-2 border-black overflow-hidden w-full",
	{
		variants: {
			variant: {
				default: "bg-light-green rounded-[30px]",
				secondary: "bg-white rounded-[50px]",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	}
);

interface Props
	extends React.ComponentProps<"button">,
		VariantProps<typeof buttonVariants> {
	text: string;
	to?: string;
	external?: boolean;
}

export default function AnimatedButton({
	text,
	variant,
	className,
	to = DASHBOARD_LINK,
	external = false,
}: Props) {
	const [isHovered, setIsHovered] = useState(false);

	if (external) {
		return (
			<AnimatePresence mode="wait">
				<motion.a
					href={to}
					target="_blank"
					rel="noopener noreferrer"
					className={cn(buttonVariants({ variant }), className)}
					onHoverStart={() => setIsHovered(true)}
					onHoverEnd={() => setIsHovered(false)}
					transition={{ duration: 0.2, ease: "easeOut" }}
				>
					<motion.span
						layout
						className="text-base text-nowrap shrink-0 font-semibold text-center w-fit text-black font-lexend"
					>
						{text}
					</motion.span>

					{isHovered && (
						<motion.div
							layout
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -8 }}
							transition={{
								duration: 0.2,
								ease: "easeOut",
								delay: 0.1,
							}}
							className="size-6 bg-cover bg-center bg-no-repeat shrink-0"
							style={{
								backgroundImage: `url('/assets/icons/arrow-right.svg')`,
							}}
						/>
					)}
				</motion.a>
			</AnimatePresence>
		);
	}

	return (
		<AnimatePresence mode="wait">
			<Link href={to} className={cn(buttonVariants({ variant }), className)}>
				<motion.div
					className="flex items-center justify-center gap-x-2 w-full h-full"
					onHoverStart={() => setIsHovered(true)}
					onHoverEnd={() => setIsHovered(false)}
					transition={{ duration: 0.2, ease: "easeOut" }}
				>
					<motion.span
						layout
						className="text-base text-nowrap shrink-0 font-semibold text-center w-fit text-black font-lexend"
					>
						{text}
					</motion.span>

					{isHovered && (
						<motion.div
							layout
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -8 }}
							transition={{
								duration: 0.2,
								ease: "easeOut",
								delay: 0.1,
							}}
							className="size-6 bg-cover bg-center bg-no-repeat shrink-0"
							style={{
								backgroundImage: `url('/assets/icons/arrow-right.svg')`,
							}}
						/>
					)}
				</motion.div>
			</Link>
		</AnimatePresence>
	);
}
