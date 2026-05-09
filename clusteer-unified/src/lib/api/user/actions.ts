import { UpdateProfileFormData } from "@/components/forms/update-profile-form";

async function updateUserProfile(payload: UpdateProfileFormData) {
	const res = await fetch("/api/user/profile/update", {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	if (!res.ok) {
		const data = await res.json().catch(() => ({}));
		throw new Error(data.message || "Failed to update profile");
	}
	return res.json();
}

async function updateUserAvatar(payload: FormData) {
	const res = await fetch("/api/user/avatar/update", {
		method: "PUT",
		body: payload,
	});
	if (!res.ok) {
		const data = await res.json().catch(() => ({}));
		throw new Error(data.message || "Failed to update avatar");
	}
	return res.json();
}

export async function updateUser(data: {
	profile: UpdateProfileFormData;
	avatar?: FormData | null;
}) {
	const { profile, avatar } = data;
	const promises: Promise<unknown>[] = [];

	if (profile) promises.push(updateUserProfile(profile));
	if (avatar) promises.push(updateUserAvatar(avatar));
	if (promises.length === 0) return;

	await Promise.all(promises);
}

export async function deleteUserAccount() {
	const res = await fetch("/api/user/delete", { method: "DELETE" });
	if (!res.ok) {
		const data = await res.json().catch(() => ({}));
		throw new Error(data.message || "Failed to delete account");
	}
	return res.json();
}
