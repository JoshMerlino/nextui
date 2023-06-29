import { ClassValue } from "clsx";
import { HTMLAttributes } from "react";
import { IconType } from "react-icons";
import { Ripple } from "../Ripple";
import { cn } from "../util";

export interface ItemProps {

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
	size: "dense" | "large";

}

export function DrawerItem({ children, disableRipple, icon: Icon, iconPosition = "before", size = "large", active, ...props }: Partial<ItemProps> & HTMLAttributes<HTMLLIElement>) {

	// Record of classnames to apply based on props
	const classes: ClassValue[] = [

		// Base styles
		"relative flex items-center overflow-hidden pl-4 pr-6 transition-colors rounded-full gap-2 text-sm font-medium",

		// Size
		size === "large" ? "h-14 py-4" : "h-10 py-2",

		// If active
		active ? "bg-primary/5 hover:bg-primary/10 text-primary-800 dark:text-primary hover:active:bg-primary/20" : "hover:bg-gray-100 text-gray-700 hover:active:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:active:bg-gray-700/80",

	];

	return (
		<li className={ cn(classes) } { ...props }>
			{!disableRipple && <Ripple className={ active ? "bg-primary" : "bg-gray-400 dark:bg-gray-600" } /> }
			{ (!!Icon && iconPosition === "before") && <Icon className="text-2xl shrink-0" /> }
			<span className="flex flex-col font-medium">{ children }</span>
			{ (!!Icon && iconPosition === "after") && <Icon className="ml-auto text-2xl shrink-0" /> }
		</li>
	);
}