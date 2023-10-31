import { ClassValue } from "clsx";
import { PropsWithChildren, ReactNode } from "react";
import { cn } from "../util";

interface Props {

	/**
	 * The tooltip content
	 */
	tooltip?: ReactNode;

	/**
	 * The tooltip itsself
	 */
	element?: ReactNode;

	/**
	 * The anchor position of the tooltip
	 * (this is the side of the tooltip that is attached to the target)
	 * @default "top"
	 */
	anchor?: "top" | "bottom" | "left" | "right";

	/**
	 * Custom classnames to apply to the tooltip
	 */
	className?: ClassValue;
	
}

export function Tooltip({ tooltip, anchor = "top", children, className, element }: PropsWithChildren<Props>) {

	if (!tooltip && !element) throw new Error("You must provide either a tooltip or an element to render as the tooltip");

	// Record of classnames to apply based on props
	const classes: ClassValue[] = [

		// Base classnames
		"group/tooltip relative isolate hover:z-[10]",

		// Custom classs
		className
		
	];

	// Tooltip classes
	const tooltipClasses: ClassValue[] = [
	
		// Base classnames
		"absolute inline-flex items-center transition-all scale-0 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 z-[100]",
	
		// Anchor classes
		{
			"top-full origin-top my-2 mx-auto left-1/2 -translate-x-1/2": anchor === "top",
			"bottom-full origin-bottom my-2 mx-auto left-1/2 -translate-x-1/2": anchor === "bottom",
			"left-full origin-left mx-2 my-auto top-1/2 -translate-y-1/2": anchor === "left",
			"right-full origin-right mx-2 my-auto top-1/2 -translate-y-1/2": anchor === "right"
		}
	];

	return (
		<div className={ cn(classes) }>
			{children}
			{element ? <div className={ cn(tooltipClasses) }>{element}</div> : <div className={ cn(tooltipClasses, "h-6 px-2 text-xs font-medium text-white rounded-md select-none bg-neutral-500 dark:bg-neutral-700 whitespace-nowrap pointer-events-none") }>{tooltip}</div>}
		</div>
	);
}