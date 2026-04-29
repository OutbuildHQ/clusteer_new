/**
 * Modal Store Tests
 */

import { MODAL_IDS, useCurrentModal, useModalActions, useIsModalOpen } from "../modal";

const { renderHook, act } = require("@testing-library/react");

describe("Modal Store", () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		// Close any open modal
		const { result } = renderHook(() => useModalActions());
		act(() => {
			result.current.closeModal();
		});
		jest.useRealTimers();
	});

	it("MODAL_IDS contains expected keys", () => {
		expect(MODAL_IDS).toEqual({
			FEE_DETAILS: "FEE_DETAILS",
			TRANSACTION_SUMMARY: "TRANSACTION_SUMMARY",
			PAYMENT: "PAYMENT",
			SUCCESS: "SUCCESS",
		});
	});

	it("initial state has null currentModal", () => {
		const { result } = renderHook(() => useCurrentModal());
		expect(result.current).toBeNull();
	});

	it("closeModal sets currentModal to null", () => {
		const { result: actions } = renderHook(() => useModalActions());

		act(() => {
			actions.current.closeModal();
		});

		const { result } = renderHook(() => useCurrentModal());
		expect(result.current).toBeNull();
	});

	it("openModal sets currentModal after timeout", () => {
		const { result: actions } = renderHook(() => useModalActions());

		act(() => {
			actions.current.openModal("FEE_DETAILS");
			jest.advanceTimersByTime(100);
		});

		const { result } = renderHook(() => useCurrentModal());
		expect(result.current).toBe("FEE_DETAILS");
	});

	it("useIsModalOpen returns true when modal matches", () => {
		const { result: actions } = renderHook(() => useModalActions());

		act(() => {
			actions.current.openModal("PAYMENT");
			jest.advanceTimersByTime(100);
		});

		const { result } = renderHook(() => useIsModalOpen("PAYMENT"));
		expect(result.current).toBe(true);
	});

	it("useIsModalOpen returns false for different modal", () => {
		const { result: actions } = renderHook(() => useModalActions());

		act(() => {
			actions.current.openModal("PAYMENT");
			jest.advanceTimersByTime(100);
		});

		const { result } = renderHook(() => useIsModalOpen("SUCCESS"));
		expect(result.current).toBe(false);
	});
});
