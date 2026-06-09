import apiClient from "@/lib/axios";
import { AxiosError } from "axios";

export async function updateFCMToken(payload: { fcmToken: string }) {
	try {
		const res = await apiClient.put("/user/fcm/update", payload);
		return res.data;
	} catch (error) {
		console.log(error);
		throw error as AxiosError;
	}
}
