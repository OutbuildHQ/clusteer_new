import { act, fireEvent, render, screen } from "@testing-library/react";
import { WaitlistForm } from "../../packages/ui/src/components/brand/waitlist-form";

it("locks the submitted address while pending and identifies it on success", async () => {
	const originalFetch = global.fetch;
	let resolve: (value: unknown) => void = () => {};
	global.fetch = jest.fn().mockImplementation(
		() =>
			new Promise((done) => {
				resolve = done;
			})
	);
	render(<WaitlistForm />);
	fireEvent.change(screen.getByRole("textbox", { name: "Email address" }), {
		target: { value: "reader@example.com" },
	});
	fireEvent.click(screen.getByRole("button", { name: "Join the waitlist" }));
	expect(screen.getByRole("textbox")).toBeDisabled();
	expect(screen.getByRole("button", { name: "Joining…" })).toBeDisabled();
	expect(global.fetch).toHaveBeenCalledWith(
		"/api/waitlist",
		expect.objectContaining({ body: JSON.stringify({ email: "reader@example.com" }) })
	);
	await act(async () => {
		resolve({ ok: true, json: async () => ({ status: true }) });
	});
	expect(screen.getByRole("status")).toHaveTextContent("reader@example.com");
	global.fetch = originalFetch;
});

it("keeps the email editable after a connection failure", async () => {
	const originalFetch = global.fetch;
	global.fetch = jest.fn().mockRejectedValue(new TypeError("offline"));
	render(<WaitlistForm />);
	fireEvent.change(screen.getByRole("textbox"), { target: { value: "reader@example.com" } });
	await act(async () => {
		fireEvent.click(screen.getByRole("button", { name: "Join the waitlist" }));
	});
	expect(screen.getByRole("alert")).toHaveTextContent("Check your connection");
	expect(screen.getByRole("textbox")).toBeEnabled();
	expect(screen.getByRole("textbox")).toHaveValue("reader@example.com");
	global.fetch = originalFetch;
});
