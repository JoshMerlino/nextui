import { ClassValue } from "clsx";
import { PropsWithChildren, ReactNode } from "react";
import { cn } from "../util";

interface Props {

	/**
	 * The tooltip content
	 */
	tooltip: ReactNode;

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

export function Tooltip({ tooltip, anchor = "top", children, className }: PropsWithChildren<Props>) {

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
		"absolute inline-flex items-center h-6 px-2 text-xs font-medium text-white transition-all scale-0 rounded-md opacity-0 pointer-events-none select-none bg-neutral-500 dark:bg-neutral-700 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 whitespace-nowrap z-[100]",
	
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
			<div className={ cn(tooltipClasses) }>{tooltip}</div>
		</div>
	);
}