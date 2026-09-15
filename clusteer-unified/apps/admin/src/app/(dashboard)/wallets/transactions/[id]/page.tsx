"use client";
import { useParams } from "next/navigation";
import { TransactionWorkspace } from "@/components/brand/transaction-workspace";
export default function TransactionDetailPage() {
	const params = useParams<{ id: string }>();
	return <TransactionWorkspace reference={params.id} />;
}
