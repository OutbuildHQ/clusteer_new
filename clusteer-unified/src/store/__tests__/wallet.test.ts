/**
 * Wallet Store Tests
 */

import { useWalletStore, useWallets, useWalletActions, Wallet } from "../wallet";

const { renderHook, act } = require("@testing-library/react");

const testWallets: Wallet[] = [
	{
		name: "USDT Wallet",
		type: "CRYPTO",
		currency: "USDT",
		address: "0x123",
		balance: 100,
	},
	{
		name: "NGN Wallet",
		type: "FIAT",
		currency: "NGN",
		address: "",
		balance: 50000,
	},
];

describe("Wallet Store", () => {
	beforeEach(() => {
		// Reset store between tests
		useWalletStore.setState({ wallets: [] });
	});

	it("initial state has empty wallets array", () => {
		const { result } = renderHook(() => useWallets());
		expect(result.current).toEqual([]);
	});

	it("setWallets updates wallets", () => {
		const { result: actions } = renderHook(() => useWalletActions());

		act(() => {
			actions.current.setWallets(testWallets);
		});

		const { result } = renderHook(() => useWallets());
		expect(result.current).toEqual(testWallets);
		expect(result.current).toHaveLength(2);
	});

	it("useWalletActions returns actions", () => {
		const { result } = renderHook(() => useWalletActions());
		expect(result.current).toHaveProperty("setWallets");
		expect(typeof result.current.setWallets).toBe("function");
	});

	it("getState returns current wallets", () => {
		useWalletStore.setState({ wallets: testWallets });
		expect(useWalletStore.getState().wallets).toEqual(testWallets);
	});
});
