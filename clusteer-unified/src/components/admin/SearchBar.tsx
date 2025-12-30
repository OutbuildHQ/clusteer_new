"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	debounceMs?: number;
	onSearch?: (value: string) => void;
	isLoading?: boolean;
	suggestions?: string[];
	onSuggestionClick?: (suggestion: string) => void;
}

export default function SearchBar({
	value,
	onChange,
	placeholder = "Search...",
	debounceMs = 300,
	onSearch,
	isLoading = false,
	suggestions = [],
	onSuggestionClick,
}: SearchBarProps) {
	const [localValue, setLocalValue] = useState(value);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const debounceTimer = useRef<NodeJS.Timeout>();
	const wrapperRef = useRef<HTMLDivElement>(null);

	// Debounced search
	useEffect(() => {
		if (debounceTimer.current) {
			clearTimeout(debounceTimer.current);
		}

		debounceTimer.current = setTimeout(() => {
			onChange(localValue);
			if (onSearch) {
				onSearch(localValue);
			}
		}, debounceMs);

		return () => {
			if (debounceTimer.current) {
				clearTimeout(debounceTimer.current);
			}
		};
	}, [localValue, debounceMs, onChange, onSearch]);

	// Close suggestions when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
				setShowSuggestions(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleClear = () => {
		setLocalValue("");
		onChange("");
		if (onSearch) {
			onSearch("");
		}
	};

	const handleSuggestionClick = (suggestion: string) => {
		setLocalValue(suggestion);
		onChange(suggestion);
		setShowSuggestions(false);
		if (onSuggestionClick) {
			onSuggestionClick(suggestion);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			setShowSuggestions(false);
		}
	};

	return (
		<div ref={wrapperRef} className="relative">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
				<input
					type="text"
					value={localValue}
					onChange={(e) => {
						setLocalValue(e.target.value);
						setShowSuggestions(true);
					}}
					onFocus={() => setShowSuggestions(true)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					className="w-full pl-10 pr-10 py-2 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent"
				/>
				<div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
					{isLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
					{localValue && !isLoading && (
						<button
							onClick={handleClear}
							className="p-1 hover:bg-gray-100 rounded transition-colors"
							aria-label="Clear search"
						>
							<X className="w-4 h-4 text-gray-400" />
						</button>
					)}
				</div>
			</div>

			{/* Suggestions dropdown */}
			{showSuggestions && suggestions.length > 0 && localValue && (
				<div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E9EAEB] rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
					{suggestions.map((suggestion, index) => (
						<button
							key={index}
							onClick={() => handleSuggestionClick(suggestion)}
							className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
						>
							<Search className="w-4 h-4 text-gray-400" />
							<span className="text-gray-700">{suggestion}</span>
						</button>
					))}
				</div>
			)}
		</div>
	);
}

// Compact search for tables
export function CompactSearch({
	value,
	onChange,
	placeholder = "Search...",
}: {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}) {
	const [localValue, setLocalValue] = useState(value);
	const debounceTimer = useRef<NodeJS.Timeout>();

	useEffect(() => {
		if (debounceTimer.current) {
			clearTimeout(debounceTimer.current);
		}

		debounceTimer.current = setTimeout(() => {
			onChange(localValue);
		}, 300);

		return () => {
			if (debounceTimer.current) {
				clearTimeout(debounceTimer.current);
			}
		};
	}, [localValue, onChange]);

	return (
		<div className="relative">
			<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
			<input
				type="text"
				value={localValue}
				onChange={(e) => setLocalValue(e.target.value)}
				placeholder={placeholder}
				className="pl-9 pr-4 py-2 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent w-full"
			/>
			{localValue && (
				<button
					onClick={() => {
						setLocalValue("");
						onChange("");
					}}
					className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
				>
					<X className="w-3 h-3 text-gray-400" />
				</button>
			)}
		</div>
	);
}
