import Container from "@/components/container";
import ForgotPasswordForm from "@/components/forms/forgot-password-form";
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
					<h1 className="font-semibold text-3xl md:mt-[26px]">
						Forgot Password?
					</h1>
					<p className="mt-3 text-base text-black">
						Enter the email address linked to your Clusteer account. We’ll send
						you a link to reset your password.
					</p>
				</header>
			</div>
			<div className="max-w-[400px] w-full mt-[52px] md:mt-0">
				<ForgotPasswordForm />
			</div>
		</Container>
	);
}
