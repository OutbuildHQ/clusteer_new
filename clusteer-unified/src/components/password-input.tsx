"use client";

import { Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { memo, useState } from "react";
import { UseControllerProps, useController } from "react-hook-form";

function PasswordInput({ name, control }: UseControllerProps) {
	const [showPassword, setShowPassword] = useState(false);
	const togglePasswordVisibility = () => setShowPassword(!showPassword);

	const { field } = useController({ name, control });

	return (
		<div className="relative">
			<Input
				className="h-11 placeholder:text-muted-foreground"
				type={showPassword ? "text" : "password"}
				placeholder="******"
				{...field}
			/>
			<Button
				type="button"
				variant="ghost"
				size="sm"
				className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
				onClick={togglePasswordVisibility}
				aria-label={showPassword ? "Hide password" : "Show password"}
			>
				{showPassword ? (
					<Eye className="h-4 w-4 text-muted-foreground" />
				) : (
					<EyeOff className="h-4 w-4 text-muted-foreground" />
				)}
				<span className="sr-only">
					{showPassword ? "Hide password" : "Show password"}
				</span>
			</Button>
		</div>
	);
}

export default memo(PasswordInput);
