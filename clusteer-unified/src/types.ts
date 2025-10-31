export interface IResponse<T = null> {
	status: boolean;
	message: string;
	data: T;
}

export type Crypto = "SOL" | "TRON" | "ETH" | "BSC";

export type Fiat = "NGN";

export interface Stablecoin {
	id: number;
	name: string;
	code: Crypto;
	// fee: 0.5;
	active: boolean;
	// dateCreated: "2025-07-19 20:42:01";
}

export interface ExchangeRate {
	base: Crypto;
	destination: Fiat;
	purchase: number;
	sale: number;
}

export interface IUser {
	id: string;
	username: string;
	email: string;
	phone?: string;
	firstName?: string;
	lastName?: string;
	avatar?: string;
	is_verified: boolean; // KYC verification status
	emailVerified?: boolean; // Email confirmation status
	twoFactorEnabled?: boolean; // 2FA status
	dateJoined?: string;
	created_at?: string;
	updated_at?: string;
}

export interface ITransaction {
	id: string;
	type: string;
	amount: number;
	status: string;
	date: string;
	description?: string;
}

export interface IOrder {
	id: string;
	type: string;
	amount: number;
	status: string;
	date: string;
	crypto: string;
	fiat: string;
}

export interface PageParams {
	page: number;
	size: number;
}

export interface Auth2FARequest {
	twoFactorQR: string;
	twoFactorSecret: string;
}
