import UpdateProfileForm from "@/components/forms/update-profile-form";

export default function Page() {
	return (
		<div className="space-y-6">
			<h1
				className="text-[22px] lg:text-[32px] font-semibold leading-tight tracking-tight"
				style={{ color: "var(--c-text)", letterSpacing: "-0.03em" }}
			>
				Profile
			</h1>
			<UpdateProfileForm />
		</div>
	);
}
