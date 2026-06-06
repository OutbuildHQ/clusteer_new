import UpdateProfileForm from "@/components/forms/update-profile-form";

export default function Page() {
	return (
		<div className="space-y-6">
			<h1
				className="text-[32px] font-semibold tracking-[-0.03em] font-display"
				style={{ color: "var(--c-text)" }}
			>
				Profile
			</h1>
			<UpdateProfileForm />
		</div>
	);
}
