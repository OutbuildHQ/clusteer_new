"use client";

import * as Select from "@radix-ui/react-select";
import Image from "next/image";
import { Check, ChevronDown } from "lucide-react";

type Option = { value: string; label: string; detail: string; icon: string; shortLabel?: string };

/** Public website selector; operational dashboard primitives keep their existing styles. */
export function WebsiteSelect({
	id,
	label,
	value,
	options,
	onChange,
}: {
	id?: string;
	label: string;
	value: string;
	options: Option[];
	onChange: (value: string) => void;
}) {
	const selected = options.find((option) => option.value === value)!;
	return (
		<Select.Root value={value} onValueChange={onChange}>
			<Select.Trigger id={id} aria-label={label} className="cl-select-trigger">
				<Image src={selected.icon} width={24} height={24} alt="" />
				<Select.Value>{selected.shortLabel ?? selected.label}</Select.Value>
				<Select.Icon asChild>
					<ChevronDown size={14} />
				</Select.Icon>
			</Select.Trigger>
			<Select.Portal>
				<Select.Content
					className="cl-select-menu"
					position="popper"
					align="end"
					sideOffset={8}
					collisionPadding={16}
				>
					<Select.Viewport>
						<Select.Group>
							<Select.Label className="cl-select-label">Choose {label.toLowerCase()}</Select.Label>
							{options.map((option) => (
								<Select.Item
									key={option.value}
									value={option.value}
									textValue={`${option.label} ${option.detail}`}
									className="cl-select-option"
								>
									<Image src={option.icon} width={28} height={28} alt="" />
									<span className="cl-select-option-copy">
										<Select.ItemText>{option.label}</Select.ItemText>
										<span className="cl-select-detail">{option.detail}</span>
									</span>
									<Select.ItemIndicator className="cl-select-check">
										<Check size={16} />
									</Select.ItemIndicator>
								</Select.Item>
							))}
						</Select.Group>
					</Select.Viewport>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	);
}
