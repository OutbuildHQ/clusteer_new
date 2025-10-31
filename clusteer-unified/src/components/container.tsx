interface ContainerProps {
	children: React.ReactNode[] | React.ReactNode;
	className?: string;
	id?: string;
}

export default function Container({ id, className, children }: ContainerProps) {
	return (
		<div
			id={id}
			className={"max-w-[1280px] px-4 md:px-[40px] mx-auto w-full " + className}
		>
			{children}
		</div>
	);
}
