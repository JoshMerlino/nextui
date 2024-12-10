"use client";
import { useConvergedRef, useEventMap } from "nextui/hooks";
import { Ripple } from "nextui/Ripple";
import { cn } from "nextui/util";
import { forwardRef, type HTMLAttributes, type OptionHTMLAttributes, useContext } from "react";
import { SelectProvider } from "./InputField/SelectInput";

export const Option = forwardRef<HTMLLIElement, HTMLAttributes<HTMLLIElement> & Pick<OptionHTMLAttributes<HTMLOptionElement>, "value">>(function({ children, className, value, ...props }, fref) {
	const ref = useConvergedRef(fref);
	const { isFocused, isSelected, setSelected, setFocused } = useContext(SelectProvider);

	useEventMap(ref, {
		mousemove: () => setFocused(),
		click: () => setSelected(),
	});

	return (
		<li { ...props }
			className={ cn([
				"min-h-10 px-4 flex items-center select-none relative overflow-hidden isolate transition-colors duration-100 cursor-pointer",
				"group-[.size-dense]/select:min-h-9 group-[.size-dense]/select:px-3 group-[.size-dense]/select:text-sm",
				{
					"bg-gray-200/50 dark:bg-gray-700/50": isFocused,
					"bg-gray-200/75 dark:bg-gray-700/75": isSelected,
					"active:bg-gray-200 dark:active:bg-gray-700": !isSelected,
					"bg-gray-200 dark:bg-gray-700": isSelected && isFocused
				},
				className
			]) }
			ref={ ref }>
			<Ripple className="opacity-10" />
			<option value={ value }>{ children }</option>
		</li>
	);
});