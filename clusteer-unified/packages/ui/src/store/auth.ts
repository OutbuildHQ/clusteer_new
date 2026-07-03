"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
	isAuthenticated: boolean;
	email: string | null;
	signIn: (email: string) => void;
	requireVerification: (email: string) => void;
	signOut: () => void;
};

export const useAuth = create<AuthState>()(
	persist(
		(set) => ({
			isAuthenticated: false,
			email: null,
			signIn: (email) => set({ isAuthenticated: true, email }),
			requireVerification: (email) => set({ email, isAuthenticated: false }),
			signOut: () => set({ isAuthenticated: false, email: null }),
		}),
		{ name: "clusteer-auth" },
	),
);
