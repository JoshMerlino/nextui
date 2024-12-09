"use client";
import { SelectionContext } from "nextui/InputField/___def";
import { Ripple } from "nextui/Ripple";
import { cn } from "nextui/util";
import { type HTMLAttributes, type OptionHTMLAttributes, useContext, useEffect } from "react";

export function Option({ children, className, value, defaultChecked, ...props }: HTMLAttributes<HTMLDivElement> & Pick<OptionHTMLAttributes<HTMLOptionElement>, "value">) {
	const { isFocused, isSelected, currentSelected, setSelected, defaultValue } = useContext(SelectionContext);
	useEffect(() => void (defaultChecked && currentSelected === -1 && setSelected()), [ currentSelected, defaultChecked, setSelected ]);
	useEffect(() => void (defaultValue && currentSelected === -1 && value?.toString() === defaultValue.toString() && setSelected()), [ value, setSelected, defaultValue, currentSelected ]);
	return (
		<div
			className={ cn([
				"min-h-10 px-4 flex items-center select-none relative overflow-hidden isolate transition-colors duration-100 cursor-pointer",
				{
					"bg-gray-200/50 dark:bg-gray-700/50": isFocused,
					"bg-gray-200/75 dark:bg-gray-700/75": isSelected,
					"bg-gray-200 dark:bg-gray-700": isSelected && isFocused
				},
				!isSelected && "active:bg-gray-200 dark:active:bg-gray-700",
				className
			]) }
			{ ...props }>
			<Ripple className="opacity-10" />
			<option value={ value }>{ children }</option>
		</div>
	);
}
;
