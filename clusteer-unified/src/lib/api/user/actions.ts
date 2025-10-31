import { UpdateProfileFormData } from "@/components/forms/update-profile-form";
import apiClient from "@/lib/axios";
import { AxiosError } from "axios";

async function updateUserProfile(payload: UpdateProfileFormData) {
	try {
		const res = await apiClient.put("/user/profile/update", payload);
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

async function updateUserAvatar(payload: FormData) {
	try {
		const res = await apiClient.put("/user/avatar/update", payload, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

export async function updateUser(data: {
	profile: UpdateProfileFormData;
	avatar?: FormData | null;
}) {
	const { profile, avatar } = data;

	const promises = [];

	if (profile) {
		promises.push(updateUserProfile(profile));
	}

	if (avatar) {
		promises.push(updateUserAvatar(avatar));
	}

	if (promises.length === 0) return;

	await Promise.all(promises);
}

export async function deleteUserAccount() {
	try {
		const res = await apiClient.delete("/user/delete");
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}
