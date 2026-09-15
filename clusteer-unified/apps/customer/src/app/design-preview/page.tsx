import { notFound } from "next/navigation";
import { DesignPreview } from "./preview";
export const metadata = {
	title: "Clusteer — local design review",
	robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default function DesignPreviewPage() {
	if (process.env.NODE_ENV !== "development") notFound();
	return <DesignPreview />;
}
