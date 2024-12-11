import { cva, type VariantProps } from "class-variance-authority";
import { merge } from "lodash";
import { cn } from "nextui/util";
import { forwardRef, type HTMLAttributes } from "react";
import "../index.css";

export const classes = {
	spinner: cva("aspect-square animate-spin shrink-0", {
		defaultVariants: {
			size: "large"
		},
		variants: {
			color: {
				"neutral": "text-gray-800 dark:text-gray-200",
				"primary": "text-primary",
				"primary:pastel": "text-primary dark:text-primary-300",
				"error": "text-error",
				"error:pastel": "text-error dark:text-error-300",
				"warning": "text-warning",
				"warning:pastel": "text-warning dark:text-warning-300",
				"success": "text-success",
				"success:pastel": "text-success dark:text-success-300"
			},
			size: {
				"large": "w-auto max-w-[48px]",
				"small": "min-w-6 w-6",
				"medium": "min-w-9 w-9"
			}
		}
	})
};

export const Spinner = forwardRef<SVGSVGElement, HTMLAttributes<SVGSVGElement> & VariantProps<typeof classes.spinner> & Partial<{

	/**
	 * Weather or not the spinner edges are rounded
	 * @default false
	 */
	rounded: boolean;

	/**
	 * Speed of the spinner animation
	 * @default 1.5s
	 * @example "2s" or 2000
	 */
	speed: string | number;

	/**
	 * The color of the input
	 * @default "primary"
	 */
	color: "primary" | "primary:pastel" | "error" | "error:pastel" | "warning" | "warning:pastel" | "success" | "success:pastel" | "neutral";

}>>(function({ className, speed = 2000, rounded, style, ...props }, ref) {
	return (
		<svg
			{ ...props }
			className={ cn(classes.spinner(props as VariantProps<typeof classes.spinner>), className) }
			ref={ ref }
			style={ merge({ animationDuration: typeof speed === "number" ? `${ speed }ms` : speed }, style) }
			viewBox="0 0 50 50">
			<circle
				className="stroke-current"
				cx="25"
				cy="25"
				fill="none"
				r="20"
				shapeRendering="geometricPrecision"
				strokeWidth="5"
				style={{
					strokeLinecap: rounded ? "round" : "butt",
					animation: "dash 1.5s ease-in-out infinite"
				}} />
		</svg>
	);
});