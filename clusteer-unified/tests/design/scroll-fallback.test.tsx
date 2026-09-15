import { act, fireEvent, render } from "@testing-library/react";
import { ScrollStory } from "../../packages/ui/src/components/brand/scroll-story";
jest.mock("next/image", () => ({ __esModule: true, default: () => null }));
it("restores the static hero when reduced motion or a smaller viewport disables the scene", () => {
	let matches = true;
	let mediaChange: () => void = () => {};
	const queue: FrameRequestCallback[] = [];
	const originalMatch = window.matchMedia;
	window.matchMedia = jest.fn().mockImplementation(() => ({
		get matches() {
			return matches;
		},
		addEventListener: (_: string, fn: () => void) => {
			mediaChange = fn;
		},
		removeEventListener: jest.fn(),
	}));
	const raf = jest.spyOn(window, "requestAnimationFrame").mockImplementation((fn) => {
		queue.push(fn);
		return queue.length;
	});
	const originalObserver = global.ResizeObserver;
	global.ResizeObserver = class {
		observe() {}
		unobserve() {}
		disconnect() {}
	} as typeof ResizeObserver;
	const view = render(<ScrollStory />);
	const root = view.container.querySelector(".cl-scroll-story") as HTMLElement;
	Object.defineProperty(root, "offsetHeight", { configurable: true, value: 3000 });
	jest
		.spyOn(root, "getBoundingClientRect")
		.mockReturnValue({ top: -1800, height: 3000 } as DOMRect);
	act(() => {
		while (queue.length) queue.shift()!(0);
	});
	expect(root.style.getPropertyValue("--copy-opacity")).toBe("0");
	expect(root).toHaveClass("has-scroll-motion");
	act(() => {
		matches = false;
		mediaChange();
		while (queue.length) queue.shift()!(0);
	});
	expect(root).not.toHaveClass("has-scroll-motion");
	expect(root.style.getPropertyValue("--copy-opacity")).toBe("");
	expect(root.style.getPropertyValue("--scene-opacity")).toBe("");
	expect(root.querySelector(".cl-story-intro")).not.toHaveAttribute("inert");
	view.unmount();
	raf.mockRestore();
	window.matchMedia = originalMatch;
	global.ResizeObserver = originalObserver;
});

it("removes invisible hero actions and hands focus out of disappearing subtrees in both scroll directions", () => {
	const queue: FrameRequestCallback[] = [];
	const originalMatch = window.matchMedia;
	window.matchMedia = jest.fn().mockImplementation(() => ({
		matches: true,
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
	}));
	const raf = jest.spyOn(window, "requestAnimationFrame").mockImplementation((fn) => {
		queue.push(fn);
		return queue.length;
	});
	const originalObserver = global.ResizeObserver;
	global.ResizeObserver = class {
		observe() {}
		unobserve() {}
		disconnect() {}
	} as typeof ResizeObserver;
	const view = render(<ScrollStory />);
	const root = view.container.querySelector(".cl-scroll-story") as HTMLElement;
	const intro = root.querySelector(".cl-story-intro") as HTMLElement;
	const device = root.querySelector(".cl-story-device") as HTMLElement;
	const caption = root.querySelector(".cl-story-caption") as HTMLElement;
	let progress = 0;
	Object.defineProperty(root, "offsetHeight", {
		configurable: true,
		value: window.innerHeight + 1000,
	});
	jest
		.spyOn(root, "getBoundingClientRect")
		.mockImplementation(() => ({ top: -progress * 1000 }) as DOMRect);
	const scrollTo = (next: number) =>
		act(() => {
			progress = next;
			fireEvent.scroll(window);
			while (queue.length) queue.shift()!(0);
		});
	scrollTo(0);
	const heroLink = intro.querySelector("a")!;
	heroLink.focus();
	expect(heroLink).toHaveFocus();
	scrollTo(0.24); // Inside the original invisible-but-focusable regression interval.
	expect(root.style.getPropertyValue("--copy-opacity")).toBe("0");
	expect(intro).toHaveAttribute("inert");
	expect(device).toHaveAttribute("inert");
	expect(root).toHaveFocus();
	scrollTo(0.6);
	expect(device).not.toHaveAttribute("inert");
	scrollTo(0.99);
	expect(view.getByRole("tab", { name: "1 Quote" })).toHaveAttribute("aria-selected", "true");
	fireEvent.click(view.getByRole("tab", { name: "2 Transfer" }));
	scrollTo(0.55);
	expect(view.getByRole("tab", { name: "2 Transfer" })).toHaveAttribute("aria-selected", "true");
	fireEvent.click(view.getByRole("tab", { name: "1 Quote" }));

	const demoInput = device.querySelector("input")!;
	demoInput.focus();
	scrollTo(0.25);
	expect(root).toHaveFocus();
	expect(device).toHaveAttribute("inert");
	scrollTo(0.6);
	caption.querySelector("button")!.focus();
	scrollTo(0.2);
	expect(caption).toHaveAttribute("inert");
	expect(root).toHaveFocus();
	scrollTo(0);
	expect(intro).not.toHaveAttribute("inert");
	view.unmount();
	raf.mockRestore();
	window.matchMedia = originalMatch;
	global.ResizeObserver = originalObserver;
});

it("opens the on-page dashboard without navigation in the static layout", () => {
	const originalMatch = window.matchMedia;
	window.matchMedia = jest
		.fn()
		.mockReturnValue({
			matches: false,
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
		});
	const originalObserver = global.ResizeObserver;
	global.ResizeObserver = class {
		observe() {}
		disconnect() {}
		unobserve() {}
	} as typeof ResizeObserver;
	const scroll = jest.spyOn(window, "scrollTo").mockImplementation(() => {});
	const view = render(<ScrollStory />);
	const url = window.location.href;
	fireEvent.click(view.getAllByRole("button", { name: "Explore dashboard" })[0]);
	expect(view.getByRole("region", { name: "Interactive Clusteer dashboard" })).toHaveFocus();
	expect(scroll).toHaveBeenCalledWith(expect.objectContaining({ behavior: "auto" }));
	expect(window.location.href).toBe(url);
	view.unmount();
	scroll.mockRestore();
	window.matchMedia = originalMatch;
	global.ResizeObserver = originalObserver;
});
