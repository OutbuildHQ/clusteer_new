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

function scene(animated = true) {
	let matches = animated;
	let onMediaChange = () => {};
	let progress = 0;
	const queue: FrameRequestCallback[] = [];
	const originalMedia = window.matchMedia;
	const originalObserver = global.ResizeObserver;
	window.matchMedia = jest.fn().mockImplementation(() => ({
		get matches() {
			return matches;
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
	view.scrollTo(0.48);
	expect(panel).toHaveAttribute("inert");
	view.scrollTo(0.75);
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
