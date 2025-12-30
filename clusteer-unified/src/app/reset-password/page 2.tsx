import Container from "@/components/container";
import ResetPasswordForm from "@/components/forms/reset-password-form";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ token?: string }>;
}) {
	const { token } = await searchParams;

	if (!token) {
		redirect("/forgot-password");
	}
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
						Reset Password
					</h1>
					<p className="mt-3 text-base text-black">
						Create a new password for your Clusteer account.
					</p>
				</header>
			</div>
			<div className="max-w-[400px] w-full mt-[52px] md:mt-0">
				<ResetPasswordForm token={token} />
			</div>
		</Container>
	);
}
