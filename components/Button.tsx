import { cva, type VariantProps } from "class-variance-authority";
import { merge } from "lodash";
import { Spinner } from "nextui/components/Spinner";
import { ButtonHTMLAttributes, forwardRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "../util";
import { Ripple } from "./Ripple";

export const classes = {

	button: cva([
		"w-min rounded-md font-medium uppercase tracking-[0.75px] duration-150 select-none appearance-none relative overflow-hidden whitespace-nowrap flex items-center gap-2 focus:outline-0 isolate justify-center outline-transparent shrink-0",
	], {
		
		defaultVariants: {
			color: "primary",
			size: "default",
			variant: "raised",
		},

		variants: {

			// disabled
			disabled: {
				true: "cursor-not-allowed pointer-events-none opacity-50",
			},

			size: {
				"dense": "px-3 h-7 py-0.5 text-xs",
				"default": "px-4 h-9 py-1 text-sm",
				"large": "px-6 h-11 py-2 text-base",
				"md:large": "px-4 h-9 py-1 text-sm md:px-6 md:h-11 md:py-2 md:text-base",
			},

			variant: {
				"raised": "shadow-md hover:shadow-lg",
				"outlined": "border bg-opacity-0 hover:bg-opacity-10 focus:bg-opacity-[.15] dark:bg-opacity-0 dark:hover:bg-opacity-10 dark:focus:bg-opacity-[.15]",
				"flat": ""
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
				color: [ "primary", "primary:pastel" ],
				className: "text-white bg-primary-600 hover:bg-primary-700 focus:bg-primary-700 active:bg-primary-800"
			}, {
				variant: "flat",
				color: [ "primary", "primary:pastel" ],
				className: "text-primary hover:bg-primary/10 focus:bg-primary/15 active:bg-primary/20"
			}, {
				variant: "outlined",
				color: [ "primary", "primary:pastel" ],
				className: "text-primary hover:bg-primary/10 focus:bg-primary/15 active:bg-primary/20 border-primary/50"
			}, {
				variant: "raised",
				color: "primary:pastel",
				className: "dark:text-primary-950 dark:bg-primary-300 dark:hover:bg-primary-400 dark:focus:bg-primary-400 dark:active:bg-primary-500",
			}, {
				variant: "flat",
				color: "primary:pastel",
				className: "dark:text-primary-300 dark:hover:bg-primary-300/10 dark:focus:bg-primary-300/15 dark:active:bg-primary-300/20",
			}, {
				variant: "outlined",
				color: "primary:pastel",
				className: "dark:text-primary-300 dark:hover:bg-primary-300/10 dark:focus:bg-primary-300/15 dark:active:bg-primary-300/20 dark:border-primary-300/50",
			},
			
			{
				variant: "raised",
				color: [ "error", "error:pastel" ],
				className: "text-white bg-error-600 hover:bg-error-700 focus:bg-error-700 active:bg-error-800"
			}, {
				variant: "flat",
				color: [ "error", "error:pastel" ],
				className: "text-error hover:bg-error/10 focus:bg-error/15 active:bg-error/20"
			}, {
				variant: "outlined",
				color: [ "error", "error:pastel" ],
				className: "text-error hover:bg-error/10 focus:bg-error/15 active:bg-error/20 border-error/50"
			}, {
				variant: "raised",
				color: "error:pastel",
				className: "dark:text-error-950 dark:bg-error-300 dark:hover:bg-error-400 dark:focus:bg-error-400 dark:active:bg-error-500",
			}, {
				variant: "flat",
				color: "error:pastel",
				className: "dark:text-error-300 dark:hover:bg-error-300/10 dark:focus:bg-error-300/15 dark:active:bg-error-300/20",
			}, {
				variant: "outlined",
				color: "error:pastel",
				className: "dark:text-error-300 dark:hover:bg-error-300/10 dark:focus:bg-error-300/15 dark:active:bg-error-300/20 dark:border-error-300/50",
			},
			
			{
				variant: "raised",
				color: [ "warning", "warning:pastel" ],
				className: "text-white bg-warning-600 hover:bg-warning-700 focus:bg-warning-700 active:bg-warning-800"
			}, {
				variant: "flat",
				color: [ "warning", "warning:pastel" ],
				className: "text-warning hover:bg-warning/10 focus:bg-warning/15 active:bg-warning/20"
			}, {
				variant: "outlined",
				color: [ "warning", "warning:pastel" ],
				className: "text-warning hover:bg-warning/10 focus:bg-warning/15 active:bg-warning/20 border-warning/50"
			}, {
				variant: "raised",
				color: "warning:pastel",
				className: "dark:text-warning-950 dark:bg-warning-300 dark:hover:bg-warning-400 dark:focus:bg-warning-400 dark:active:bg-warning-500",
			}, {
				variant: "flat",
				color: "warning:pastel",
				className: "dark:text-warning-300 dark:hover:bg-warning-300/10 dark:focus:bg-warning-300/15 dark:active:bg-warning-300/20",
			}, {
				variant: "outlined",
				color: "warning:pastel",
				className: "dark:text-warning-300 dark:hover:bg-warning-300/10 dark:focus:bg-warning-300/15 dark:active:bg-warning-300/20 dark:border-warning-300/50",
			},
			
			{
				variant: "raised",
				color: [ "success", "success:pastel" ],
				className: "text-white bg-success-600 hover:bg-success-700 focus:bg-success-700 active:bg-success-800"
			}, {
				variant: "flat",
				color: [ "success", "success:pastel" ],
				className: "text-success hover:bg-success/10 focus:bg-success/15 active:bg-success/20"
			}, {
				variant: "outlined",
				color: [ "success", "success:pastel" ],
				className: "text-success hover:bg-success/10 focus:bg-success/15 active:bg-success/20 border-success/50"
			}, {
				variant: "raised",
				color: "success:pastel",
				className: "dark:text-success-950 dark:bg-success-300 dark:hover:bg-success-400 dark:focus:bg-success-400 dark:active:bg-success-500",
			}, {
				variant: "flat",
				color: "success:pastel",
				className: "dark:text-success-300 dark:hover:bg-success-300/10 dark:focus:bg-success-300/15 dark:active:bg-success-300/20",
			}, {
				variant: "outlined",
				color: "success:pastel",
				className: "dark:text-success-300 dark:hover:bg-success-300/10 dark:focus:bg-success-300/15 dark:active:bg-success-300/20 dark:border-success-300/50",
			},
			
			{
				variant: "raised",
				color: "neutral",
				className: [
					"text-white bg-neutral-600 hover:bg-neutral-700 focus:bg-neutral-700 active:bg-neutral-800",
					"dark:text-neutral-950 dark:bg-neutral-300 dark:hover:bg-neutral-400 dark:focus:bg-neutral-400 dark:active:bg-neutral-500"
				]
			}, {
				variant: "flat",
				color: "neutral",
				className: [
					"text-neutral hover:bg-neutral/10 focus:bg-neutral/15 active:bg-neutral/20",
					"dark:text-neutral-300 dark:hover:bg-neutral-300/10 dark:focus:bg-neutral-300/15 dark:active:bg-neutral-300/20"
				]
			}, {
				variant: "outlined",
				color: "neutral",
				className: [
					"text-neutral hover:bg-neutral/10 focus:bg-neutral/15 active:bg-neutral/20 border-neutral/50",
					"dark:text-neutral-300 dark:hover:bg-neutral-300/10 dark:focus:bg-neutral-300/15 dark:active:bg-neutral-300/20 dark:border-neutral-300/50"
				]
			}

			// {
			// 	variant: "raised",
			// 	color: "neutral",
			// 	className: "text-white bg-gray-600 hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-800 dark:text-gray-800 dark:bg-gray-300 dark:hover:bg-gray-200 dark:focus:bg-gray-200 dark:active:bg-gray-100"
			// }, {
			// 	variant: "flat",
			// 	color: "neutral",
			// 	className: "text-gray-800 bg-gray-800/5 dark:text-gray-200 dark:bg-gray-200/5 hover:bg-gray-800/10 focus:bg-gray-800/15 active:bg-gray-800/20 dark:hover:bg-gray-200/10 dark:focus:bg-gray-200/15 dark:active:bg-gray-200/20"
			// }, {
			// 	variant: "outlined",
			// 	color: "neutral",
			// 	className: "border-gray-800/50 dark:border-gray-200/50"
			// },

			// {
			// 	variant: "raised",
			// 	disabled: true,
			// 	className: "text-white bg-gray-500 shadow-none hover:shadow-none dark:text-white dark:bg-gray-500"
			// }, {
			// 	variant: "flat",
			// 	disabled: true,
			// 	className: "text-gray-700 dark:text-gray-200"
			// }, {
			// 	variant: "outlined",
			// 	disabled: true,
			// 	className: "text-gray-700 dark:text-gray-200 border-gray-500/50 dark:border-gray-400/50"
			// }

		]
	}),

	spinner: cva(null, {
		variants: {
			size: {
				"large": "w-6 -ml-2",
				"dense": "w-4",
				"default": "w-5",
				"md:large": "w-5 md:w-6 md:-ml-2 "
			}
		},
		defaultVariants: {
			size: "default"
		}
	})

};

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof classes.button> & Partial<{

	/**
	 * The color of the input
	 * @default "primary"
	 */
	color: "primary" | "primary:pastel" | "error" | "error:pastel" | "warning" | "warning:pastel" | "success" | "success:pastel" | "neutral";

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
		className: string;

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
		className: string;

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
				["WebkitFocusRingColor" as keyof CSSProperties]: "transparent"
			} satisfies CSSProperties) }>
			
			{ /* Spinner */ }
			{ !!loading && <Spinner
				{ ...(typeof loading === "boolean" ? {} : loading) }
				className={ cn(classes.spinner(props as VariantProps<typeof classes.spinner>), typeof loading === "boolean" ? "" : loading.className) } /> }
			
			{ children }
			
			{ /* Ripple */ }
			{ (props.disabled || (typeof ripple === "boolean" && !ripple)) || <Ripple { ...typeof ripple === "boolean" ? {} : ripple } /> }
			
		</button>
	);
});