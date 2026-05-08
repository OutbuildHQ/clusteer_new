import { X } from "lucide-react";
import React, { FC, SVGProps } from "react";
import { ToastClassnames, toast } from "sonner";
import { Button } from "./ui/button";

interface ToastOptions {
	className?: string;
	closeButton?: boolean;
	descriptionClassName?: string;
	style?: React.CSSProperties;
	cancelButtonStyle?: React.CSSProperties;
	actionButtonStyle?: React.CSSProperties;
	duration?: number;
	unstyled?: boolean;
	classNames?: ToastClassnames;
	closeButtonAriaLabel?: string;
}

// =======================
// Icon Components
// =======================
const SuccessIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
	<svg
		width="38"
		height="38"
		viewBox="0 0 38 38"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<g opacity="0.3">
			<path
				d="M19 6C26.1797 6 32 11.8203 32 19C32 26.1797 26.1797 32 19 32C11.8203 32 6 26.1797 6 19C6 11.8203 11.8203 6 19 6Z"
				stroke="#079455"
				strokeWidth={2}
			/>
		</g>
		<g opacity="0.1">
			<path
				d="M19 1C28.9411 1 37 9.05887 37 19C37 28.9411 28.9411 37 19 37C9.05887 37 1 28.9411 1 19C1 9.05887 9.05887 1 19 1Z"
				stroke="#079455"
				strokeWidth={2}
			/>
		</g>
		<g clipPath="url(#clip0_success)">
			<path
				d="M15.2498 18.9998L17.7498 21.4998L22.7498 16.4998M27.3332 18.9998C27.3332 23.6022 23.6022 27.3332 18.9998 27.3332C14.3975 27.3332 10.6665 23.6022 10.6665 18.9998C10.6665 14.3975 14.3975 10.6665 18.9998 10.6665C23.6022 10.6665 27.3332 14.3975 27.3332 18.9998Z"
				stroke="#079455"
				strokeWidth={1.66667}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</g>
		<defs>
			<clipPath id="clip0_success">
				<rect
					width="20"
					height="20"
					fill="white"
					transform="translate(9 9)"
				/>
			</clipPath>
		</defs>
	</svg>
);

const ErrorIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
	<svg
		width="38"
		height="38"
		viewBox="0 0 38 38"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<g opacity="0.3">
			<path
				d="M19 6C26.1797 6 32 11.8203 32 19C32 26.1797 26.1797 32 19 32C11.8203 32 6 26.1797 6 19C6 11.8203 11.8203 6 19 6Z"
				stroke="#D92D20"
				strokeWidth={2}
			/>
		</g>
		<g opacity="0.1">
			<path
				d="M19 1C28.9411 1 37 9.05887 37 19C37 28.9411 28.9411 37 19 37C9.05887 37 1 28.9411 1 19C1 9.05887 9.05887 1 19 1Z"
				stroke="#D92D20"
				strokeWidth={2}
			/>
		</g>
		<g clipPath="url(#clip0_error)">
			<path
				d="M18.9998 15.6665V18.9998M18.9998 22.3332H19.0082M27.3332 18.9998C27.3332 23.6022 23.6022 27.3332 18.9998 27.3332C14.3975 27.3332 10.6665 23.6022 10.6665 18.9998C10.6665 14.3975 14.3975 10.6665 18.9998 10.6665C23.6022 10.6665 27.3332 14.3975 27.3332 18.9998Z"
				stroke="#D92D20"
				strokeWidth={1.66667}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</g>
		<defs>
			<clipPath id="clip0_error">
				<rect
					width="20"
					height="20"
					fill="white"
					transform="translate(9 9)"
				/>
			</clipPath>
		</defs>
	</svg>
);

// =======================
// Types
// =======================
type ToastId = number | string;

type CustomOptions = ToastOptions & {
	id?: ToastId;
};

// =======================
// Custom Toast Component
// =======================
const CustomToast = ({
	id,
	message,
	icon,
}: {
	id: ToastId;
	message: string;
	icon: React.ReactNode;
}) => (
	<div className="flex items-center bg-white border border-zinc-200 rounded-lg h-[60px] px-[23px]">
		<div className="flex items-center gap-2 text-sm font-medium text-[#414651]">
			{icon}
			<span>{message}</span>
		</div>
		<Button
			variant="ghost"
			onClick={() => toast.dismiss(id)}
			className="ml-auto flex items-center gap-x-2 font-semibold text-sm text-[#535862] hover:[&>svg]:stroke-black"
		>
			Dismiss
			<X
				key={id}
				className="size-5"
				stroke="#A4A7AE"
			/>
		</Button>
	</div>
);

// =======================
// Toast Helpers
// =======================
const success = (message: string, options?: CustomOptions) =>
	toast.custom(
		(id) => (
			<CustomToast
				id={id}
				message={message}
				icon={<SuccessIcon className="size-[38px] shrink-0" />}
			/>
		),
		options
	);

const error = (message: string, options?: CustomOptions) =>
	toast.custom(
		(id) => (
			<CustomToast
				id={id}
				message={message}
				icon={<ErrorIcon className="size-[38px] shrink-0" />}
			/>
		),
		options
	);

export const Toast = {
	...toast,
	success,
	error,
};
