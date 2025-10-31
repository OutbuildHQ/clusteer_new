import { ArrowRight, Info } from "lucide-react";
import Link from "next/link";

interface BannerProps {
	title: string;
	description: string;
	link: string;
}

export default function Banner({ title, description, link }: BannerProps) {
	return (
		<div className="bg-[#F0EBE6] border-l-4 border-light-green w-full rounded-lg p-4 gap-x-3 flex font-avenir-next text-sm">
			<Info className="stroke-dark-green shrink-0 size-5" />
			<div>
				<span className="font-semibold">{title}</span>
				<p className="text-[#475467] mt-1">{description}</p>
				<Link
					href={link}
					className="text-start !p-0 mt-3 block !h-fit"
				>
					<div className="text-dark-green font-semibold flex items-center gap-x-2 italic">
						Verify
						<ArrowRight className="stroke-dark-green" />
					</div>
				</Link>
			</div>
		</div>
	);
}
