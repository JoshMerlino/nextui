import { cva, type VariantProps } from "class-variance-authority";
import type { ClassValue } from "clsx";
import { merge } from "lodash";
import { Spinner } from "nextui/components/Spinner";
import { ButtonHTMLAttributes, forwardRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "../util";
import { Ripple } from "./Ripple";

export const classes = {

	button: cva([ "w-min rounded-md font-medium uppercase tracking-[0.75px] duration-150 select-none appearance-none relative overflow-hidden whitespace-nowrap flex items-center gap-2 focus:outline-0 isolate justify-center outline-transparent" ], {
		
		defaultVariants: {

			size: "medium",

		},

		variants: {

			// disabled
			disabled: {
				true: "cursor-not-allowed pointer-events-none opacity-50",
			},

			size: {
				"small": "px-3 h-7 py-0.5 text-xs",
				"medium": "px-4 h-9 py-1 text-sm",
				"large": "px-6 h-11 py-2 text-base",
				"md:large": "px-4 h-9 py-1 text-sm md:px-6 md:h-11 md:py-2 md:text-base",
			},

			variant: {
				"raised": "shadow-md hover:shadow-lg",
				"outlined": "border bg-opacity-0 hover:bg-opacity-10 focus:bg-opacity-[.15] dark:bg-opacity-0 dark:hover:bg-opacity-10 dark:focus:bg-opacity-[.15]",
				"flat": "bg-opacity-0 hover:bg-opacity-10 focus:bg-opacity-[.15] dark:bg-opacity-0 dark:hover:bg-opacity-10 dark:focus:bg-opacity-[.15]"
			},

			color: {
				"primary": null,
				"primary:pastel": null,
				"neutral": null,
				"error": null,
				"error:pastel": null,
				"success": null,
				"success:pastel": null,
				"warning": null,
				"warning:pastel": null
			}
			
		},
		compoundVariants: [
		
			{
				variant: "raised",
				color: "primary",
				className: "text-white bg-primary-600 hover:bg-primary-700 focus:bg-primary-700 active:bg-primary-800"
			}, {
				variant: "flat",
				color: "primary",
				className: "text-primary bg-primary"
			}, {
				variant: "outlined",
				color: "primary",
				className: "text-primary bg-primary border-primary/50"
			},

			{
				variant: "raised",
				color: "primary:pastel",
				className: "text-primary-950 bg-primary-300 hover:bg-primary-400 focus:bg-primary-400 active:bg-primary-500"
			}, {
				variant: "flat",
				color: "primary:pastel",
				className: "text-primary bg-primary dark:text-primary-300 dark:bg-primary-300"
			}, {
				variant: "outlined",
				color: "primary:pastel",
				className: "text-primary bg-primary border-primary/50 dark:text-primary-300 dark:bg-primary-300 dark:border-primary-300/50"
			},
			
			{
				variant: "raised",
				color: "neutral",
				className: "text-white bg-gray-600 hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-800 dark:text-gray-800 dark:bg-gray-300 dark:hover:bg-gray-200 dark:focus:bg-gray-200 dark:active:bg-gray-100"
			}, {
				variant: "flat",
				color: "neutral",
				className: "text-gray-800 bg-gray-800 dark:text-gray-200 dark:bg-gray-200"
			}, {
				variant: "outlined",
				color: "neutral",
				className: "text-gray-800 bg-gray-800 border-gray-800/50 dark:text-gray-200 dark:bg-gray-200 dark:border-gray-200/50"
			},

			{
				variant: "raised",
				color: "error",
				className: "text-white bg-error-600 hover:bg-error-700 focus:bg-error-700 active:bg-error-800"
			}, {
				variant: "flat",
				color: "error",
				className: "text-error bg-error"
			}, {
				variant: "outlined",
				color: "error",
				className: "text-error bg-error border-error/50"
			},

			{
				variant: "raised",
				color: "error:pastel",
				className: "text-error-950 bg-error-300 hover:bg-error-400 focus:bg-error-400 active:bg-error-500"
			}, {
				variant: "flat",
				color: "error:pastel",
				className: "text-error bg-error dark:text-error-300 dark:bg-error-300"
			}, {
				variant: "outlined",
				color: "error:pastel",
				className: "text-error bg-error border-error/50 dark:text-error-300 dark:bg-error-300 dark:border-error-300/50"
			},

			{
				variant: "raised",
				color: "success",
				className: "text-white bg-success-600 hover:bg-success-700 focus:bg-success-700 active:bg-success-800"
			}, {
				variant: "flat",
				color: "success",
				className: "text-success bg-success"
			}, {
				variant: "outlined",
				color: "success",
				className: "text-success bg-success border-success/50"
			},

			{
				variant: "raised",
				color: "success:pastel",
				className: "text-success-950 bg-success-300 hover:bg-success-400 focus:bg-success-400 active:bg-success-500"
			}, {
				variant: "flat",
				color: "success:pastel",
				className: "text-success bg-success dark:text-success-300 dark:bg-success-300"
			}, {
				variant: "outlined",
				color: "success:pastel",
				className: "text-success bg-success border-success/50 dark:text-success-300 dark:bg-success-300 dark:border-success-300/50"
			},

			{
				variant: "raised",
				color: "warning",
				className: "text-white bg-warning-600 hover:bg-warning-700 focus:bg-warning-700 active:bg-warning-800"
			}, {
				variant: "flat",
				color: "warning",
				className: "text-warning bg-warning"
			}, {
				variant: "outlined",
				color: "warning",
				className: "text-warning bg-warning border-warning/50"
			},

			{
				variant: "raised",
				color: "warning:pastel",
				className: "text-warning-950 bg-warning-300 hover:bg-warning-400 focus:bg-warning-400 active:bg-warning-500"
			}, {
				variant: "flat",
				color: "warning:pastel",
				className: "text-warning bg-warning dark:text-warning-300 dark:bg-warning-300"
			}, {
				variant: "outlined",
				color: "warning:pastel",
				className: "text-warning bg-warning border-warning/50 dark:text-warning-300 dark:bg-warning-300 dark:border-warning-300/50"
			},
			
			{
				variant: "raised",
				disabled: true,
				className: "text-white bg-gray-500 shadow-none hover:shadow-none"
			}, {
				variant: "flat",
				disabled: true,
				className: "text-gray-700 dark:text-gray-200"
			}, {
				variant: "outlined",
				disabled: true,
				className: "text-gray-700 dark:text-gray-200 border-gray-500/50 dark:border-gray-400/50"
			},

			{
				variant: "raised",
				disabled: true,
				className: "text-white bg-gray-500 shadow-none hover:shadow-none"
			}, {
				variant: "flat",
				disabled: true,
				className: "text-gray-700 dark:text-gray-200"
			}, {
				variant: "outlined",
				disabled: true,
				className: "text-gray-700 dark:text-gray-200 border-gray-500/50 dark:border-gray-400/50"
			}

		]
	}),

	spinner: cva(null, {
		variants: {
			size: {
				"large": "w-6",
				"small": "w-4",
				"medium": "w-5",
				"md:large": "w-5 md:w-6"
			}
		},
		defaultVariants: {
			size: "medium"
		}
	})

};

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof classes.button> & Partial<{
	
	/**
	 * Weather or not to show the ripple effect
	 * @default true
	 */
	ripple: boolean | Partial<{
		
		/**
		 * Weather or not to emit the ripple from the center of the element, or the props to pass to a <Ripple /> component
		 * @default false
		 */
		emitFromCenter: boolean;

		/**
		 * Custom class overrides
		 */
		className: string | ClassValue;

		/**
		 * Weather or not the ripple is disabled
		 * @default false
		 */
		disabled: boolean;

	}>;

	/**
	 * Weather or not to show the loading indicator, or the props to pass to a <Spinner /> component
	 * @default false
	 */
	loading: boolean | Partial<{
		
		/**
		 * Custom class overrides
		 */
		className: string | ClassValue;

		/**
		 * Weather or not the ripple is disabled
		 * @default true
		 */
		enabled?: boolean;

	}>;

	/**
	 * The icon to display
	 */
	icon: ReactNode | {

		/**
		 * The position of the icon
		 * @default "before"
		 */
		position?: "before" | "after";

		/**
		 * The icon to display
		 */
		icon: ReactNode;

	}

}>>(function({ children, ripple, loading, className, style, ...props }, ref) {
	return (
		<button
			{ ...props }
			className={ cn(classes.button(props as VariantProps<typeof classes.button>), className) }
			ref={ ref }
			style={ merge(style, {
				WebkitTapHighlightColor: "transparent",
				["-webkit-focus-ring-color" as keyof CSSProperties]: "transparent"
			} satisfies CSSProperties) }>
			
			{ /* Ripple */ }
			{ (props.disabled || (typeof ripple === "boolean" && !ripple)) || <Ripple { ...typeof ripple === "boolean" ? {} : ripple } /> }
			
			{ /* Spinner */ }
			{ !!loading && <Spinner
				{ ...(typeof loading === "boolean" ? {} : loading) }
				className={ cn(classes.spinner(props as VariantProps<typeof classes.spinner>), typeof loading === "boolean" ? "" : loading.className) } /> }
			
			{ children }
			
		</button>
	);
});