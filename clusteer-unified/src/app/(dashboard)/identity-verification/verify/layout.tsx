export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<section className="mt-[45px] pb-[82px] relative">
			{children}
			{/* <Button
				type="button"
				variant="ghost"
				asChild
				className="hidden md:flex"
			>
				<div className="p-2.5 items-center gap-x-2.5 cursor-pointer absolute top-0 right-0">
					<Save size={24} />
					<span className="font-medium text-base">Save and Exit</span>
				</div>
			</Button> */}
		</section>
	);
}
