import { ChangePasswordFormData } from "@/components/forms/change-password-form";
import { ForgotPasswordFormData } from "@/components/forms/forgot-password-form";
import { LoginFormType } from "@/components/forms/login-form";
import { ResetPasswordPayload } from "@/components/forms/reset-password-form";
import { SignupFormData } from "@/components/forms/signup-form";
import apiClient from "@/lib/axios";
import { Auth2FARequest, IResponse, IUser } from "@/types";
import axios, { AxiosError } from "axios";

export async function loginUser(payload: LoginFormType) {
	try {
		const res = await axios.post<IResponse<IUser>>("/api/auth/login", payload);
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

export async function registerUser(payload: SignupFormData) {
	try {
		const res = await axios.post("/api/auth/register", payload);
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

export async function forgotPassword(payload: ForgotPasswordFormData) {
	try {
		const res = await apiClient.post("/user/account/recover", payload);
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

export async function resetPassword(payload: ResetPasswordPayload) {
	try {
		const res = await apiClient.post("/user/password/update", payload);
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

export async function changePassword(payload: ChangePasswordFormData) {
	try {
		const res = await apiClient.post("/user/password/update", payload);
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

export async function verifyOTP(payload: { username: string; otp: string }) {
	try {
		const res = await axios.post("/api/auth/verify-otp", payload);
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

export async function resendOTP(payload: { email: string }) {
	try {
		const res = await apiClient.post("/user/send-email-otp", payload);
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

export async function verifyEmail(token: string) {
	try {
		const res = await apiClient.put<IResponse>(`/user/verify?token=${token}`);
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

export async function resendEmailVerification(token: string) {
	try {
		const res = await apiClient.put<IResponse>(`/user/verify?token=${token}`);
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

export async function authRequest2FA() {
	try {
		const res = await apiClient.get<IResponse<Auth2FARequest>>(
			"/user/2fa/request"
		);
		return res.data.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

export async function verifyGoogleAuthOTP({
	username,
	payload,
}: {
	username: string;
	payload: { otp: string };
}) {
	try {
		const res = await apiClient.post(`/user/${username}/2fa/validate`, payload);
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

export async function changeEmail(payload: { email: string; otp: string }) {
	try {
		const res = await apiClient.post("/user/email/update", payload);
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

export async function sendEmailOTP(payload: { email: string }) {
	try {
		const res = await apiClient.post("/user/send-email-otp", payload);
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}
