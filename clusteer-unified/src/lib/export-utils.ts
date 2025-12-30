/**
 * Export Utility Functions
 * Handles CSV and PDF exports for admin dashboard
 */

export interface ExportColumn {
	key: string;
	label: string;
	format?: (value: any) => string;
}

export interface ExportOptions {
	filename?: string;
	columns: ExportColumn[];
	data: any[];
	title?: string;
}

/**
 * Export data to CSV
 */
export function exportToCSV({ filename, columns, data }: ExportOptions): void {
	if (!data || data.length === 0) {
		console.warn("No data to export");
		return;
	}

	// Create CSV header
	const headers = columns.map(col => col.label);
	const csvRows = [headers];

	// Create CSV rows
	data.forEach(item => {
		const row = columns.map(col => {
			const value = item[col.key];
			const formatted = col.format ? col.format(value) : value;

			// Escape special characters
			if (typeof formatted === 'string') {
				// Wrap in quotes if contains comma, quote, or newline
				if (formatted.includes(',') || formatted.includes('"') || formatted.includes('\n')) {
					return `"${formatted.replace(/"/g, '""')}"`;
				}
			}

			return formatted ?? '';
		});
		csvRows.push(row);
	});

	// Convert to CSV string
	const csvContent = csvRows.map(row => row.join(',')).join('\n');

	// Create blob and download
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = `${filename || 'export'}-${new Date().toISOString().split('T')[0]}.csv`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

/**
 * Export data to JSON
 */
export function exportToJSON({ filename, data }: { filename: string; data: any[] }): void {
	if (!data || data.length === 0) {
		console.warn("No data to export");
		return;
	}

	const jsonContent = JSON.stringify(data, null, 2);
	const blob = new Blob([jsonContent], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

/**
 * Export data to Excel (XLSX format via CSV)
 * For true Excel support, would need xlsx library
 */
export function exportToExcel(options: ExportOptions): void {
	exportToCSV({
		...options,
		filename: options.filename?.replace('.csv', '.xlsx') || 'export.xlsx'
	});
}

/**
 * Format data for export
 */
export function formatExportValue(value: any): string {
	if (value === null || value === undefined) {
		return '';
	}

	if (typeof value === 'boolean') {
		return value ? 'Yes' : 'No';
	}

	if (Array.isArray(value)) {
		return value.join('; ');
	}

	if (typeof value === 'object') {
		return JSON.stringify(value);
	}

	return String(value);
}

/**
 * Export table data helper
 */
export function exportTableData<T extends Record<string, any>>({
	data,
	columns,
	filename,
	format = 'csv'
}: {
	data: T[];
	columns: { key: keyof T; label: string; format?: (value: any) => string }[];
	filename: string;
	format?: 'csv' | 'json' | 'xlsx';
}): void {
	const exportColumns: ExportColumn[] = columns.map(col => ({
		key: String(col.key),
		label: col.label,
		format: col.format || formatExportValue
	}));

	const exportOptions: ExportOptions = {
		filename,
		columns: exportColumns,
		data
	};

	switch (format) {
		case 'csv':
			exportToCSV(exportOptions);
			break;
		case 'json':
			exportToJSON({ filename, data });
			break;
		case 'xlsx':
			exportToExcel(exportOptions);
			break;
		default:
			exportToCSV(exportOptions);
	}
}

/**
 * Create filename with timestamp
 */
export function createExportFilename(base: string, extension: string = 'csv'): string {
	const timestamp = new Date().toISOString().split('T')[0];
	return `${base}-${timestamp}.${extension}`;
}

/**
 * Validate export data
 */
export function validateExportData(data: any[]): { valid: boolean; message?: string } {
	if (!data || !Array.isArray(data)) {
		return { valid: false, message: 'Invalid data format' };
	}

	if (data.length === 0) {
		return { valid: false, message: 'No data to export' };
	}

	if (data.length > 10000) {
		return {
			valid: false,
			message: 'Dataset too large. Please apply filters or export in batches.'
		};
	}

	return { valid: true };
}
