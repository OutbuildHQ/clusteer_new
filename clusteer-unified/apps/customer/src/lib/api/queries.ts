import apiClient from "@/lib/axios";

export async function getExchangeRate(target = "NGN") {
	const res = await apiClient.get(`/system/exchange-rate?targetCurrency=${target}`);
	return res.data;
}

export async function submitTrade(payload: { side: string; amount: number; chain: string }) {
	const res = await apiClient.post("/trade", payload);
	return res.data;
}
