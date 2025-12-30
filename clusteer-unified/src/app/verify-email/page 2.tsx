import VerifyEmail from "@/components/verify-email";
import { redirect } from "next/navigation";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ token?: string }>;
}) {
	const { token } = await searchParams;

	if (!token) {
		redirect("/login");
	}

	return <VerifyEmail token={token} />;
}
