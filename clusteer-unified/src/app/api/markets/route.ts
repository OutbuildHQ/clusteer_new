import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// CoinGecko Free API - no authentication required
const COINGECKO_API = "https://api.coingecko.com/api/v3";

// Cache market data for 2 minutes to avoid rate limiting
let cachedData: any = null;
let cacheTime: number = 0;
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

export async function GET(request: NextRequest) {
	try {
		// Check cache first
		const now = Date.now();
		if (cachedData && (now - cacheTime) < CACHE_DURATION) {
			return NextResponse.json({
				status: true,
				data: cachedData,
				cached: true,
			});
		}

		// Get query parameters
		const searchParams = request.nextUrl.searchParams;
		const limit = parseInt(searchParams.get("limit") || "20");
		const currency = searchParams.get("currency") || "usd";

		// Fetch top cryptocurrencies from CoinGecko
		const response = await axios.get(
			`${COINGECKO_API}/coins/markets`,
			{
				params: {
					vs_currency: currency,
					order: "market_cap_desc",
					per_page: limit,
					page: 1,
					sparkline: false,
					price_change_percentage: "24h",
				},
				timeout: 10000,
			}
		);

		// Transform CoinGecko data to our format
		const markets = response.data.map((coin: any, index: number) => ({
			id: coin.id,
			rank: index + 1,
			name: coin.name,
			symbol: coin.symbol.toUpperCase(),
			icon: coin.image,
			price: coin.current_price,
			change24h: coin.price_change_percentage_24h || 0,
			volume: coin.total_volume,
			marketCap: coin.market_cap,
			high24h: coin.high_24h,
			low24h: coin.low_24h,
			ath: coin.ath,
			atl: coin.atl,
		}));

		// Update cache
		cachedData = markets;
		cacheTime = now;

		return NextResponse.json({
			status: true,
			data: markets,
			cached: false,
		});
	} catch (error: any) {
		console.error("Markets fetch error:", error);

		// If CoinGecko API fails, return cached data if available
		if (cachedData) {
			return NextResponse.json({
				status: true,
				data: cachedData,
				cached: true,
				warning: "Using cached data due to API error",
			});
		}

		// Handle rate limiting
		if (error.response?.status === 429) {
			return NextResponse.json(
				{
					status: false,
					message: "Rate limit exceeded. Please try again later.",
				},
				{ status: 429 }
			);
		}

		// Handle network errors
		if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
			return NextResponse.json(
				{
					status: false,
					message: "Unable to fetch market data. Please try again later.",
				},
				{ status: 503 }
			);
		}

		return NextResponse.json(
			{
				status: false,
				message: error.response?.data?.error || "Failed to fetch market data",
			},
			{ status: error.response?.status || 500 }
		);
	}
}
