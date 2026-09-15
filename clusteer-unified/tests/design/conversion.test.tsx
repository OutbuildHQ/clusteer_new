jest.mock("@tanstack/react-query", () => ({
	useQuery: () => ({ data: { buyRate: 1450, feePercent: 0.75 } }),
}));
import { BuyEntry } from "../../apps/customer/src/components/trade/buy-entry";
import { OrderReview } from "../../apps/customer/src/components/trade/order-review";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ConversionPreview } from "../../packages/ui/src/components/brand/conversion-preview";
import { WaitlistForm } from "../../packages/ui/src/components/brand/waitlist-form";
import { SettlementProgress } from "../../packages/ui/src/components/brand/quote-summary";

it("keeps fee and net payout consistent with the entered amount", () => {
	render(<ConversionPreview />);
	fireEvent.change(screen.getByLabelText("Try an amount"), { target: { value: "500" } });
	expect(screen.getByText("₦719,562.50")).toBeInTheDocument();
	expect(screen.getByText("₦5,437.50")).toBeInTheDocument();
	fireEvent.click(screen.getByRole("button", { name: "Explore the transfer" }));
	expect(screen.getByText("₦719,562.50")).toBeInTheDocument();
});

it("does not substitute a smaller quote for an out-of-range amount", () => {
	render(<ConversionPreview />);
	fireEvent.change(screen.getByLabelText("Try an amount"), { target: { value: "2000000" } });
	expect(screen.getByRole("alert")).toHaveTextContent("1 to 1,000,000");
	expect(screen.getByRole("button", { name: "Explore the transfer" })).toBeDisabled();
	expect(screen.queryByText("₦1,439,125.00")).not.toBeInTheDocument();
	fireEvent.click(screen.getByRole("tab", { name: "Your receipt" }));
	expect(screen.getByRole("tab", { name: "Your quote" })).toHaveAttribute("aria-selected", "true");
});

it("supports keyboard navigation through the demonstration", () => {
	render(<ConversionPreview />);
	fireEvent.keyDown(screen.getByRole("tab", { name: "Your quote" }), { key: "ArrowRight" });
	expect(screen.getByRole("tab", { name: "Your transfer" })).toHaveAttribute(
		"aria-selected",
		"true"
	);
	expect(screen.getByRole("tab", { name: "Your transfer" })).toHaveFocus();
});

it("marks every step complete when settlement finishes", () => {
	const { container } = render(
		<SettlementProgress
			current={3}
			labels={["Quote reviewed", "Payment received", "Wallet delivery confirmed"]}
		/>
	);
	expect(container.querySelectorAll('[data-state="complete"]')).toHaveLength(3);
	expect(container.querySelector('[aria-current="step"]')).toBeNull();
});

it("shows a recoverable waitlist error without claiming success", async () => {
	global.fetch = jest
		.fn()
		.mockResolvedValue({ ok: false, json: async () => ({ message: "Please try again later." }) });
	render(<WaitlistForm />);
	fireEvent.change(screen.getByLabelText("Email address"), {
		target: { value: "test@example.com" },
	});
	fireEvent.click(screen.getByRole("button", { name: "Join the waitlist" }));
	await waitFor(() =>
		expect(screen.getByRole("alert")).toHaveTextContent("Please try again later.")
	);
	expect(screen.getByRole("button", { name: "Join the waitlist" })).toBeEnabled();
	expect(screen.queryByText("You’re on the list.")).not.toBeInTheDocument();
});

it("shows confirmation only after the waitlist endpoint confirms success", async () => {
	global.fetch = jest.fn().mockResolvedValue({
		ok: true,
		json: async () => ({ status: true, message: "You will hear from us." }),
	});
	render(<WaitlistForm />);
	fireEvent.change(screen.getByLabelText("Email address"), {
		target: { value: "test@example.com" },
	});
	fireEvent.click(screen.getByRole("button", { name: "Join the waitlist" }));
	await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("You’re on the list."));
	expect(global.fetch).toHaveBeenCalledTimes(1);
});

it("keeps the entered buy budget inclusive of fees through review and preview order creation", async () => {
	const state = {
		side: "buy" as const,
		amount: 146087.5,
		channel: "TRC20" as const,
		destinationAddress: "DEMO-ADDRESS-DO-NOT-SEND",
	};
	const props = { state, updateState: jest.fn(), onContinue: jest.fn(), onSwitchSide: jest.fn() };
	const entry = render(
		<>
			<BuyEntry {...props} />
		</>
	);
	expect(screen.getByLabelText("Amount to convert")).toHaveValue("146087.5");
	expect(screen.getByText("100.000000")).toBeInTheDocument();
	expect(screen.getByText("₦1,087.50")).toBeInTheDocument();
	entry.unmount();
	const onOrderCreated = jest.fn();
	render(
		<>
			<OrderReview state={state} onBack={jest.fn()} onOrderCreated={onOrderCreated} />
		</>
	);
	expect(screen.getByText("₦146,087.50")).toBeInTheDocument();
	expect(screen.getByText("₦1,087.50")).toBeInTheDocument();
	fireEvent.click(screen.getByRole("button", { name: "Continue → Confirm with OTP" }));
	await waitFor(
		() =>
			expect(onOrderCreated).toHaveBeenCalledWith(
				expect.objectContaining({
					amountUsdt: 100,
					fee: 1087.5,
					paymentDetails: expect.objectContaining({ amountNgn: 146087.5 }),
				})
			),
		{ timeout: 2500 }
	);
});

it("explains connection failure and preserves the email for retry", async () => {
	global.fetch = jest.fn().mockRejectedValue(new TypeError("Failed to fetch"));
	render(<WaitlistForm />);
	fireEvent.change(screen.getByLabelText("Email address"), {
		target: { value: "test@example.com" },
	});
	fireEvent.click(screen.getByRole("button", { name: "Join the waitlist" }));
	await waitFor(() =>
		expect(screen.getByRole("alert")).toHaveTextContent("Check your connection and try again")
	);
	expect(screen.getByLabelText("Email address")).toHaveValue("test@example.com");
	expect(screen.getByRole("button", { name: "Join the waitlist" })).toBeEnabled();
	expect(screen.queryByText("Failed to fetch")).not.toBeInTheDocument();
});
