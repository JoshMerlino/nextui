"use client";
import { useConvergedRef, useEventMap } from "nextui/hooks";
import { Ripple } from "nextui/Ripple";
import { cn } from "nextui/util";
import { forwardRef, type HTMLAttributes, type OptionHTMLAttributes, type ReactNode, useContext } from "react";
import { SelectProvider } from "./InputField/SelectInput";

export const Option = forwardRef<HTMLLIElement, HTMLAttributes<HTMLLIElement> & Pick<OptionHTMLAttributes<HTMLOptionElement>, "value"> & {
	icon?: ReactNode;

	/**
	 * What the field shows when this option is chosen.
	 *
	 * Derived from the children otherwise, which only works while they are text:
	 * an option rendering a chip or an icon row would put "[object Object]" in
	 * the closed field. Give it a label and the list can render whatever it
	 * likes.
	 */
	label?: string;
}>(function({ children, className, value, icon, label: _label, ...props }, fref) {
	const ref = useConvergedRef(fref);
	const { isFocused, isSelected, setSelected, setFocused } = useContext(SelectProvider);

	useEventMap(ref, {
		mousemove: () => setFocused(),
		click: () => setSelected()
	});

	return (
		<li { ...props }
			className={ cn([
				"min-h-10 px-4 flex items-center select-none relative overflow-hidden isolate not-motion-reduce:transition-colors duration-100 cursor-pointer",
				"group-[.size-dense]/select:min-h-9 group-[.size-dense]/select:px-3 group-[.size-dense]/select:text-sm",
				{
					"bg-gray-200/25 dark:bg-gray-700/50": isFocused,
					"bg-gray-200/50 dark:bg-gray-700/75": isSelected,
					"active:bg-gray-200/50 dark:active:bg-gray-700/75": !isSelected
				},
				className
			]) }
			ref={ ref }>
			<Ripple className="opacity-10" />

			{ /* Not an <option> element. A browser renders only the TEXT inside one,
			     so an option whose children were a chip or an icon row came out as
			     bare words — and an <option> inside an <li> was never valid markup
			     anyway. The value is read off the React props by SelectInput, which
			     is where it was always coming from. */ }
			<div className="flex gap-2.5 items-center">
				{ icon }
				{ children }
			</div>
		</li>
	);
});