"use client";

import { Toast } from "@/components/toast";
import { IResponse } from "@/types";
import {
	MutationCache,
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type ErrorResponse = IResponse & { errors: string[] };

interface CustomMutationMeta extends Record<string, unknown> {
	skipGlobalErrorHandler?: boolean;
}

declare module "@tanstack/react-query" {
	interface Register {
		defaultError: AxiosError<ErrorResponse>;
		mutationMeta: CustomMutationMeta;
	}
}

export default function ReactQueryClientProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();

	const handleErrors = (error: AxiosError<ErrorResponse>) => {
		console.log(error);

		if (!error.response) {
			Toast.error("Something went wrong");
			return;
		}

		if (error.response.status === 403) {
			router.push("/login");
			return;
		}

		const data = error.response.data;
		Toast.error(data.message);
	};

	const [client] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						retry: 2,
						refetchOnWindowFocus: false,
						staleTime: 10 * 60 * 1000,
						gcTime: 60 * 60 * 1000,
					},
				},
				queryCache: new QueryCache({
					onError: (error) => handleErrors(error as AxiosError<ErrorResponse>),
				}),
				mutationCache: new MutationCache({
					onError: (error, _variables, _context, mutation) => {
						if (mutation.options.meta?.skipGlobalErrorHandler) return;
						handleErrors(error);
					},
				}),
			})
	);

	return (
		<QueryClientProvider client={client}>
			{children}
			{process.env.NODE_ENV === 'development' && (
				<ReactQueryDevtools initialIsOpen={false} />
			)}
		</QueryClientProvider>
	);
}
