import Container from "@/components/container";
import SignUpForm from "@/components/forms/signup-form";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
	return (
		<Container className="mt-[55px] mb-[75px] md:max-h-screen md:mt-28 text-start flex flex-col md:flex-row justify-center items-center md:items-start gap-x-5 lg:gap-x-24">
			<div className="max-w-[300px] w-full">
				<header className="pt-14 md:pt-0">
					<Link href="/" className="hidden md:inline-block">
						<Image
							src="/assets/icons/logo_with_name.svg"
							alt="Clusteer logo"
							className="shrink-0"
							width={125}
							height={30}
						/>
					</Link>
					<h1 className="font-semibold text-3xl md:mt-[26px]">
						Create Your Account
					</h1>
					<p className="mt-3 text-base text-black">
						Clusteer offers you the best crypto-to-fiat <br /> conversion rate
					</p>
				</header>
				<ul className="space-y-5 mt-[52px] max-w-[277px] mx-auto">
					<li className="flex gap-x-3 text-base">
						<Check
							className="size-7 shrink-0"
							strokeWidth={2}
							color="hsla(78, 100%, 48%, 1)"
						/>
						<span>10+ cryptocurrencies available</span>
					</li>
					<li className="flex gap-x-3 text-base">
						<Check
							className="size-7 shrink-0"
							strokeWidth={2}
							color="hsla(78, 100%, 48%, 1)"
						/>
						<span>Withdraw Naira directly into your bank account</span>
					</li>
					<li className="flex gap-x-3 text-base">
						<Check
							className="size-7 shrink-0"
							strokeWidth={2}
							color="hsla(78, 100%, 48%, 1)"
						/>
						<span>Personal account manager & 24/7 support</span>
					</li>
				</ul>
			</div>
			<div className="max-w-[400px] w-full mt-[52px] md:mt-0">
				<SignUpForm />
				<div className="p-2.5 mt-2.5 text-center">
					<p className="text-[11px]">
						By signing up you agree to our <br />{" "}
						<span className="text-dark-green">Terms of Service</span> and{" "}
						<span className="text-dark-green">Privacy Policies</span>
					</p>
				</div>
			</div>
		</Container>
	);
}
