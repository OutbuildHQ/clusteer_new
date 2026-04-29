/**
 * useIsMobile Hook Tests
 */

import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "../use-mobile";

describe("useIsMobile", () => {
	const listeners: Array<() => void> = [];

	beforeEach(() => {
		listeners.length = 0;

		Object.defineProperty(window, "innerWidth", {
			writable: true,
			configurable: true,
			value: 1024,
		});

		window.matchMedia = jest.fn().mockImplementation((query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: jest.fn(),
			removeListener: jest.fn(),
			addEventListener: jest.fn((_: string, cb: () => void) => {
				listeners.push(cb);
			}),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn(),
		}));
	});

	it("returns false when window width >= 768", () => {
		Object.defineProperty(window, "innerWidth", { value: 1024, configurable: true });
		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(false);
	});

	it("returns true when window width < 768", () => {
		Object.defineProperty(window, "innerWidth", { value: 500, configurable: true });
		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(true);
	});

	it("updates on resize", () => {
		Object.defineProperty(window, "innerWidth", { value: 1024, configurable: true });
		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(false);

		// Simulate resize to mobile
		act(() => {
			Object.defineProperty(window, "innerWidth", { value: 500, configurable: true });
			listeners.forEach((cb) => cb());
		});

		expect(result.current).toBe(true);
	});
});
