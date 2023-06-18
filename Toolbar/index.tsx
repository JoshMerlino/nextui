export { ToolbarShell } from "./Shell";

import { ClassValue } from "clsx";
import { HTMLAttributes } from "react";
import { cn } from "../util";

interface Props {

	/**
	 * Glassmorphism backdrop blur
	 * @default true
	 */
	glassmorphism: boolean;

	/**
	 * If the toolbar is raised
	 * @default false
	 */
	raised: boolean;
	
}

export function Toolbar({ children, glassmorphism = true, className, raised }: HTMLAttributes<HTMLElement> & Partial<Props>) {

	// Toolbar styles
	const classes: ClassValue = [

		// Base class
		"min-h-[64px] transition-shadow flex items-center px-4",

		// Glassmorphism
		glassmorphism ? "backdrop-blur-lg bg-white/50 dark:bg-gray-950/50" : "bg-white dark:bg-gray-800",

		// Raised
		raised ? "shadow-lg" : "shadow-none",

		// User classes
		className,

	];

	return (
		<header className={ cn(classes) }>
			{children}
		</header>
	);
}