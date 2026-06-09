import Image from "next/image";
import { Alert, AlertDescription } from "./ui/alert";

export default function SecurityAlert({ content }: { content: string }) {
	return (
		<Alert className="bg-[#FEF5E6] p-4 flex gap-x-3 border-0 rounded-md">
			<Image
				src="/assets/icons/alert_lightbulb.svg"
				alt="alert lightbulb icon"
				width={20}
				height={20}
			/>
			<AlertDescription className="text-[#FE754B]">{content}</AlertDescription>
		</Alert>
	);
}
