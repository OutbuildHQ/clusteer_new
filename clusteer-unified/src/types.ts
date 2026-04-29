export interface IResponse<T = null> {
	status: boolean;
	message: string;
	data: T;
}

/** Blockchain network codes used for chain selection (NOT tradeable assets) */
export type Crypto = "TRON" | "ETH" | "BSC" | "SOL";

export type Fiat = "NGN";

export interface ICurrency {
	currency: string;
	icon: string;
	rate: number;
}

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
	currency?: string;
	dateCreated?: string;
	rate?: number;
	flow?: string;
	orderNumber?: string;
}

export interface IOrder {
	id: string;
	type: string;
	amount: number;
	status: string;
	date: string;
	crypto: string;
	fiat: string;
	chain?: string;
	dateOrdered?: string;
	rate?: number;
	paymentMethod?: string;
	number?: string;
	dateSettled?: string;
}

export interface PageParams {
	page: number;
	size: number;
}

export interface Auth2FARequest {
	twoFactorQR: string;
	twoFactorSecret: string;
}
