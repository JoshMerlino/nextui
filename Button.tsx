import { cva, type VariantProps } from "class-variance-authority";
import type { ClassValue } from "clsx";
import { merge } from "lodash";
import { Spinner } from "nextui/Spinner";
import { ButtonHTMLAttributes, type CSSProperties, type ReactNode } from "react";
import { Ripple } from "./Ripple";
import { cn } from "./util";

export const classes = {

	button: cva([ "w-min rounded-md font-medium uppercase tracking-[0.75px] duration-150 select-none appearance-none relative overflow-hidden whitespace-nowrap flex items-center gap-2 focus:outline-0 isolate justify-center outline-transparent" ], {
		
		defaultVariants: {

			size: "medium",

		},

		variants: {

			size: {
				"small": "px-3 h-7 py-0.5 text-xs",
				"medium": "px-4 h-9 py-1 text-sm",
				"large": "px-6 h-11 py-2 text-base",
				"md:large": "px-4 h-9 py-1 text-sm md:px-6 md:h-11 md:py-2 md:text-base",
			},

			variant: {
				"raised": "shadow-md hover:shadow-lg",
				"outlined": "border border-opacity-50 hover:border-opacity-100 focus:border-opacity-100 active:border-opacity-100 bg-opacity-0 hover:bg-opacity-10 focus:bg-opacity-[.15]",
				"flat": "bg-opacity-0 hover:bg-opacity-10 focus:bg-opacity-[.15] dark:bg-opacity-0 dark:hover:bg-opacity-10 dark:focus:bg-opacity-[.15]"
			},

			color: {
				"primary": null,
				"neutral": null,
				"error": null,
				"success": null,
				"warning": null,
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
				className: "text-primary bg-primary border-primary"
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
				className: "text-gray-800 bg-gray-800 border-gray-800 dark:text-gray-200 dark:bg-gray-200 dark:border-gray-200"
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
				className: "text-error bg-error border-error"
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
				className: "text-success bg-success border-success"
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
				className: "text-warning bg-warning border-warning"
			},

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

export function Button({ children, ripple, loading, className, style, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof classes.button> & Partial<{
	
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

}>) {
	return (
		<button
			{ ...props }
			className={ cn(classes.button(props as VariantProps<typeof classes.button>), className) }
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
}