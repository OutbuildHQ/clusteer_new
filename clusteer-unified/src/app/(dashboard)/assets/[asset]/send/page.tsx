import SendAssetClient from "@/components/ui/send-asset-client";

export default async function Page({
	params,
}: {
	params: Promise<{ asset: string }>;
}) {
	const { asset } = await params;
	return <SendAssetClient asset={asset} />;
}
