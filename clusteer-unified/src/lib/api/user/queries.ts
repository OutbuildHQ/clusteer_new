import apiClient from "@/lib/axios";
import { IOrder, IResponse, ITransaction, IUser, PageParams } from "@/types";
import { AxiosError } from "axios";

export async function getUserInfo() {
	try {
		const res = await apiClient.get<IResponse<IUser>>("/user/profile");
		return res.data.data;
	} catch (error) {
		throw error as AxiosError;
	}
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
