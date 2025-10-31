import { create } from "zustand";

export interface BreadcrumbItem {
	label: string;
	href: string;
}

interface BreadcrumbStore {
	breadcrumbs: BreadcrumbItem[];
	actions: {
		setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
		addBreadcrumb: (breadcrumb: BreadcrumbItem) => void;
		clearBreadcrumbs: () => void;
	};
}

export const useBreadcrumbStore = create<BreadcrumbStore>((set) => ({
	breadcrumbs: [],
	actions: {
		setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
		addBreadcrumb: (breadcrumb) =>
			set((state) => ({
				breadcrumbs: [...state.breadcrumbs, breadcrumb],
			})),
		clearBreadcrumbs: () => set({ breadcrumbs: [] }),
	},
}));

export const useBreadcrumbs = () =>
	useBreadcrumbStore((state) => state.breadcrumbs);

export const useBreadcrumbActions = () =>
	useBreadcrumbStore((state) => state.actions);
