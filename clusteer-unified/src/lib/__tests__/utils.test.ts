import { cn, parseNumber, formatNumber, getFormattedDate, getInitials } from "../utils";

describe("Utils", () => {
	describe("cn", () => {
		it("merges multiple class strings", () => {
			expect(cn("foo", "bar")).toBe("foo bar");
		});

		it("handles conditional classes via clsx", () => {
			expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
		});

		it("resolves Tailwind conflicts", () => {
			expect(cn("p-4", "p-2")).toBe("p-2");
		});

		it("handles empty/undefined inputs", () => {
			expect(cn()).toBe("");
			expect(cn(undefined, null)).toBe("");
		});
	});

	describe("parseNumber", () => {
		it("parses plain number string", () => {
			expect(parseNumber("123")).toBe(123);
		});

		it("parses comma-separated string", () => {
			expect(parseNumber("1,234,567")).toBe(1234567);
		});

		it("parses decimal", () => {
			expect(parseNumber("1,234.56")).toBe(1234.56);
		});

		it("returns null for non-numeric string", () => {
			expect(parseNumber("abc")).toBeNull();
		});

		it("returns null for empty string", () => {
			expect(parseNumber("")).toBeNull();
		});
	});

	describe("formatNumber", () => {
		it("formats with thousand separators", () => {
			expect(formatNumber(1234567)).toBe("1,234,567");
		});

		it("handles decimals", () => {
			expect(formatNumber(1234.56)).toBe("1,234.56");
		});

		it("strips decimals when allowDec=false", () => {
			expect(formatNumber(1234.56, false)).toBe("1,234");
		});

		it("returns empty string for NaN", () => {
			expect(formatNumber(NaN)).toBe("");
		});

		it("handles zero", () => {
			expect(formatNumber(0)).toBe("0");
		});

		it("handles default (no argument)", () => {
			expect(formatNumber()).toBe("0");
		});
	});

	describe("getFormattedDate", () => {
		it("formats valid date", () => {
			const result = getFormattedDate(new Date("2024-01-15"));
			expect(result).toMatch(/15 January, 2024/);
		});

		it("returns empty for invalid date", () => {
			expect(getFormattedDate(new Date("invalid"))).toBe("");
		});

		it("handles different months", () => {
			const result = getFormattedDate(new Date("2024-06-20"));
			expect(result).toMatch(/20 June, 2024/);
		});
	});

	describe("getInitials", () => {
		it("returns initials from two-word name", () => {
			expect(getInitials("John Doe")).toBe("JD");
		});

		it("returns initial from single name", () => {
			expect(getInitials("John")).toBe("J");
		});

		it("returns initials from three-word name", () => {
			expect(getInitials("John Michael Doe")).toBe("JMD");
		});

		it("handles lowercase names", () => {
			expect(getInitials("john doe")).toBe("JD");
		});
	});
});
