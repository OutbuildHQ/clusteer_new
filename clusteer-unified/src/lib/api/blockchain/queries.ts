import apiClient from "@/lib/axios";
import { AxiosError } from "axios";
import { Stablecoin, IResponse, Fiat, Crypto, ExchangeRate } from "@/types";

export async function getAllBlockChains() {
	try {
		const res = await apiClient.get<IResponse<Stablecoin[]>>("/system/chains");
		return res.data.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

type GetExchangeRateParams = {
	baseCurrency: Crypto;
	targetCurrency: Fiat;
	amount: number;
};

export async function getExchangeRate({
	baseCurrency,
	targetCurrency,
	amount,
}: GetExchangeRateParams) {
	try {
		const res = await apiClient.get<IResponse<ExchangeRate>>(
			"/system/exchange-rate",
			{
				params: {
					baseCurrency,
					targetCurrency,
					amount,
				},
			}
		);
		return res.data.data;
	} catch (error) {
		throw error as AxiosError;
	}
}
