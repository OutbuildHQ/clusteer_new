import { fireEvent, render, screen } from "@testing-library/react";
import { ProductWalkthrough } from "../../packages/ui/src/components/brand/product-walkthrough";
import { HelpCenter } from "../../packages/ui/src/components/brand/help-center";

it("keeps the selected amount and quote through the receipt, with keyboard focus preserved", () => {
	render(<ProductWalkthrough />);
	fireEvent.change(screen.getByLabelText("Amount in USDT"), { target: { value: "500" } });
	expect(screen.getByText("₦719,562.50")).toBeInTheDocument();
	fireEvent.click(screen.getByRole("button", { name: "Continue to transfer" }));
	expect(screen.getByRole("tab", { name: "2 Transfer" })).toHaveFocus();
	fireEvent.click(screen.getByRole("button", { name: "View receipt" }));
	expect(screen.getByRole("tab", { name: "3 Receipt" })).toHaveFocus();
	expect(screen.getByText("₦719,562.50")).toBeInTheDocument();
	expect(screen.getByText(/^CL-[A-F0-9]{16}$/)).toBeInTheDocument();
});
it("shows buy cost inclusive of the same illustrative fee", () => {
	render(<ProductWalkthrough />);
	fireEvent.click(screen.getByRole("button", { name: "Buy", exact: true }));
	expect(screen.getByText("Total you pay")).toBeInTheDocument();
	expect(screen.getByText("₦146,087.50")).toBeInTheDocument();
	fireEvent.click(screen.getByRole("tab", { name: "3 Receipt" }));
	expect(screen.getByText("Ethereum wallet ••12F3")).toBeInTheDocument();
});
it.each(["", "-5", "1000001"])("keeps invalid amount %s out of a completed receipt", (value) => {
	const { rerender } = render(<ProductWalkthrough />);
	fireEvent.change(screen.getByLabelText("Amount in USDT"), { target: { value } });
	expect(screen.getByRole("alert")).toBeInTheDocument();
	expect(screen.queryByText("₦0.00")).not.toBeInTheDocument();
	expect(screen.queryByText("Service fee")).not.toBeInTheDocument();
	expect(screen.getByText(/Enter a valid amount to see/)).toBeInTheDocument();
	fireEvent.click(screen.getByRole("tab", { name: "3 Receipt" }));
	fireEvent.keyDown(screen.getByRole("tab", { name: "1 Quote" }), { key: "End" });
	expect(screen.queryByText(/^CL-[A-F0-9]{16}$/)).not.toBeInTheDocument();
	rerender(<ProductWalkthrough stage={2} />);
	expect(screen.getByRole("tab", { name: "1 Quote" })).toHaveAttribute("aria-selected", "true");
	expect(screen.getByRole("alert")).toBeInTheDocument();
});
it("searches the shared Help content without reintroducing the wallet contradiction", () => {
	render(<HelpCenter />);
	fireEvent.change(screen.getByLabelText("Search help articles"), {
		target: { value: "hold a balance" },
	});
	expect(screen.getByRole("status")).toHaveTextContent("1 answer found");
	expect(screen.getByText("Can I hold a balance in Clusteer?")).toBeInTheDocument();
	expect(screen.getByText(/not a wallet for storing a balance/)).toBeInTheDocument();
	fireEvent.change(screen.getByLabelText("Search help articles"), {
		target: { value: "zzzz-no-answer" },
	});
	expect(screen.getByRole("status")).toHaveTextContent("0 answers found");
});

it("keeps fractional sample amounts consistent and rejects unsupported demonstration precision", () => {
	render(<ProductWalkthrough />);
	fireEvent.change(screen.getByLabelText("Amount in USDT"), {
		target: { value: "1.23456" },
	});
	expect(screen.getByRole("alert")).toHaveTextContent("4 decimal places");
	expect(screen.getByRole("button", { name: "Continue to transfer" })).toBeDisabled();
	fireEvent.change(screen.getByLabelText("Amount in USDT"), { target: { value: "1.2345" } });
	fireEvent.click(screen.getByRole("button", { name: "Continue to transfer" }));
	expect(screen.queryByText("1.235 USDT")).not.toBeInTheDocument();
	expect(screen.getByText("1.2345")).toBeInTheDocument();
});

it("opens in the requested buy direction and gives buy-specific invalid-input guidance", () => {
	render(<ProductWalkthrough initialSide="buy" />);
	expect(screen.getByRole("button", { name: "Buy", exact: true })).toHaveAttribute(
		"aria-pressed",
		"true"
	);
	expect(screen.getByText("Total you pay")).toBeInTheDocument();
	fireEvent.change(screen.getByLabelText("Amount in USDT"), { target: { value: "" } });
	expect(
		screen.getByText("Enter a valid amount to see the total cost, rate and fee.")
	).toBeInTheDocument();
	expect(screen.queryByText("₦0.00")).not.toBeInTheDocument();
});

it("keeps USDC selected through transfer and receipt on Ethereum", () => {
	render(<ProductWalkthrough />);
	fireEvent.change(screen.getByRole("combobox", { name: "Stablecoin" }), {
		target: { value: "USDC" },
	});
	fireEvent.change(screen.getByLabelText("Amount in USDC"), { target: { value: "250" } });
	fireEvent.click(screen.getByRole("button", { name: "Continue to transfer" }));
	expect(screen.getByText("USDC · Ethereum (ERC-20)")).toBeInTheDocument();
	expect(screen.getByText("₦359,781.25")).toBeInTheDocument();
	fireEvent.click(screen.getByRole("button", { name: "View receipt" }));
	expect(screen.getByText("250")).toHaveTextContent("250");
	expect(screen.getByText("₦359,781.25")).toBeInTheDocument();
});
