import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { ScrollStory } from "../../packages/ui/src/components/brand/scroll-story";
import { ProductWalkthrough } from "../../packages/ui/src/components/brand/product-walkthrough";
import { CustomerDashboardShowcase } from "../../apps/customer/src/components/app/customer-dashboard-showcase";

it("offers an independent website card with correct buy/sell totals and network constraints", () => {
	const { container } = render(<ProductWalkthrough presentation="card" />);
	expect(container.querySelector("aside")).toBeNull();
	expect(screen.queryByText("Personal account")).not.toBeInTheDocument();
	fireEvent.change(screen.getByLabelText("Amount in USDT"), { target: { value: "250" } });
	fireEvent.change(screen.getByLabelText("Network"), { target: { value: "BEP20" } });
	expect(screen.getByText("₦359,781.25")).toBeInTheDocument();
	fireEvent.click(screen.getByRole("button", { name: "Buy", exact: true }));
	expect(screen.getByText("₦365,218.75")).toBeInTheDocument();
	fireEvent.change(screen.getByLabelText("Stablecoin"), { target: { value: "USDC" } });
	expect(screen.getByLabelText("Network")).toHaveValue("ERC20");
	expect(within(screen.getByLabelText("Network")).getAllByRole("option")).toHaveLength(1);
	fireEvent.change(screen.getByLabelText("Amount in USDC"), { target: { value: "0" } });
	expect(screen.getByRole("button", { name: "Review conversion" })).toBeDisabled();
	expect(screen.getByRole("alert")).toHaveTextContent("Enter an amount");
	expect(screen.queryByText("₦0.00")).not.toBeInTheDocument();
});

function scene(animated = true, compact = false) {
	let matches = animated;
	let onMediaChange = () => {};
	let progress = 0;
	const queue: FrameRequestCallback[] = [];
	const originalMedia = window.matchMedia;
	const originalObserver = global.ResizeObserver;
	window.matchMedia = jest.fn().mockImplementation((query: string) => ({
		get matches() {
			return query.includes("max-width") ? compact : matches;
		},
		addEventListener: (_: string, fn: () => void) => {
			onMediaChange = fn;
		},
		removeEventListener: jest.fn(),
	}));
	global.ResizeObserver = class {
		observe() {}
		unobserve() {}
		disconnect() {}
	} as typeof ResizeObserver;
	const raf = jest.spyOn(window, "requestAnimationFrame").mockImplementation((fn) => {
		queue.push(fn);
		return queue.length;
	});
	const scroll = jest.spyOn(window, "scrollTo").mockImplementation(() => {});
	const view = render(<ScrollStory product={<CustomerDashboardShowcase />} />);
	const root = view.container.querySelector(".cl-scroll-story") as HTMLElement;
	Object.defineProperty(root, "offsetHeight", {
		configurable: true,
		value: window.innerHeight + 1000,
	});
	jest
		.spyOn(root, "getBoundingClientRect")
		.mockImplementation(() => ({ top: -progress * 1000 }) as DOMRect);
	const flush = () => {
		while (queue.length) queue.shift()!(0);
	};
	return {
		...view,
		root,
		scrollTo: (next: number) =>
			act(() => {
				progress = next;
				fireEvent.scroll(window);
				flush();
			}),
		media: (next: boolean) =>
			act(() => {
				matches = next;
				onMediaChange();
				flush();
			}),
		resize: () =>
			act(() => {
				fireEvent.resize(window);
				flush();
			}),
		finish: () => {
			view.unmount();
			raf.mockRestore();
			scroll.mockRestore();
			window.matchMedia = originalMedia;
			global.ResizeObserver = originalObserver;
		},
	};
}

it("lifts only the converter and preserves edits across reverse scrolling and dashboard navigation", () => {
	const view = scene();
	view.scrollTo(0.3);
	expect(view.container.querySelector(".cl-story-caption")).toHaveAttribute("inert");
	expect(screen.getByRole("button", { name: "Orders", exact: true })).toBeInTheDocument();
	const panel = view.container.querySelector(".cl-story-conversion")!;
	view.scrollTo(0.4);
	expect(panel).toHaveAttribute("inert");
	view.scrollTo(0.44);
	expect(panel).not.toHaveAttribute("inert");
	expect(screen.queryByRole("button", { name: "Orders", exact: true })).not.toBeInTheDocument();
	fireEvent.change(screen.getByLabelText("Amount in USDT"), { target: { value: "375" } });
	fireEvent.change(screen.getByLabelText("Stablecoin"), { target: { value: "USDC" } });
	view.scrollTo(0.3);
	fireEvent.click(screen.getByRole("button", { name: "Orders", exact: true }));
	expect(screen.getByRole("heading", { name: "Your orders" })).toBeInTheDocument();
	view.scrollTo(0.75);
	expect(screen.getByLabelText("Amount in USDC")).toHaveValue(375);
	expect(screen.getByLabelText("Network")).toHaveValue("ERC20");
	view.finish();
});

