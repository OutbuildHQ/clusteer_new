import { NextResponse } from "next/server";

// Available blockchain networks
const chains = [
	{
		id: "1",
		name: "Ethereum",
		symbol: "ETH",
		network: "ERC-20",
		icon: "/assets/images/ethereum.svg",
		isActive: true,
	},
	{
		id: "2",
		name: "Binance Smart Chain",
		symbol: "BNB",
		network: "BEP-20",
		icon: "/assets/images/binance.svg",
		isActive: true,
	},
	{
		id: "3",
		name: "Tron",
		symbol: "TRX",
		network: "TRC-20",
		icon: "/assets/images/tron.svg",
		isActive: true,
	},
	{
		id: "4",
		name: "Polygon",
		symbol: "MATIC",
		network: "Polygon",
		icon: "/assets/images/polygon.svg",
		isActive: true,
	},
	{
		id: "5",
		name: "Solana",
		symbol: "SOL",
		network: "Solana",
		icon: "/assets/images/solana.svg",
		isActive: true,
	},
];

export async function GET() {
	try {
		return NextResponse.json({
			status: true,
			data: chains,
		});
	} catch (error) {
		console.error("Chains fetch error:", error);
		return NextResponse.json(
			{ status: false, message: "Failed to fetch chains" },
			{ status: 500 }
		);
	}
}
