import Image from "next/image";
import Container from "./container";

export default function NavBar() {
	return (
		<nav>
			<Container className="flex items-center py-[18px] px-4 w-full bg-white lg:hidden">
				<Image
					src="/assets/icons/logo_with_name.svg"
					alt="Clusteer logo"
					className="shrink-0 md:w-[160px] h-[38px]"
					width={103}
					height={24}
				/>
				<Image
					src="/assets/icons/menu.svg"
					alt="Menu icon"
					className="ml-auto md:hidden"
					width={24}
					height={24}
				/>
			</Container>
		</nav>
	);
}
