import { PageIntro, ResourceLink } from "@/components/brand/marketing-sections";
import { getSystemStatus, type ServiceStatus } from "@/lib/system-status";
export const dynamic = "force-dynamic";
export const metadata = {
	title: "Service status — Clusteer",
	description: "Recent reachability checks for Clusteer services.",
};
const labels: Record<ServiceStatus, string> = {
	operational: "Reachable",
	degraded: "Slow response",
	down: "Unreachable",
	"pre-launch": "Not verified",
};
export default async function StatusPage() {
	const status = await getSystemStatus();
	const checked = new Date(status.checkedAt).toLocaleString("en-GB", {
		timeZone: "Africa/Lagos",
		dateStyle: "medium",
		timeStyle: "short",
	});
	return (
		<main>
			<PageIntro
				eyebrow="Service status"
				title={
					status.overall === "operational"
						? "Our latest service checks."
						: "Some services need attention."
				}
				description="A recent view of service reachability. These checks do not confirm the status of an individual conversion."
			/>
			<section className="cl-container cl-status-content">
				<div className="cl-status-heading">
					<p>Last checked: {checked} WAT</p>
					<a className="cl-button cl-button-outline" href="/status">
						Refresh checks
					</a>
				</div>
				<div className="cl-service-list">
					{status.services.map((service) => (
						<article key={service.key}>
							<div>
								<h2>{service.name}</h2>
								<p>{service.description}</p>
							</div>
							<span className={`cl-service-state is-${service.status}`}>
								<i aria-hidden="true" />
								{labels[service.status]}
							</span>
						</article>
					))}
				</div>
				<p className="cl-status-note">
					Checks may be cached for up to a minute. “Not verified” means a service could not be
					independently checked here; it is not confirmation that the service is down.
				</p>
				<ResourceLink href="/contact">Get help with an order</ResourceLink>
			</section>
		</main>
	);
}
