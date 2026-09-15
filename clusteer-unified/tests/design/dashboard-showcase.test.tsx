import { render, screen, fireEvent, within } from "@testing-library/react";
import { CustomerDashboardShowcase } from "../../apps/customer/src/components/app/customer-dashboard-showcase";
import { ProductWalkthrough } from "../../packages/ui/src/components/brand/product-walkthrough";

it("renders the shared customer dashboard without an account-query provider", () => {
	const { container } = render(<CustomerDashboardShowcase />);
	expect(screen.getByRole("heading", { name: "Welcome back, Aisha." })).toBeInTheDocument();
	expect(screen.getByRole("button", { name: "Buy / Sell" })).toBeInTheDocument();
	expect(screen.getByRole("button", { name: "Convert to naira" })).toBeInTheDocument();
	expect(container.querySelectorAll("a")).toHaveLength(0);
	expect(screen.getByText(/USDC \/ ERC20/)).toBeInTheDocument();
	expect(screen.getByText("₦359,781.25")).toBeInTheDocument();
	expect(screen.queryByText(/Design preview/)).not.toBeInTheDocument();
});

it("preserves the chosen network through transfer and resets USDC to its available network", () => {
	render(<ProductWalkthrough />);
	fireEvent.change(screen.getByLabelText("Network"), { target: { value: "BEP20" } });
	fireEvent.click(screen.getByRole("button", { name: "Continue to transfer" }));
	expect(screen.getByText("USDT · BNB Smart Chain (BEP-20)")).toBeInTheDocument();
	fireEvent.click(screen.getByRole("tab", { name: "1 Quote" }));
	fireEvent.change(screen.getByRole("combobox", { name: "Stablecoin" }), {
		target: { value: "USDC" },
	});
	expect(screen.getByLabelText("Network")).toHaveValue("ERC20");
	fireEvent.click(screen.getByRole("button", { name: "Continue to transfer" }));
	expect(screen.getByText("USDC · Ethereum (ERC-20)")).toBeInTheDocument();
});

it("keeps conversion, order details and Back navigation inside the frame", () => {
	const { container } = render(<CustomerDashboardShowcase />);
	const initialUrl = window.location.href;
	fireEvent.click(screen.getByRole("button", { name: "Convert to naira" }));
	fireEvent.change(screen.getByLabelText("Amount in USDT"), { target: { value: "250" } });
	fireEvent.click(screen.getByRole("button", { name: "Continue to transfer" }));
	fireEvent.click(screen.getByRole("button", { name: "View receipt" }));
	expect(screen.getByRole("heading", { name: "Conversion complete" })).toBeInTheDocument();
	fireEvent.click(screen.getByRole("button", { name: "Orders", exact: true }));
	fireEvent.click(screen.getByRole("button", { name: "Completed", exact: true }));
	expect(screen.queryByText("Confirming")).not.toBeInTheDocument();
	fireEvent.click(screen.getByRole("button", { name: /CL-7B4D2916/ }));
	expect(screen.getByRole("heading", { name: "Order details" })).toBeInTheDocument();
	expect(screen.getByText("Ethereum (ERC-20)")).toBeInTheDocument();
	fireEvent.click(screen.getByRole("button", { name: "Back within dashboard" }));
	expect(screen.getByRole("heading", { name: "Your orders" })).toBeInTheDocument();
	fireEvent.click(screen.getByRole("button", { name: "Buy / Sell", exact: true }));
	expect(screen.getByRole("heading", { name: "Conversion complete" })).toBeInTheDocument();
	expect(window.location.href).toBe(initialUrl);
	expect(container.querySelectorAll("a")).toHaveLength(0);
});

it("opens every sidebar section locally and supports account preferences and help", () => {
	const { container } = render(<CustomerDashboardShowcase />);
	for (const [button, heading] of [
		["History", "Transaction history"],
		["Billing", "Billing"],
		["Identity", "Identity"],
		["Notifications", "Notifications"],
		["Referrals", "Referrals & rewards"],
		["Settings", "Settings"],
		["Support", "Support"],
	]) {
		fireEvent.click(screen.getByRole("button", { name: button, exact: true }));
		expect(screen.getByRole("heading", { name: heading, exact: true })).toBeInTheDocument();
		expect(container.querySelectorAll("a")).toHaveLength(0);
	}
	fireEvent.change(screen.getByRole("searchbox", { name: "Search dashboard help" }), {
		target: { value: "unmatchedword" },
	});
	expect(screen.getByRole("status")).toHaveTextContent("No matching answers");
	fireEvent.click(screen.getByRole("button", { name: "Settings", exact: true }));
	fireEvent.click(screen.getByRole("checkbox", { name: "Product news" }));
	fireEvent.click(screen.getByRole("button", { name: "Save preferences" }));
	expect(screen.getByRole("status")).toHaveTextContent("Preferences updated");
	fireEvent.click(screen.getByRole("button", { name: "Overview", exact: true }));
	fireEvent.change(screen.getByRole("combobox", { name: "Dashboard section" }), {
		target: { value: "/settings" },
	});
	expect(screen.getByRole("checkbox", { name: "Product news" })).toBeChecked();
});

