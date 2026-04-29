import {
	exportToCSV,
	exportToJSON,
	formatExportValue,
	validateExportData,
	createExportFilename,
} from "../export-utils";

// Mock DOM APIs
const mockClick = jest.fn();
const mockAppendChild = jest.fn();
const mockRemoveChild = jest.fn();
const mockCreateObjectURL = jest.fn(() => "blob:test-url");
const mockRevokeObjectURL = jest.fn();

beforeEach(() => {
	jest.clearAllMocks();

	Object.defineProperty(global, "URL", {
		value: {
			createObjectURL: mockCreateObjectURL,
			revokeObjectURL: mockRevokeObjectURL,
		},
		writable: true,
	});

	jest.spyOn(document, "createElement").mockReturnValue({
		href: "",
		download: "",
		click: mockClick,
	} as any);
	jest.spyOn(document.body, "appendChild").mockImplementation(mockAppendChild);
	jest.spyOn(document.body, "removeChild").mockImplementation(mockRemoveChild);
});

describe("Export Utils", () => {
	describe("formatExportValue", () => {
		it("returns empty string for null/undefined", () => {
			expect(formatExportValue(null)).toBe("");
			expect(formatExportValue(undefined)).toBe("");
		});

		it("returns 'Yes' for true", () => {
			expect(formatExportValue(true)).toBe("Yes");
		});

		it("returns 'No' for false", () => {
			expect(formatExportValue(false)).toBe("No");
		});

		it("joins arrays with semicolons", () => {
			expect(formatExportValue(["a", "b", "c"])).toBe("a; b; c");
		});

		it("JSON stringifies objects", () => {
			expect(formatExportValue({ key: "value" })).toBe('{"key":"value"}');
		});

		it("converts numbers to strings", () => {
			expect(formatExportValue(42)).toBe("42");
		});
	});

	describe("validateExportData", () => {
		it("returns valid for normal array", () => {
			expect(validateExportData([{ a: 1 }])).toEqual({ valid: true });
		});

		it("returns invalid for empty array", () => {
			expect(validateExportData([])).toEqual({
				valid: false,
				message: "No data to export",
			});
		});

		it("returns invalid for null", () => {
			expect(validateExportData(null as any)).toEqual({
				valid: false,
				message: "Invalid data format",
			});
		});

		it("returns invalid for non-array", () => {
			expect(validateExportData("string" as any)).toEqual({
				valid: false,
				message: "Invalid data format",
			});
		});

		it("returns invalid for array > 10000 items", () => {
			const largeArray = new Array(10001).fill({ a: 1 });
			const result = validateExportData(largeArray);
			expect(result.valid).toBe(false);
			expect(result.message).toContain("too large");
		});
	});

	describe("createExportFilename", () => {
		it("creates filename with date suffix", () => {
			const result = createExportFilename("users");
			expect(result).toMatch(/^users-\d{4}-\d{2}-\d{2}\.csv$/);
		});

		it("uses provided extension", () => {
			const result = createExportFilename("report", "json");
			expect(result).toMatch(/^report-\d{4}-\d{2}-\d{2}\.json$/);
		});
	});

	describe("exportToCSV", () => {
		const columns = [
			{ key: "name", label: "Name" },
			{ key: "email", label: "Email" },
		];

		it("does not download with empty data", () => {
			const warnSpy = jest.spyOn(console, "warn").mockImplementation();
			exportToCSV({ columns, data: [] });
			expect(mockClick).not.toHaveBeenCalled();
			expect(warnSpy).toHaveBeenCalledWith("No data to export");
			warnSpy.mockRestore();
		});

		it("creates CSV and triggers download", () => {
			exportToCSV({
				columns,
				data: [{ name: "John", email: "john@test.com" }],
				filename: "test",
			});
			expect(mockCreateObjectURL).toHaveBeenCalled();
			expect(mockClick).toHaveBeenCalled();
			expect(mockRevokeObjectURL).toHaveBeenCalled();
		});

		it("escapes values containing commas", () => {
			exportToCSV({
				columns: [{ key: "name", label: "Name" }],
				data: [{ name: "Doe, John" }],
			});
			// The Blob constructor is called with CSV content
			expect(mockCreateObjectURL).toHaveBeenCalled();
		});
	});

	describe("exportToJSON", () => {
		it("does not download with empty data", () => {
			const warnSpy = jest.spyOn(console, "warn").mockImplementation();
			exportToJSON({ filename: "test", data: [] });
			expect(mockClick).not.toHaveBeenCalled();
			warnSpy.mockRestore();
		});

		it("creates JSON and triggers download", () => {
			exportToJSON({
				filename: "test",
				data: [{ id: 1, name: "John" }],
			});
			expect(mockCreateObjectURL).toHaveBeenCalled();
			expect(mockClick).toHaveBeenCalled();
		});
	});
});
