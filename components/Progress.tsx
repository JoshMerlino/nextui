import { cva, type VariantProps } from "class-variance-authority";
import { useConvergedRef } from "nextui/hooks";
import { forwardRef, type HTMLAttributes } from "react";
import "../index.css";
import { cn } from "../util";

export const classes = {

	progress: cva([
		"appearance-none border-none h-1 progress-bar progress-bar:bg-transparent progress-fill:bg-current",
		"indeterminate:animate-[progress-linear_2s_infinite_linear] bg-[rgba(currentColor,0.15)]"
	], {
		defaultVariants: {
			color: "primary"
		},
		variants: {
			color: {
				primary: "text-primary",
				"primary:pastel": "text-primary dark:text-primary-300",
				error: "text-error",
				"error:pastel": "text-error dark:text-error-300",
				warning: "text-warning",
				"warning:pastel": "text-warning dark:text-warning-300",
				success: "text-success",
				"success:pastel": "text-success dark:text-success-300",
				neutral: "text-current",
			}
		}
	})

};

export const Progress = forwardRef<HTMLProgressElement, HTMLAttributes<HTMLProgressElement> & Partial<{

	/**
	 * Value as a percentage (0-1). When not provided, the progress bar will be indeterminate.
	 * @example 0.5
	 */
	value?: number;
	
}>>(function({ className, ...props }, fref) {
	const ref = useConvergedRef(fref);
	return (
		<progress
			{ ...props }
			className={ cn(classes.progress(props as VariantProps<typeof classes.progress>), className) }
			ref={ ref } />
	);
});