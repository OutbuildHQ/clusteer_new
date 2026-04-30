"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Download, Eye, Shield, Cookie, Link2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Toast } from "@/components/toast";
import { useUser } from "@/store/user";
import {
	getPrivacySettings,
	updatePrivacySettings,
	createDataExportRequest,
} from "@/lib/api/settings";

export default function Page() {
	const user = useUser();
	const [preferences, setPreferences] = useState({
		profileVisibility: false,
		transactionHistory: false,
		analyticalCookies: true,
		marketingCookies: false,
		thirdPartySharing: false,
	});

	const [isDownloading, setIsDownloading] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		const fetchSettings = async () => {
			if (!user?.id) return;

			try {
				const data = await getPrivacySettings(user.id);
				setPreferences({
					profileVisibility: data.profile_visibility,
					transactionHistory: data.transaction_history_visibility,
					analyticalCookies: data.analytical_cookies,
					marketingCookies: data.marketing_cookies,
					thirdPartySharing: data.third_party_sharing,
				});
			} catch (error) {
				Toast.error("Failed to load privacy settings");
			} finally {
				setIsLoading(false);
			}
		};

		fetchSettings();
	}, [user?.id]);

	const handleToggle = async (key: keyof typeof preferences) => {
		if (!user?.id) return;

		const newValue = !preferences[key];
		setPreferences((prev) => ({
			...prev,
			[key]: newValue,
		}));

		setIsSaving(true);
		try {
			const updateData: Record<string, boolean> = {};
			if (key === "profileVisibility")
				updateData.profile_visibility = newValue;
			if (key === "transactionHistory")
				updateData.transaction_history_visibility = newValue;
			if (key === "analyticalCookies")
				updateData.analytical_cookies = newValue;
			if (key === "marketingCookies") updateData.marketing_cookies = newValue;
			if (key === "thirdPartySharing")
				updateData.third_party_sharing = newValue;

			await updatePrivacySettings(user.id, updateData);
			Toast.success("Privacy settings updated");
		} catch (error) {
			Toast.error("Failed to update privacy settings");
			// Revert on error
			setPreferences((prev) => ({
				...prev,
				[key]: !newValue,
			}));
		} finally {
			setIsSaving(false);
		}
	};

	const handleDownloadData = async () => {
		if (!user?.id) return;

		setIsDownloading(true);
		try {
			await createDataExportRequest(user.id, "full_data");
			Toast.success(
				"Your data export has been initiated. You'll receive an email when it's ready."
			);
		} catch (error) {
			Toast.error("Failed to initiate data export");
		} finally {
			setIsDownloading(false);
		}
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
						<div className="p-2 bg-primary/10 rounded-lg">
							<Eye className="w-5 h-5 text-primary" />
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
							<Switch
								checked={preferences.profileVisibility}
								onCheckedChange={() => handleToggle("profileVisibility")}
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
							<Switch
								checked={preferences.transactionHistory}
								onCheckedChange={() => handleToggle("transactionHistory")}
							/>
						</div>
					</div>
				</div>

				{/* Cookie Preferences */}
				<div className="bg-card rounded-2xl border border-border p-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="p-2 bg-primary/10 rounded-lg">
							<Cookie className="w-5 h-5 text-primary" />
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
							<Switch checked={true} disabled />
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
							<Switch
								checked={preferences.analyticalCookies}
								onCheckedChange={() => handleToggle("analyticalCookies")}
							/>
						</div>

						<div className="flex items-center justify-between py-3">
							<div>
								<p className="font-medium text-foreground">Marketing cookies</p>
								<p className="text-sm text-muted-foreground">
									Personalize ads and content
								</p>
							</div>
							<Switch
								checked={preferences.marketingCookies}
								onCheckedChange={() => handleToggle("marketingCookies")}
							/>
						</div>
					</div>
				</div>

				{/* Data Sharing */}
				<div className="bg-card rounded-2xl border border-border p-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="p-2 bg-primary/10 rounded-lg">
							<Link2 className="w-5 h-5 text-primary" />
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
							<Switch
								checked={preferences.thirdPartySharing}
								onCheckedChange={() => handleToggle("thirdPartySharing")}
							/>
						</div>
					</div>
				</div>

				{/* Data Download */}
				<div className="bg-card rounded-2xl border border-border p-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="p-2 bg-primary/10 rounded-lg">
							<Download className="w-5 h-5 text-primary" />
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

					<Button
						onClick={handleDownloadData}
						disabled={isDownloading}
						variant="outline"
						className="w-full lg:w-auto border-border h-10 px-6 rounded-full font-semibold"
					>
						<Download className="w-4 h-4 mr-2" />
						{isDownloading ? "Processing..." : "Request Data Download"}
					</Button>
				</div>

				{/* Privacy Policy Link */}
				<div className="bg-muted rounded-2xl border border-border p-5">
					<div className="flex items-center gap-3">
						<Shield className="w-5 h-5 text-primary" />
						<div>
							<p className="text-sm text-muted-foreground">
								Learn more about how we protect your data in our{" "}
								<a
									href="/privacy-policy"
									className="text-primary font-medium hover:underline"
								>
									Privacy Policy
								</a>{" "}
								and{" "}
								<a
									href="/terms"
									className="text-primary font-medium hover:underline"
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
