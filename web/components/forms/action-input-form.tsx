import { Search, type LucideIcon } from "lucide-react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ActionInputForm({
	buttonLabel,
	disabled,
	icon: Icon = Search,
	inputLabel,
	inputType = "text",
	onSubmit,
	onValueChange,
	placeholder,
	value,
}: {
	buttonLabel: string;
	disabled?: boolean;
	icon?: LucideIcon;
	inputLabel: string;
	inputType?: React.HTMLInputTypeAttribute;
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
	onValueChange: (value: string) => void;
	placeholder: string;
	value: string;
}) {
	return (
		<form className="flex w-full gap-2 sm:w-[30rem]" onSubmit={onSubmit}>
			<div className="relative min-w-0 flex-1">
				<label className="sr-only" htmlFor={inputLabel}>{inputLabel}</label>
				<Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
				<Input
					id={inputLabel}
					className="bg-card pl-9 shadow-sm"
					placeholder={placeholder}
					type={inputType}
					value={value}
					onChange={(event) => onValueChange(event.target.value)}
				/>
			</div>
			<Button
				className="bg-accent px-4 text-accent-foreground hover:bg-primary hover:text-primary-foreground"
				disabled={disabled}
			>
				<Icon className="h-4 w-4" />
				{buttonLabel}
			</Button>
		</form>
	);
}
