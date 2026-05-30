"use client";

import { Download, Eye, Shield, Cookie, Link2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUserId } from "@/hooks/use-user-id";
import {
	getPrivacySettings,
	updatePrivacySettings,
	createDataExportRequest,
} from "@/lib/api/settings";

interface LocalPrivacySettings {
	profileVisibility: boolean;
	transactionHistory: boolean;
	analyticalCookies: boolean;
	marketingCookies: boolean;
	thirdPartySharing: boolean;
}

const DEFAULT_SETTINGS: LocalPrivacySettings = {
	profileVisibility: false,
	transactionHistory: false,
	analyticalCookies: true,
	marketingCookies: false,
	thirdPartySharing: false,
};

const KEY_MAP: Record<keyof LocalPrivacySettings, string> = {
	profileVisibility: "profile_visibility",
	transactionHistory: "transaction_history_visibility",
	analyticalCookies: "analytical_cookies",
	marketingCookies: "marketing_cookies",
	thirdPartySharing: "third_party_sharing",
};

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange?: () => void; disabled?: boolean }) {
	return (
		<div
			role="switch"
			aria-checked={checked}
			onClick={disabled ? undefined : onChange}
			style={{
				width: "44px",
				height: "24px",
				borderRadius: "9999px",
				background: checked ? "var(--c-accent, #9FE870)" : "var(--c-border, #d1d5db)",
				cursor: disabled ? "not-allowed" : "pointer",
				opacity: disabled ? 0.5 : 1,
				position: "relative",
				transition: "background 0.2s",
				flexShrink: 0,
			}}
		>
			<div
				style={{
					position: "absolute",
					top: "2px",
					left: checked ? "22px" : "2px",
					width: "20px",
					height: "20px",
					borderRadius: "9999px",
					background: "#fff",
					transition: "left 0.2s",
					boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
				}}
			/>
		</div>
	);
}

