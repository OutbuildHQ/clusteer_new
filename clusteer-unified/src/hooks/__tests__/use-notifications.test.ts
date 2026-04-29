/**
 * useNotifications Hook Tests
 */

// Mock the user store
jest.mock("@/store/user", () => ({
	useUser: jest.fn(() => ({ id: "test-user-123" })),
}));

import { renderHook } from "@testing-library/react";
import { useNotifications } from "../use-notifications";

describe("useNotifications", () => {
	it("returns empty notifications array", () => {
		const { result } = renderHook(() => useNotifications());
		expect(result.current.notifications).toEqual([]);
	});

	it("returns loading as false", () => {
		const { result } = renderHook(() => useNotifications());
		expect(result.current.loading).toBe(false);
	});

	it("returns error as null", () => {
		const { result } = renderHook(() => useNotifications());
		expect(result.current.error).toBeNull();
	});

	it("returns unreadCount as 0", () => {
		const { result } = renderHook(() => useNotifications());
		expect(result.current.unreadCount).toBe(0);
	});

	it("markAsRead, markAllAsRead, deleteNotification are callable", async () => {
		const logSpy = jest.spyOn(console, "log").mockImplementation();
		const { result } = renderHook(() => useNotifications());

		// Should not throw
		await result.current.markAsRead("some-id");
		await result.current.markAllAsRead();
		await result.current.deleteNotification("some-id");

		logSpy.mockRestore();
	});
});
