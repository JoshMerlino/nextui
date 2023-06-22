import { ClassValue } from "clsx";
import { HTMLAttributes } from "react";
import { cn } from "../util";

export { CardActions } from "./Actions";
export { CardContent } from "./Content";
export { CardHeader } from "./Header";

interface Props {

	/**
	 * The variant of the card.
	 * @default "raised"
	 */
	variant?: "raised" | "outlined" | "flat";

}

export function Card({ children, className, variant = "raised", ...props }: HTMLAttributes<HTMLDivElement> & Props) {

	// Generate classlist
	const classlist: ClassValue[] = [

		// Base class
		"flex flex-col gap-2 p-4 overflow-hidden rounded-lg text-gray-700 dark:text-gray-400 backdrop-blur-2xl",

		// Variant
		{
			"shadow-md bg-gray-100 dark:bg-gray-800": variant === "raised",
			"border bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50": variant === "outlined",
			"bg-gray-200 dark:bg-gray-800/50": variant === "flat"
		},
		
		// User Overrides
		className

	];

	return (
		<div className={cn(classlist)} {...props}>{children}</div>
	);
}