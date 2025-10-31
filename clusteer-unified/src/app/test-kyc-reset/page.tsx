"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TestKYCResetPage() {
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const handleReset = async () => {
		setLoading(true);
		setMessage("");

		try {
			const response = await fetch("/api/kyc/reset", {
				method: "POST",
			});

			const result = await response.json();

			if (result.status) {
				setMessage("✅ " + result.message);
				// Refresh page after 2 seconds
				setTimeout(() => {
					window.location.href = "/dashboard";
				}, 2000);
			} else {
				setMessage("❌ " + result.message);
			}
		} catch (error) {
			setMessage("❌ Error: " + error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
				<h1 className="text-2xl font-bold mb-4">KYC Testing Tools</h1>
				<p className="text-gray-600 mb-6">
					Reset your KYC verification status to test the verification flow again.
				</p>

				<Button
					onClick={handleReset}
					disabled={loading}
					className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
				>
					{loading ? "Resetting..." : "Reset KYC Verification"}
				</Button>

				{message && (
					<div className="mt-4 p-4 bg-gray-100 rounded-lg">
						<p className="text-sm">{message}</p>
					</div>
				)}

				<div className="mt-6 text-sm text-gray-500">
					<p className="font-semibold mb-2">⚠️ Testing Only</p>
					<p>This endpoint should be removed in production.</p>
				</div>
			</div>
		</div>
	);
}
