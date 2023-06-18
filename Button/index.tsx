import { ClassValue } from "clsx";
import { ButtonHTMLAttributes } from "react";
import { IconType } from "react-icons";
import { Ripple } from "../Ripple";
import { Spinner } from "../Spinner";
import { cn } from "../util";
import "./index.css";

interface Props {
	
	/**
	 * Size of the button
	 * @default "medium"
	 */
	size: "small" | "medium" | "large";

	/**
	 * Color of the button
	 * @default "primary"
	 */
	color: "primary" | "neutral" | "error" | "warning" | "success";

	/**
	 * Variant of the button
	 * @default "raised"
	 */
	variant: "raised" | "outlined" | "flat";

	/**
	 * Disable the ripple
	 * @default false
	 */
	disableRipple: boolean;

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
	 * Weather or not to show the loading indicator
	 * @default false
	 */
	loading: boolean;

}

export function Button({ children, icon: Icon, className, size = "medium", color = "primary", variant = "raised", loading, iconPosition = "before", disableRipple, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & Partial<Props>) {

	// Record of classnames to apply based on props
	const classes: ClassValue[] = [

		// Custom class
		className,

		// Base class
		"w-min rounded-md font-medium uppercase tracking-[0.75px] duration-150 select-none appearance-none relative overflow-hidden whitespace-nowrap flex items-center gap-2 focus:outline-0 isolate justify-center",

		// Size classes
		{
			"px-4 h-9 py-1 text-sm": true,
			"px-3 h-7 py-0.5 text-xs": size === "small",
			"px-6 h-11 py-2 text-base": size === "large",
		}

	];

	// Classes for the ripple effect
	const ripple: ClassValue[] = [];

	// Variant classes
	switch (variant) {

	// Raised
	default:
		classes.push({
			"shadow-md hover:shadow-lg": true,
			"text-white bg-gray-500 hover:bg-gray-600 focus:bg-gray-600 active:bg-gray-700": color === "neutral",
			"text-primary-text bg-primary-600 hover:bg-primary-700 focus:bg-primary-700 active:bg-primary-800": color === "primary",
			"text-error-text bg-error-600 hover:bg-error-700 focus:bg-error-700 active:bg-error-800": color === "error",
			"text-success-text bg-success-600 hover:bg-success-700 focus:bg-success-700 active:bg-success-800": color === "success",
			"text-warning-text bg-warning-600 hover:bg-warning-700 focus:bg-warning-700 active:bg-warning-800": color === "warning",
		});
		break;
		
		// Outlined
	case "outlined":
		classes.push({
			"border border-opacity-50 hover:border-opacity-100 focus:border-opacity-100 active:border-opacity-100": true,
			"border-gray-500": color === "neutral",
			"border-primary": color === "primary",
			"border-error": color === "error",
			"border-success": color === "success",
			"border-warning": color === "warning",
		});

		// Flat
	case "flat":
		ripple.push({
			"bg-gray-500": color === "neutral",
			"bg-primary": color === "primary",
			"bg-error": color === "error",
			"bg-success": color === "success",
			"bg-warning": color === "warning",
		});
		classes.push({
			"bg-opacity-0 hover:bg-opacity-10 focus:bg-opacity-[.15]": true,
			"text-gray-800 dark:text-gray-200 bg-gray-500": color === "neutral",
			"active:bg-opacity-20": disableRipple,
			"active:bg-opacity-10": !disableRipple,
			"text-primary bg-primary": color === "primary",
			"text-error bg-error": color === "error",
			"text-success bg-success": color === "success",
			"text-warning bg-warning": color === "warning",
		});
		break;
	}

	return (
		<button { ...props } className={ cn(classes) }>

			{/* Ripple */}
			{(props.disabled || disableRipple) ? null : <Ripple className={ ripple } />}
			
			{/* Icon */}
			{ (!!Icon && iconPosition === "before" && !loading) && <Icon className={ cn("shrink-0", size === "large" ? "text-2xl" : size === "small" ? "text-lg" : "text-xl") } /> }
			{ (loading && iconPosition === "before") && <Spinner className={ cn(size === "large" ? "w-6" : size === "small" ? "w-4" : "w-5") } color={ variant === "raised" ? "neutral" : color } />}
			
			{/* Children */}
			{children}

			{/* Icon */}
			{ (!!Icon && iconPosition === "after" && !loading) && <Icon className={ cn("shrink-0", size === "large" ? "text-2xl" : size === "small" ? "text-lg" : "text-xl") } /> }
			{ (loading && iconPosition === "after") && <Spinner className={ cn(size === "large" ? "w-6" : size === "small" ? "w-4" : "w-5") } color={ variant === "raised" ? "neutral" : color } />}
			
		</button>
	);
}