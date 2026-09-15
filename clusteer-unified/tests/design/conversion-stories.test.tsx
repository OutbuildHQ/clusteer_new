import { fireEvent, render, screen, within } from "@testing-library/react";
import { ConversionStories } from "../../packages/ui/src/components/brand/conversion-stories";
jest.mock("next/image", () => ({ __esModule: true, default: () => null }));
it("switches the use case, destination and product link with accessible keyboard tabs", () => {
	render(<ConversionStories />);
	const panel = screen.getByRole("tabpanel");
	expect(
		within(panel).getByRole("heading", { name: "Receive naira in your bank account." })
	).toBeVisible();
	const sell = screen.getByRole("tab", { name: "Stablecoins to naira", exact: true });
	fireEvent.keyDown(sell, { key: "ArrowRight" });
	const buy = screen.getByRole("tab", { name: "Naira to stablecoins", exact: true });
	expect(buy).toHaveFocus();
	expect(within(panel).getByRole("list", { name: "How buying works" })).toBeVisible();
	expect(screen.getByRole("link", { name: "Walk through a buy" })).toHaveAttribute(
		"href",
		"/demo?side=buy"
	);
	expect(buy).toHaveAttribute("aria-selected", "true");
	expect(panel).toHaveAttribute("aria-labelledby", buy.id);
	expect(
		within(panel).getByRole("heading", { name: "Receive stablecoins in your wallet." })
	).toBeVisible();
	expect(screen.getByRole("link", { name: "Explore buying" })).toHaveAttribute("href", "/buy");
	fireEvent.keyDown(buy, { key: "Home" });
	expect(sell).toHaveFocus();
	expect(within(panel).getByRole("list", { name: "How selling works" })).toBeVisible();
	expect(screen.getByRole("link", { name: "Walk through a sell" })).toHaveAttribute(
		"href",
		"/demo?side=sell"
	);
	expect(
		within(panel).getByRole("heading", { name: "Receive naira in your bank account." })
	).toBeVisible();
});
