"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "nextui/util";
import { forwardRef, type ButtonHTMLAttributes, type ReactElement } from "react";
import type { IconType } from "react-icons";
import { Ripple } from "./Ripple";

export const classes = {

	icon: cva([
		"rounded-full select-none p-0.5 shrink-0 overflow-hidden aspect-square relative inline-flex items-center justify-center",
		"hover:bg-black/5 dark:hover:bg-white/5 focus:outline-0 focus:bg-black/5 dark:focus:bg-white/5"
	], {
		defaultVariants: {
			size: "large"
		},
		variants: {
			size: {
				large: "w-12 h-12 text-2xl",
				medium: "w-10 h-10 text-xl",
				small: "w-8 h-8 text-base",
			}
		}
	})
	
};

export const IconButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof classes.icon> & Partial<{

		/**
	 * The icon to display in the input
	 */
	icon: IconType | ReactElement;

}>>(function({ className, icon: Icon, ...props }, ref) {
	return (
		<button
			className={ cn(classes.icon(props as VariantProps<typeof classes.icon>), className) }
			ref={ ref }
			type="button"
			{ ...props }>
			<Ripple className="bg-black/20 dark:bg-white/20" emitFromCenter />
			{ Icon && typeof Icon === "function" ? <Icon /> : Icon }
		</button>
	);
});
