"use client";

import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";

export interface BatchAction {
	id: string;
	label: string;
	icon?: React.ReactNode;
	variant?: "default" | "danger" | "warning" | "success";
	confirmMessage?: string;
	onExecute: (selectedIds: string[]) => Promise<void> | void;
}

interface BatchActionsProps {
	selectedIds: string[];
	totalItems: number;
	actions: BatchAction[];
	onClearSelection: () => void;
}

export default function BatchActions({
	selectedIds,
	totalItems,
	actions,
	onClearSelection,
}: BatchActionsProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isExecuting, setIsExecuting] = useState(false);

	if (selectedIds.length === 0) return null;

	const handleActionClick = async (action: BatchAction) => {
		setIsOpen(false);

		if (action.confirmMessage) {
			const confirmed = window.confirm(
				`${action.confirmMessage}\n\nThis will affect ${selectedIds.length} item${selectedIds.length !== 1 ? 's' : ''}.`
			);
			if (!confirmed) return;
		}

		setIsExecuting(true);
		try {
			await action.onExecute(selectedIds);
			onClearSelection();
		} catch (error) {
			console.error('Batch action failed:', error);
		} finally {
			setIsExecuting(false);
		}
	};

	const getVariantClass = (variant?: string) => {
		switch (variant) {
			case 'danger':
				return 'text-danger hover:bg-danger/10';
			case 'warning':
				return 'text-orange-700 hover:bg-orange-50';
			case 'success':
				return 'text-success hover:bg-success/10';
			default:
				return 'text-muted-foreground hover:bg-background';
		}
	};

	return (
		<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom duration-300">
			<div className="bg-card rounded-lg shadow-lg border border-border px-6 py-4 flex items-center gap-4 min-w-[500px]">
				{/* Selection count */}
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
						{selectedIds.length}
					</div>
					<span className="text-sm font-medium text-foreground">
						{selectedIds.length} of {totalItems} selected
					</span>
				</div>

				{/* Actions dropdown */}
				<div className="relative flex-1">
					<button
						onClick={() => setIsOpen(!isOpen)}
						disabled={isExecuting}
						className="w-full flex items-center justify-between gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
					>
						<span className="text-sm font-medium">
							{isExecuting ? 'Processing...' : 'Batch Actions'}
						</span>
						<ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
					</button>

					{/* Dropdown menu */}
					{isOpen && (
						<div className="absolute bottom-full left-0 right-0 mb-2 bg-card rounded-lg shadow-lg border border-border py-1 max-h-60 overflow-y-auto">
							{actions.map((action) => (
								<button
									key={action.id}
									onClick={() => handleActionClick(action)}
									className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors ${getVariantClass(action.variant)}`}
								>
									{action.icon && <span>{action.icon}</span>}
									<span>{action.label}</span>
								</button>
							))}
						</div>
					)}
				</div>

				{/* Clear selection */}
				<button
					onClick={onClearSelection}
					className="p-2 hover:bg-muted rounded-lg transition-colors"
					aria-label="Clear selection"
				>
					<X className="w-5 h-5 text-muted-foreground" />
				</button>
			</div>
		</div>
	);
}

// Checkbox for selecting items
interface SelectCheckboxProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
	indeterminate?: boolean;
}

export function SelectCheckbox({ checked, onChange, indeterminate = false }: SelectCheckboxProps) {
	return (
		<label className="relative inline-flex items-center cursor-pointer">
			<input
				type="checkbox"
				checked={checked}
				onChange={(e) => onChange(e.target.checked)}
				className="sr-only peer"
			/>
			<div
				className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
					checked || indeterminate
						? 'bg-primary border-primary'
						: 'bg-card border-border'
				}`}
			>
				{checked && <Check className="w-3 h-3 text-white" />}
				{indeterminate && !checked && (
					<div className="w-2 h-0.5 bg-card rounded"></div>
				)}
			</div>
		</label>
	);
}

// Hook for managing batch selection
export function useBatchSelection<T extends { id: string }>(items: T[]) {
	const [selectedIds, setSelectedIds] = useState<string[]>([]);

	const isSelected = (id: string) => selectedIds.includes(id);

	const toggleSelect = (id: string) => {
		setSelectedIds(prev =>
			prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
		);
	};

	const toggleSelectAll = () => {
		if (selectedIds.length === items.length) {
			setSelectedIds([]);
		} else {
			setSelectedIds(items.map(item => item.id));
		}
	};

	const clearSelection = () => {
		setSelectedIds([]);
	};

	const isAllSelected = items.length > 0 && selectedIds.length === items.length;
	const isSomeSelected = selectedIds.length > 0 && selectedIds.length < items.length;

	return {
		selectedIds,
		isSelected,
		toggleSelect,
		toggleSelectAll,
		clearSelection,
		isAllSelected,
		isSomeSelected,
	};
}
