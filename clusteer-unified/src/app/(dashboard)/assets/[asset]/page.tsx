import AssetClient from "@/components/asset-client";

export default async function Page({
	params,
}: {
	params: Promise<{ asset: string }>;
}) {
	const { asset } = await params;
	return <AssetClient asset={asset} />;
}
