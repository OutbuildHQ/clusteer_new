"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
	isAuthenticated: boolean;
	email: string | null;
	twoFactorPending: boolean;
	signIn: (email: string) => void;
	requireTwoFactor: (email: string) => void;
	completeTwoFactor: () => void;
	signOut: () => void;
};

export const useAuth = create<AuthState>()(
	persist(
		(set) => ({
			isAuthenticated: false,
			email: null,
			twoFactorPending: false,
			signIn: (email) => set({ isAuthenticated: true, email, twoFactorPending: false }),
			requireTwoFactor: (email) => set({ email, twoFactorPending: true, isAuthenticated: false }),
			completeTwoFactor: () => set({ twoFactorPending: false, isAuthenticated: true }),
			signOut: () => set({ isAuthenticated: false, email: null, twoFactorPending: false }),
		}),
		{ name: "clusteer-auth" },
	),
);
