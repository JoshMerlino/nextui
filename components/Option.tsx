"use client";
import { useConvergedRef, useEventMap } from "nextui/hooks";
import { Ripple } from "nextui/Ripple";
import { cn } from "nextui/util";
import { forwardRef, type HTMLAttributes, type OptionHTMLAttributes, useContext } from "react";
import { SelectProvider } from "./InputField/SelectInput";

export const Option = forwardRef<HTMLLIElement, HTMLAttributes<HTMLLIElement> & Pick<OptionHTMLAttributes<HTMLOptionElement>, "value"> & { icon?: string }>(function({ children, className, value, icon, ...props }, fref) {
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
			<div className="flex gap-2 5 items-center">
				{ icon && (
					<img
						alt={ value?.toString() }
						className="w-4 h-4"
						src={ icon } />
				) }
				<option value={ value }>{ children }</option>
			</div>
		</li>
	);
});