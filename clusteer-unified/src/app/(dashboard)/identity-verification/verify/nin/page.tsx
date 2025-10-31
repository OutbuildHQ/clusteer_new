import NINVerificationForm from "@/components/forms/nin-verification-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
	const isPending = false;

	if (isPending)
		return (
			<div className="h-full flex flex-col items-center">
				<Image
					className="object-cover"
					src="/assets/icons/hour_glass.svg"
					alt="upload icon"
					width={250}
					height={250}
				/>
				<h1 className="text-3xl font-bold mt-[61px]">Under Review</h1>
				<div className="font-medium text-2xl text-center mt-11.5 p-2.5 space-y-2.5">
					<p>
						You will receive an email/app notification once the review is
						completed.
					</p>
					<p>Estimated review time:</p>
					<p>1 Hour(s)</p>
				</div>
				<Link href="/">
					<Button className="max-w-[268px] mt-[61px] font-mona border-black text-[#111111] bg-light-green border font-medium text-base shadow-xs hover:bg-muted w-full h-11">
						Go to homepage
					</Button>
				</Link>
			</div>
		);

	return (
		<div className="w-full lg:max-w-[478px]">
			<header className="flex gap-x-5 items-center">
				<Link href="/identity-verification/verify">
					<Button
						variant="ghost"
						className="!p-0 size-6"
					>
						<ArrowLeft className="shrink-0 size-full" />
					</Button>
				</Link>
				<h1 className="font-semibold text-3xl">NIN Verification</h1>
			</header>
			<NINVerificationForm />
		</div>
	);
}
