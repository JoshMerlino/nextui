import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "nextui/util";
import { forwardRef, type HTMLAttributes } from "react";

export const classes = {

	card: cva("relative isolate rounded-lg p-4 text-gray-700 dark:text-gray-200", {
		variants: {
			variant: {
				popover: "bg-white dark:bg-gray-800 shadow-lg after:absolute after:inset-0 after:content-[''] after:bg-gray-100/50 dark:after:bg-gray-700/50 overflow-hidden after:-z-10 border border-gray-200 dark:border-gray-700",
				outlined: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
				flat: "bg-white/50 dark:bg-gray-800/50",
				raised: "bg-white dark:bg-gray-800 shadow-md",
				glass: "bg-white/50 dark:bg-gray-800/50 backdrop-filter backdrop-blur-md"
			}
		},
		defaultVariants: {
			variant: "raised"
		}
	})
    
};

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & VariantProps<typeof classes.card>>(function Card({ children, className, ...props }, ref) {
	return (
		<div
			{ ...props }
			className={ cn(classes.card(props as VariantProps<typeof classes.card>), className) }
			ref={ ref }>{ children }</div>
	);
});