export default function Page() {
	const userId = useUserId();

	const { data: apiSettings, isLoading, isError } = useQuery({
		queryKey: ["privacy-settings", userId],
		queryFn: () => getPrivacySettings(userId!),
		enabled: !!userId,
	});

	const [preferences, setPreferences] = useState<LocalPrivacySettings>(DEFAULT_SETTINGS);

	useEffect(() => {
		if (apiSettings) {
			setPreferences({
				profileVisibility: apiSettings.profile_visibility,
				transactionHistory: apiSettings.transaction_history_visibility,
				analyticalCookies: apiSettings.analytical_cookies,
				marketingCookies: apiSettings.marketing_cookies,
				thirdPartySharing: apiSettings.third_party_sharing,
			});
		}
	}, [apiSettings]);

	const toggleMutation = useMutation({
		mutationFn: (update: Record<string, boolean>) =>
			updatePrivacySettings(userId!, update),
		onSuccess: () => {
			toast.success("Privacy settings updated");
		},
		onError: (_err, variables) => {
			toast.error("Failed to update privacy settings");
			// Revert the optimistic update
			if (apiSettings) {
				setPreferences({
					profileVisibility: apiSettings.profile_visibility,
					transactionHistory: apiSettings.transaction_history_visibility,
					analyticalCookies: apiSettings.analytical_cookies,
					marketingCookies: apiSettings.marketing_cookies,
					thirdPartySharing: apiSettings.third_party_sharing,
				});
			}
		},
	});

	const exportMutation = useMutation({
		mutationFn: () => createDataExportRequest(userId!, "full_data"),
		onSuccess: () => {
			toast.success(
				"Your data export has been initiated. You'll receive an email when it's ready."
			);
		},
		onError: () => {
			toast.error("Failed to initiate data export");
		},
	});

	const handleToggle = (key: keyof LocalPrivacySettings) => {
		if (!userId) return;

		const newValue = !preferences[key];
		// Optimistic update
		setPreferences((prev) => ({ ...prev, [key]: newValue }));

		const apiKey = KEY_MAP[key];
		toggleMutation.mutate({ [apiKey]: newValue });
	};

	if (isLoading) {
		return (
			<section className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8">
				<header className="mb-6">
					<h1 className="text-foreground font-semibold text-xl lg:text-2xl">
						Privacy & Data
					</h1>
					<p className="text-sm lg:text-base text-muted-foreground mt-2">
						Loading your privacy settings...
					</p>
				</header>
			</section>
		);
	}

	if (isError) {
		return (
			<section className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8">
				<header className="mb-6">
					<h1 className="text-foreground font-semibold text-xl lg:text-2xl">
						Privacy & Data
					</h1>
					<p className="text-sm lg:text-base text-muted-foreground mt-2">
						Failed to load privacy settings. Please refresh the page.
					</p>
				</header>
			</section>
		);
	}

	return (
		<section className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8">
			<header className="mb-6">
				<h1 className="text-foreground font-semibold text-xl lg:text-2xl">
					Privacy & Data
				</h1>
				<p className="text-sm lg:text-base text-muted-foreground mt-2">
					Control your privacy settings and manage your personal data
				</p>
			</header>

			<div className="space-y-6">
				{/* Profile Privacy */}
				<div className="bg-card rounded-2xl border border-border p-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="p-2 bg-[var(--c-lime-500)]/10 rounded-lg">
							<Eye className="w-5 h-5 text-[var(--c-lime-500)]" />
						</div>
						<div>
							<h2 className="font-semibold text-lg text-foreground">
								Profile Privacy
							</h2>
							<p className="text-sm text-muted-foreground">
								Control who can see your profile information
							</p>
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between py-3 border-b border-border">
							<div>
								<p className="font-medium text-foreground">Public profile</p>
								<p className="text-sm text-muted-foreground">
									Allow others to view your public profile
								</p>
							</div>
							<Toggle
								checked={preferences.profileVisibility}
								onChange={() => handleToggle("profileVisibility")}
								disabled={toggleMutation.isPending}
							/>
						</div>

						<div className="flex items-center justify-between py-3">
							<div>
								<p className="font-medium text-foreground">
									Transaction history visibility
								</p>
								<p className="text-sm text-muted-foreground">
									Show transaction history on your profile
								</p>
							</div>
							<Toggle
								checked={preferences.transactionHistory}
								onChange={() => handleToggle("transactionHistory")}
								disabled={toggleMutation.isPending}
							/>
						</div>
					</div>
				</div>

				{/* Cookie Preferences */}
				<div className="bg-card rounded-2xl border border-border p-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="p-2 bg-[var(--c-lime-500)]/10 rounded-lg">
							<Cookie className="w-5 h-5 text-[var(--c-lime-500)]" />
						</div>
						<div>
							<h2 className="font-semibold text-lg text-foreground">
								Cookie Preferences
							</h2>
							<p className="text-sm text-muted-foreground">
								Manage how we use cookies on your device
							</p>
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between py-3 border-b border-border">
							<div>
								<p className="font-medium text-foreground">
									Essential cookies
									<span className="ml-2 text-xs text-muted-foreground">(Required)</span>
								</p>
								<p className="text-sm text-muted-foreground">
									Necessary for the platform to function properly
								</p>
							</div>
							<Toggle checked={true} disabled />
						</div>

						<div className="flex items-center justify-between py-3 border-b border-border">
							<div>
								<p className="font-medium text-foreground">
									Analytical cookies
								</p>
								<p className="text-sm text-muted-foreground">
									Help us improve by analyzing usage patterns
								</p>
							</div>
							<Toggle
								checked={preferences.analyticalCookies}
								onChange={() => handleToggle("analyticalCookies")}
								disabled={toggleMutation.isPending}
							/>
						</div>

						<div className="flex items-center justify-between py-3">
							<div>
								<p className="font-medium text-foreground">Marketing cookies</p>
								<p className="text-sm text-muted-foreground">
									Personalize ads and content
								</p>
							</div>
							<Toggle
								checked={preferences.marketingCookies}
								onChange={() => handleToggle("marketingCookies")}
								disabled={toggleMutation.isPending}
							/>
						</div>
					</div>
				</div>

				{/* Data Sharing */}
				<div className="bg-card rounded-2xl border border-border p-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="p-2 bg-[var(--c-lime-500)]/10 rounded-lg">
							<Link2 className="w-5 h-5 text-[var(--c-lime-500)]" />
						</div>
						<div>
							<h2 className="font-semibold text-lg text-foreground">
								Data Sharing
							</h2>
							<p className="text-sm text-muted-foreground">
								Control how your data is shared
							</p>
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between py-3">
							<div>
								<p className="font-medium text-foreground">
									Third-party data sharing
								</p>
								<p className="text-sm text-muted-foreground">
									Share anonymized data with trusted partners
								</p>
							</div>
							<Toggle
								checked={preferences.thirdPartySharing}
								onChange={() => handleToggle("thirdPartySharing")}
								disabled={toggleMutation.isPending}
							/>
						</div>
					</div>
				</div>

				{/* Data Download */}
				<div className="bg-card rounded-2xl border border-border p-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="p-2 bg-[var(--c-lime-500)]/10 rounded-lg">
							<Download className="w-5 h-5 text-[var(--c-lime-500)]" />
						</div>
						<div>
							<h2 className="font-semibold text-lg text-foreground">
								Download Your Data
							</h2>
							<p className="text-sm text-muted-foreground">
								Request a copy of your personal data
							</p>
						</div>
					</div>

					<div className="bg-muted rounded-xl border border-border p-4 mb-4">
						<p className="text-sm text-muted-foreground">
							You can download a copy of all your personal data stored on
							Clusteer. This includes your profile information, transaction
							history, and account settings. The download will be sent to your
							registered email address within 48 hours.
						</p>
					</div>

					<button
						onClick={() => exportMutation.mutate()}
						disabled={exportMutation.isPending}
						style={{
							background: "transparent",
							color: "var(--c-fg, inherit)",
							border: "1px solid var(--c-border, #e5e5e5)",
							height: "40px",
							padding: "0 24px",
							borderRadius: "9999px",
							fontWeight: 600,
							fontSize: "14px",
							cursor: exportMutation.isPending ? "not-allowed" : "pointer",
							opacity: exportMutation.isPending ? 0.5 : 1,
							display: "inline-flex",
							alignItems: "center",
							gap: "8px",
						}}
					>
						<Download className="w-4 h-4" />
						{exportMutation.isPending ? "Processing..." : "Request Data Download"}
					</button>
				</div>

				{/* Privacy Policy Link */}
				<div className="bg-muted rounded-2xl border border-border p-5">
					<div className="flex items-center gap-3">
						<Shield className="w-5 h-5 text-[var(--c-lime-500)]" />
						<div>
							<p className="text-sm text-muted-foreground">
								Learn more about how we protect your data in our{" "}
								<a
									href="/privacy-policy"
									className="text-[var(--c-lime-500)] font-medium hover:underline"
								>
									Privacy Policy
								</a>{" "}
								and{" "}
								<a
									href="/terms"
									className="text-[var(--c-lime-500)] font-medium hover:underline"
								>
									Terms of Service
								</a>
								.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