it.each(["amount", "direction", "network"])(
	"restores the hero after interacting with %s without clearing the conversion",
	(control) => {
		const view = scene();
		view.scrollTo(0.75);
		fireEvent.change(screen.getByLabelText("Amount in USDT"), { target: { value: "250" } });
		fireEvent.click(screen.getByRole("button", { name: "Buy", exact: true }));
		fireEvent.change(screen.getByLabelText("Network"), { target: { value: "BEP20" } });
		const target =
			control === "amount"
				? screen.getByLabelText("Amount in USDT")
				: control === "direction"
					? screen.getByRole("button", { name: "Buy", exact: true })
					: screen.getByLabelText("Network");
		act(() => target.focus());
		view.scrollTo(0.55);
		expect(target).toHaveFocus();
		expect(view.container.querySelector(".cl-story-conversion")).not.toHaveAttribute("inert");
		view.scrollTo(0.4);
		expect(view.root).toHaveFocus();
		expect(view.container.querySelector(".cl-story-conversion")).toHaveAttribute("inert");
		view.scrollTo(0);
		expect(view.root.style.getPropertyValue("--copy-opacity")).toBe("1");
		expect(view.root.style.getPropertyValue("--dashboard-opacity")).toBe("1");
		expect(view.root).not.toHaveClass("is-conversion-visible");
		expect(view.container.querySelector(".cl-story-intro")).not.toHaveAttribute("inert");
		view.scrollTo(0.75);
		expect(screen.getByLabelText("Amount in USDT")).toHaveValue(250);
		expect(screen.getByRole("button", { name: "Buy", exact: true })).toHaveAttribute(
			"aria-pressed",
			"true"
		);
		expect(screen.getByLabelText("Network")).toHaveValue("BEP20");
		view.finish();
	}
);

it("keeps an open converter available when motion is disabled", () => {
	const view = scene();
	view.scrollTo(0.75);
	const input = screen.getByLabelText("Amount in USDT");
	act(() => input.focus());
	view.media(false);
	expect(view.root).not.toHaveClass("has-scroll-motion");
	expect(view.root).toHaveClass("is-conversion-visible");
	view.resize();
	expect(view.root).toHaveClass("is-conversion-visible");
	view.finish();
});

it.each(["buy", "sell"] as const)(
	"keeps both amounts and the network on the %s receipt, with a waitlist handoff",
	(side) => {
		render(<ProductWalkthrough presentation="card" />);
		fireEvent.change(screen.getByLabelText("Stablecoin"), { target: { value: "USDC" } });
		fireEvent.change(screen.getByLabelText("Amount in USDC"), { target: { value: "250.1234" } });
		fireEvent.click(
			screen.getByRole("button", { name: side === "buy" ? "Buy" : "Sell", exact: true })
		);
		fireEvent.click(screen.getByRole("button", { name: "Review conversion" }));
		fireEvent.click(screen.getByRole("button", { name: "View receipt" }));
		expect(
			screen.getByText(side === "buy" ? "You received" : "You sold").parentElement
		).toHaveTextContent("250.1234 USDC");
		expect(screen.getByText("Network").parentElement).toHaveTextContent("Ethereum · ERC-20");
		expect(
			screen.getByText(side === "buy" ? "Total paid" : "Your bank received").parentElement
		).toHaveTextContent(side === "buy" ? "₦365,399.02" : "₦359,958.84");
		expect(screen.getByRole("link", { name: "Join the waitlist" })).toHaveAttribute(
			"href",
			"/early-access"
		);
		fireEvent.click(screen.getByRole("button", { name: "Start another conversion" }));
		expect(screen.getByRole("button", { name: "Review conversion" })).toBeEnabled();
	}
);

it("opens and closes the static converter locally, then shares its receipt with dashboard orders", () => {
	const view = scene(false);
	view.scrollTo(0);
	fireEvent.click(screen.getByRole("button", { name: "Convert to naira" }));
	expect(view.root).toHaveClass("is-conversion-visible");
	fireEvent.change(screen.getByLabelText("Amount in USDT"), { target: { value: "250" } });
	fireEvent.click(screen.getByRole("button", { name: "Review conversion" }));
	fireEvent.click(screen.getByRole("button", { name: "View receipt" }));
	const reference = screen.getByText(/^CL-[A-F0-9]{16}$/).textContent!;
	fireEvent.click(screen.getAllByRole("button", { name: "Back to dashboard" })[0]);
	expect(view.root).not.toHaveClass("is-conversion-visible");
	fireEvent.click(screen.getByRole("button", { name: "Orders", exact: true }));
	expect(screen.getByRole("button", { name: new RegExp(reference) })).toHaveTextContent(
		"₦359,781.25"
	);
	view.finish();
});

it("shows only the converter on mobile without opening the dashboard first", () => {
	const view = scene(false, true);
	expect(screen.getByRole("region", { name: "Buy and sell stablecoins" })).not.toHaveAttribute(
		"inert"
	);
	expect(screen.getByLabelText("Amount in USDT")).toHaveValue(100);
	expect(screen.queryByRole("button", { name: "Overview", exact: true })).not.toBeInTheDocument();
	expect(screen.queryByRole("button", { name: "Back to dashboard" })).not.toBeInTheDocument();
	fireEvent.change(screen.getByLabelText("Amount in USDT"), { target: { value: "250" } });
	fireEvent.click(screen.getByRole("button", { name: "Buy", exact: true }));
	view.resize();
	expect(screen.getByLabelText("Amount in USDT")).toHaveValue(250);
	expect(screen.getByText("₦365,218.75")).toBeInTheDocument();
	fireEvent.click(screen.getByRole("button", { name: "Review conversion" }));
	expect(screen.getByRole("heading", { name: "Your conversion" })).toBeInTheDocument();
	view.finish();
});
