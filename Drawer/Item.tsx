import { Ripple } from "@components/Ripple";
import { cn } from "@util/cn";
import { ClassValue } from "clsx";
import { HTMLAttributes } from "react";
import { IconType } from "react-icons";

interface Props {

	/**
	 * Disable the ripple
	 * @default false
	 */
	disableRipple: boolean;

	/**
	 * Active state
	 * @default false
	 */
	active: boolean;

	/**
	 * Icon position
	 * @default "before"
	 */
	iconPosition: "before" | "after";

	/**
	 * Icon
	 */
	icon: IconType;

	/**
	 * Size of the item
	 * @default "large"
	 */
	size: "medium" | "large";

}

export function DrawerItem({ children, disableRipple, icon: Icon, iconPosition = "before", size = "large", active, ...props }: Partial<Props> & HTMLAttributes<HTMLLIElement>) {

	// Record of classnames to apply based on props
	const classes: ClassValue[] = [

		// Base styles
		"relative flex items-center mx-2 overflow-hidden px-4 transition-colors rounded-full",

		// Size
		size === "large" ? "py-4" : "py-3",

		// If active
		active ? "bg-primary/5 hover:bg-primary/10 text-primary-800 dark:text-primary hover:active:bg-primary/20" : "hover:bg-gray-100 text-gray-700 hover:active:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:active:bg-gray-700/80",

	];

	return (
		<li className={cn(classes)} {...props}>
			<Ripple className={ active ? "bg-primary" : "bg-gray-400 dark:bg-gray-600"}/>
			{ (!!Icon && iconPosition === "before") && <Icon className="text-2xl shrink-0" /> }
			<span className="flex flex-col px-2 font-medium">{ children }</span>
			{ (!!Icon && iconPosition === "after") && <Icon className="ml-auto text-2xl shrink-0" /> }
		</li>
	);
}