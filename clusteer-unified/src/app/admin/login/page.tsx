"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await fetch("/api/admin/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Login failed");
			}

			// Redirect to admin dashboard
			router.push("/admin");
		} catch (err: any) {
			setError(err.message || "Invalid credentials");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Logo & Title */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-[#014F01] rounded-2xl mb-4">
						<Shield className="w-8 h-8 text-white" />
					</div>
					<h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
					<p className="text-sm text-gray-600 mt-2">
						Sign in to access the Clusteer admin dashboard
					</p>
				</div>

				{/* Login Form */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
					{error && (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
							<AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
							<div>
								<p className="text-sm font-medium text-red-800">Login Failed</p>
								<p className="text-sm text-red-700 mt-1">{error}</p>
							</div>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Email Address
							</label>
							<input
								type="email"
								id="email"
								required
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent"
								placeholder="admin@clusteer.io"
								disabled={loading}
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Password
							</label>
							<input
								type="password"
								id="password"
								required
								value={formData.password}
								onChange={(e) =>
									setFormData({ ...formData, password: e.target.value })
								}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent"
								placeholder="Enter your password"
								disabled={loading}
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-[#014F01] text-white py-3 rounded-lg font-medium hover:bg-[#013d01] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Signing in..." : "Sign In"}
						</button>
					</form>

					{/* Security Notice */}
					<div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
						<p className="text-xs text-gray-600 text-center">
							🔒 This is a secure admin-only area. All access attempts are logged
							and monitored.
						</p>
					</div>
				</div>

				{/* Back to Main Site */}
				<div className="text-center mt-6">
					<a
						href="/"
						className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
					>
						← Back to main site
					</a>
				</div>
			</div>
		</div>
	);
}
