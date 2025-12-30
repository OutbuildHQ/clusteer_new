import Container from "@/components/container";
import VerifyOTPForm from "@/components/forms/verify-otp-form";
import Image from "next/image";

export default function Page() {
	return (
		<Container className="mt-[30px] mb-[75px] md:mt-44 text-start flex flex-col md:flex-row justify-center items-center md:items-start gap-x-5 lg:gap-x-24">
			<div className="max-w-[300px] w-full">
				<header className="pt-14 md:pt-0 text-center md:text-start">
					<Image
						src="/assets/icons/logo_with_name.svg"
						alt="Clusteer logo"
						className="shrink-0 hidden md:block"
						width={125}
						height={30}
					/>
					<h1 className="font-semibold text-3xl md:mt-[26px]">Verify OTP</h1>
					<p className="mt-3 text-base text-black">
						Check your inbox and input the 6-digit code.
					</p>
				</header>
			</div>
			<div className="w-fit mt-[52px] md:mt-0">
				<VerifyOTPForm />
			</div>
		</Container>
	);
}
