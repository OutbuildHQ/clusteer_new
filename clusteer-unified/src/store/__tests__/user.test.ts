/**
 * User Store Tests
 *
 * Tests Zustand store directly via getState/setState.
 */

// We need to mock the IUser type import path
jest.mock("@/types", () => ({}), { virtual: true });

// Import store after mocking
import { useUser, useUserActions } from "../user";

// For direct store access we need to get the underlying store
// Since hooks need React, we test via getState pattern
const { create } = require("zustand");

// Re-create a test-compatible version
describe("User Store", () => {
	// Use renderHook to test hooks
	const { renderHook, act } = require("@testing-library/react");

	it("initial state has null user", () => {
		const { result } = renderHook(() => useUser());
		expect(result.current).toBeNull();
	});

	it("setUser updates user state", () => {
		const { result: actionsResult } = renderHook(() => useUserActions());
		const testUser = {
			id: "1",
			username: "testuser",
			email: "test@example.com",
			firstName: "Test",
			lastName: "User",
		};

		act(() => {
			actionsResult.current.setUser(testUser as any);
		});

		const { result } = renderHook(() => useUser());
		expect(result.current).toEqual(testUser);
	});

	it("logout sets user to null", () => {
		const { result: actionsResult } = renderHook(() => useUserActions());

		// First set a user
		act(() => {
			actionsResult.current.setUser({ id: "1", email: "test@example.com" } as any);
		});

		// Then logout
		act(() => {
			actionsResult.current.logout();
		});

		const { result } = renderHook(() => useUser());
		expect(result.current).toBeNull();
	});

	it("useUserActions returns actions object", () => {
		const { result } = renderHook(() => useUserActions());
		expect(result.current).toHaveProperty("setUser");
		expect(result.current).toHaveProperty("logout");
		expect(typeof result.current.setUser).toBe("function");
		expect(typeof result.current.logout).toBe("function");
	});
});
