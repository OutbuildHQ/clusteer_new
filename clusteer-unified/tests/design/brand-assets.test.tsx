import { act, fireEvent, render, screen } from "@testing-library/react";
import { BrandAssets } from "../../packages/ui/src/components/brand/brand-assets";

jest.mock("next/image", () => ({ __esModule: true, default: () => null }));
let reduced = false;
let observers: Array<(entries: Array<{ isIntersecting: boolean }>) => void>;
beforeEach(() => {
	reduced = false;
	observers = [];
	Object.defineProperty(window, "matchMedia", {
		writable: true,
		value: jest.fn(() => ({
			matches: reduced,
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
		})),
	});
	global.IntersectionObserver = jest.fn().mockImplementation((callback) => {
		observers.push(callback);
		return { observe: jest.fn(), disconnect: jest.fn() };
	});
});

it("runs visible artwork, honours pause, and stops offscreen motion", () => {
	const { container } = render(<BrandAssets />);
	const quote = container.querySelector(".cl-art--quote");
	expect(quote).toHaveAttribute("data-running", "false");
	act(() => observers.forEach((callback) => callback([{ isIntersecting: true }])));
	expect(quote).toHaveAttribute("data-running", "true");
	fireEvent.click(screen.getByRole("button", { name: "Pause quote animation" }));
	expect(quote).toHaveAttribute("data-running", "false");
	fireEvent.click(screen.getByRole("button", { name: "Play quote animation" }));
	expect(quote).toHaveAttribute("data-running", "true");
	act(() => observers.forEach((callback) => callback([{ isIntersecting: false }])));
	expect(quote).toHaveAttribute("data-running", "false");
});

it("keeps illustrations still and removes playback controls for reduced motion", () => {
	reduced = true;
	const { container } = render(<BrandAssets />);
	act(() => observers.forEach((callback) => callback([{ isIntersecting: true }])));
	expect(screen.queryByRole("button", { name: /animation/ })).not.toBeInTheDocument();
	container.querySelectorAll(".cl-art").forEach((frame) => {
		expect(frame).toHaveAttribute("data-reduced", "true");
		expect(frame).toHaveAttribute("data-running", "false");
	});
});
