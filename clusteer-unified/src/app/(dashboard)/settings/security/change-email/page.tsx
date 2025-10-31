import ChangeEmailForm from "@/components/forms/change-email-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
	return (
		<section className="mt-5 lg:mt-10 pb-[113px] xl:pb-[140px]">
			<header className="flex gap-x-5 items-center py-5 border-b lg:py-0 lg:border-b-0 border-[#21241D33] mb-4">
				<Link href="/security">
					<ArrowLeft className="shrink-0 size-full" />
				</Link>
				<h1 className="text-[#181D27] font-semibold text-xl sm:text2xl">
					Change email address
				</h1>
			</header>
			<div className="lg:max-w-[533px]">
				<ChangeEmailForm />
			</div>
		</section>
	);
}