it("labels a preserved buy flow as a return instead of starting a sell conversion", () => {
	render(<CustomerDashboardShowcase />);
	fireEvent.click(screen.getByRole("button", { name: "Convert to naira" }));
	fireEvent.click(screen.getByRole("button", { name: "Buy", exact: true }));
	fireEvent.change(screen.getByLabelText("Amount in USDT"), { target: { value: "250" } });
	fireEvent.click(screen.getByRole("button", { name: "Continue to transfer" }));
	fireEvent.click(screen.getByRole("button", { name: "Overview", exact: true }));
	expect(screen.queryByRole("button", { name: "Convert to naira" })).not.toBeInTheDocument();
	fireEvent.click(screen.getByRole("button", { name: "Return to conversion" }));
	expect(screen.getByRole("button", { name: "Buy", exact: true })).toHaveAttribute(
		"aria-pressed",
		"true"
	);
	expect(screen.getByRole("tab", { name: "2 Transfer" })).toHaveAttribute("aria-selected", "true");
	fireEvent.click(screen.getByRole("button", { name: "View receipt" }));
	fireEvent.click(screen.getByRole("button", { name: "Overview", exact: true }));
	fireEvent.click(screen.getByRole("button", { name: "Return to conversion" }));
	expect(screen.getByRole("heading", { name: "Conversion complete" })).toBeInTheDocument();
});

it("shares a completed buy receipt with activity, history and its order detail", () => {
	render(<CustomerDashboardShowcase />);
	fireEvent.click(screen.getByRole("button", { name: "Convert to naira" }));
	fireEvent.click(screen.getByRole("button", { name: "Buy", exact: true }));
	fireEvent.change(screen.getByRole("combobox", { name: "Stablecoin" }), {
		target: { value: "USDC" },
	});
	fireEvent.change(screen.getByLabelText("Amount in USDC"), { target: { value: "250" } });
	fireEvent.click(screen.getByRole("button", { name: "Continue to transfer" }));
	expect(screen.getAllByText("You receive")).toHaveLength(1);
	fireEvent.click(screen.getByRole("button", { name: "View receipt" }));
	const reference = screen.getByText(/^CL-[A-F0-9]{16}$/).textContent!;
	fireEvent.click(screen.getByRole("button", { name: "Overview", exact: true }));
	const activity = screen.getByRole("button", { name: new RegExp(reference) });
	expect(activity).toHaveTextContent("Naira to stablecoins");
	expect(activity).toHaveTextContent("USDC / ERC20");
	expect(activity).toHaveTextContent("₦365,218.75");
	expect(activity).toHaveTextContent("Completed");
	expect(screen.getByRole("button", { name: /CL-9F2A3D81/ })).toHaveTextContent("Confirming");
	fireEvent.click(activity);
	expect(screen.getByRole("heading", { name: "Order details" })).toBeInTheDocument();
	const detail = screen.getByRole("heading", { name: "Order details" }).closest("section")!;
	expect(within(detail).getByText("Ethereum wallet ••12F3")).toBeInTheDocument();
	expect(within(detail).getByText("₦365,218.75")).toBeInTheDocument();
	fireEvent.click(screen.getByRole("button", { name: "History", exact: true }));
	expect(screen.getAllByRole("button", { name: new RegExp(reference) })).toHaveLength(1);
});

it("records each completion once and gives another conversion a distinct reference", () => {
	const onComplete = jest.fn();
	render(<ProductWalkthrough onComplete={onComplete} />);
	fireEvent.click(screen.getByRole("tab", { name: "3 Receipt" }));
	const first = onComplete.mock.calls[0][0];
	expect(first).toMatchObject({
		side: "sell",
		asset: "USDT",
		channel: "TRC20",
		amountUsdt: 100,
		status: "completed",
	});
	fireEvent.click(screen.getByRole("tab", { name: "1 Quote" }));
	fireEvent.click(screen.getByRole("tab", { name: "3 Receipt" }));
	expect(onComplete).toHaveBeenCalledTimes(1);
	fireEvent.click(screen.getByRole("button", { name: "Start another conversion" }));
	fireEvent.change(screen.getByLabelText("Amount in USDT"), { target: { value: "0" } });
	fireEvent.click(screen.getByRole("tab", { name: "3 Receipt" }));
	expect(onComplete).toHaveBeenCalledTimes(1);
	fireEvent.change(screen.getByLabelText("Amount in USDT"), { target: { value: "100" } });
	fireEvent.click(screen.getByRole("tab", { name: "3 Receipt" }));
	expect(onComplete).toHaveBeenCalledTimes(2);
	expect(onComplete.mock.calls[1][0].id).not.toBe(first.id);
});
