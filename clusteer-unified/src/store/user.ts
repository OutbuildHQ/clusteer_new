import { IUser } from "@/types";
import { create } from "zustand";

interface UserStore {
	user: IUser | null;
	actions: {
		setUser: (user: IUser) => void;
		logout: () => void;
	};
}

const useUserStore = create<UserStore>((set) => ({
	user: null,
	actions: {
		setUser: (user) => set({ user }),
		logout: () => set({ user: null }),
	},
}));

export const useUser = () => useUserStore((state) => state.user);

export const useUserActions = () => useUserStore((s) => s.actions);
