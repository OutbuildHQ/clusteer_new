import apiClient from "@/lib/axios";
import { IOrder, IResponse, ITransaction, IUser, PageParams } from "@/types";
import { AxiosError } from "axios";

export async function getUserInfo(): Promise<IUser | undefined> {
	const res = await fetch("/api/user/profile");
	if (!res.ok) throw new Error("Failed to fetch profile");
	const data = await res.json();
	return data.data as IUser;
}

export type TransactionsResponse = {
	status: boolean;
	data: ITransaction[];
	metadata: {
		page: number;
		size: number;
		totalItems: number;
		totalPages: number;
	};
};

export async function getAllTransactions(pageParams: PageParams) {
	try {
		const res = await apiClient.get<TransactionsResponse>(`/transaction/user`, {
			params: {
				...pageParams,
			},
		});
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

type OrdersResponse = {
	status: boolean;
	data: IOrder[];
	metadata: {
		page: number;
		size: number;
		totalItems: number;
		totalPages: number;
	};
};

export async function getAllOrders(pageParams: PageParams) {
	try {
		const res = await apiClient.get<OrdersResponse>(`/order`, {
			params: {
				...pageParams,
			},
		});
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}
