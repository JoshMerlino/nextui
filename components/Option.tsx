"use client";
import { Ripple } from "nextui/Ripple";
import { cn } from "nextui/util";
import { type HTMLAttributes, type OptionHTMLAttributes, useContext } from "react";
import { SelectProvider } from "./InputField/SelectInput";

export function Option({ children, className, value, ...props }: HTMLAttributes<HTMLLIElement> & Pick<OptionHTMLAttributes<HTMLOptionElement>, "value">) {
	
	const { isFocused, isSelected, setSelected, setFocused } = useContext(SelectProvider);

	// useEffect(() => void (defaultChecked && currentSelected === -1 && setSelected()), [ currentSelected, defaultChecked, setSelected ]);
	// useEffect(() => void (defaultValue && currentSelected === -1 && value?.toString() === defaultValue.toString() && setSelected()), [ value, setSelected, defaultValue, currentSelected ]);
	return (
		<li { ...props }
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
			onClick={ () => setSelected() }
			onMouseEnter={ () => setFocused() }>
			<Ripple className="opacity-10" />
			<option value={ value }>{ children }</option>
		</li>
	);
}