import ReceiveAssetClient from "@/components/ui/receive-asset-client";

export default async function Page({
	params,
}: {
	params: Promise<{ asset: string }>;
}) {
	const { asset } = await params;
	return <ReceiveAssetClient asset={asset} />;
}
