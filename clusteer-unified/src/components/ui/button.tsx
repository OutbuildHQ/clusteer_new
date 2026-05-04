"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-light-green text-custom-black border-2 border-custom-black shadow-sm hover:bg-light-green/80 active:bg-light-green/70",
				destructive: "bg-destructive text-white border-2 border-destructive shadow-sm hover:brightness-95",
				outline: "border-2 border-custom-black bg-transparent shadow-sm hover:bg-warm-beige",
				secondary: "bg-warm-beige text-custom-black border-2 border-custom-black/20 hover:bg-warm-beige/80",
				ghost: "hover:bg-muted",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-10 px-5 py-2.5",
				sm: "h-9 px-4 text-[13px]",
				lg: "h-12 px-7 text-[15px]",
				xl: "h-14 px-8 text-[17px]",
				icon: "size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
