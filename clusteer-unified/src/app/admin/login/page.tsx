"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function AdminLoginPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

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
			if (!response.ok) throw new Error(data.error || "Login failed");
			router.push("/admin");
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Invalid credentials");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-custom-black flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center size-16 bg-light-green rounded-2xl border-2 border-light-green/50 mb-4">
						<Shield className="size-8 text-custom-black" />
					</div>
					<h1 className="text-2xl font-bold text-white">Admin Portal</h1>
					<p className="text-sm text-white/50 mt-2">
						Sign in to access the Clusteer admin dashboard
					</p>
				</div>

				<Card className="bg-white/5 border-white/10 backdrop-blur">
					<CardContent className="p-6 sm:p-8">
						{error && (
							<div role="alert" className="mb-6 p-4 bg-danger/10 border border-danger rounded-xl flex items-start gap-3">
								<AlertCircle className="size-5 text-danger shrink-0 mt-0.5" />
								<div>
									<p className="text-sm font-medium text-danger">Login Failed</p>
									<p className="text-sm text-danger/80 mt-1">{error}</p>
								</div>
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-1.5">
								<Label className="text-white/70">Email <span className="text-danger">*</span></Label>
								<Input
									type="email"
									required
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									placeholder="admin@clusteer.io"
									disabled={loading}
									className="bg-white/10 border-white/15 text-white placeholder:text-white/30 focus-visible:ring-light-green"
								/>
							</div>

							<div className="space-y-1.5">
								<Label className="text-white/70">Password <span className="text-danger">*</span></Label>
								<div className="relative">
									<Input
										type={showPassword ? "text" : "password"}
										required
										value={formData.password}
										onChange={(e) => setFormData({ ...formData, password: e.target.value })}
										placeholder="Enter your password"
										disabled={loading}
										className="bg-white/10 border-white/15 text-white placeholder:text-white/30 focus-visible:ring-light-green"
									/>
									<button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
										{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
									</button>
								</div>
							</div>

							<Button type="submit" disabled={loading} size="lg" className="w-full mt-2">
								{loading ? "Signing in…" : "Sign In"}
							</Button>
						</form>

						<div className="mt-6 p-3 bg-white/5 rounded-xl border border-white/10">
							<p className="text-xs text-white/30 text-center">
								All access attempts are logged and monitored.
							</p>
						</div>
					</CardContent>
				</Card>

				<div className="text-center mt-6">
					<Link href="/" className="text-sm text-white/40 hover:text-white/70 transition-colors">
						← Back to main site
					</Link>
				</div>
			</div>
		</div>
	);
}
