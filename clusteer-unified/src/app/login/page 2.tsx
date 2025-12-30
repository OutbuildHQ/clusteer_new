import Container from "@/components/container";
import LoginForm from "@/components/forms/login-form";
import Image from "next/image";
import Link from "next/link";

export default async function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ verified?: string; error?: string }>;
}) {
	const params = await searchParams;

	return (
		<Container className="mt-[30px] mb-[75px] md:max-h-screen md:mt-36 text-start flex flex-col md:flex-row justify-center items-center md:items-start gap-x-5 lg:gap-x-24">
			<div className="max-w-[300px] w-full">
				<header className="pt-14 md:pt-0 text-center md:text-start">
					<Link href="/" className="hidden md:inline-block">
						<Image
							src="/assets/icons/logo_with_name.svg"
							alt="Clusteer logo"
							className="shrink-0"
							width={125}
							height={30}
						/>
					</Link>
					<h1 className="font-semibold text-3xl md:mt-[26px]">Welcome Back</h1>
					<p className="mt-3 text-base text-black">
						Sign into your account to access your dashboard
					</p>
				</header>
			</div>
			<div className="max-w-[400px] w-full mt-[52px] md:mt-0">
				{params.verified && (
					<div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
						✓ Email verified successfully! You can now login.
					</div>
				)}
				{params.error && (
					<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
						Verification failed. Please try again or contact support.
					</div>
				)}
				<LoginForm />
				<div className="p-2.5 mt-2.5 text-center">
					<p className="text-[11px]">
						By logging in you agree to our <br />{" "}
						<span className="text-dark-green">Terms of Service</span> and{" "}
						<span className="text-dark-green">Privacy Policies</span>
					</p>
				</div>
			</div>
		</Container>
	);
}
