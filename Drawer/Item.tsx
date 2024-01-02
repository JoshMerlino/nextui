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
		"relative flex items-center overflow-hidden transition-colors gap-4 text-sm font-medium border-l-4 border-transparent px-4",

		// Size
		size === "large" ? "h-[52px] py-4" : "h-[42px] py-2 text-xs",

		// If active
		active ? "bg-primary/10 hover:bg-primary/20 text-primary-600 dark:text-primary-400 active:bg-primary/20 border-primary-600 dark:border-primary-400" : "hover:bg-gray-100 group-focus/link:bg-gray-100 group-focus/link:border-current text-gray-600 active:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:active:bg-gray-700/50 dark:group-focus/link:bg-gray-700/50",

	];

	return (
		<li className={ cn(classes) } { ...props }>
			{ !disableRipple && <Ripple className={ active ? "bg-primary/20" : "bg-gray-400/40 dark:bg-gray-600/40" } /> }
			{ (!!Icon && iconPosition === "before") && <Icon className={ cn("shrink-0", size === "large" ? "text-2xl" : "text-xl") } /> }
			<span className="flex flex-col font-medium">{ children }</span>
			{ (!!Icon && iconPosition === "after") && <Icon className={ cn("ml-auto shrink-0", size === "large" ? "text-2xl" : "text-xl") } /> }
		</li>
	);
}