import { Toast } from "@/components/toast";

type ToastProps = {
	title?: string;
	description?: string;
	variant?: "default" | "destructive";
};

export function useToast() {
	const toast = ({ title, description, variant }: ToastProps) => {
		const message = description || title || "";

		if (variant === "destructive") {
			Toast.error(message);
		} else {
			Toast.success(message);
		}
	};

	return { toast };
}
