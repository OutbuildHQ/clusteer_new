"use client";

import Image from "next/image";
import Link from "next/link";
import AnimatedButton from "./animated-button";
import Container from "./container";
import MobileMenu from "./mobile-menu";

export default function NavBar() {
	return (
		<nav>
			<Container className="flex items-center py-[18px] px-4 w-full lg:h-[94px] bg-white">
				<Link href="/" className="shrink-0">
					<Image
						src="/assets/icons/logo_with_name.svg"
						alt="Clusteer logo"
						className="shrink-0 sm:w-[115px] sm:h-[26px] md:w-[160px] md:h-[38px]"
						width={71}
						height={14}
					/>
				</Link>
				<MobileMenu />
				<AnimatedButton
					className="ml-auto shrink-0 hidden md:flex max-w-[111px]"
					variant="secondary"
					text="Log in"
					to="/login"
				/>
			</Container>
		</nav>
	);
}
