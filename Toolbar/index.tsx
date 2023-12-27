"use client";

export { ToolbarShell } from "./Shell";

import { ClassValue } from "clsx";
import { HTMLAttributes, useEffect, useState } from "react";
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

	/**
	 * Which content this toolbar is for. When that content begins scrolling, it will elevate the toolbar
	 */
	htmlFor?: string;
	
}

export function Toolbar({ children, glassmorphism = true, className, raised = false, htmlFor }: HTMLAttributes<HTMLElement> & Partial<Props>) {

	// If the toolbar should be elevated
	const [ elevate, setElevate ] = useState(raised);

	// When the content scrolls, elevate the toolbar
	useEffect(function() {
		if (!htmlFor) return;
		
		// Get the content element
		const content = document.getElementById(htmlFor);
		if (!content) return;

		// When the content scrolls, elevate the toolbar
		function onScroll() {
			if (!content) return;
			setElevate(content.scrollTop > 0);
		}

		// Add the event listener
		content.addEventListener("scroll", onScroll);
		() => content.removeEventListener("scroll", onScroll);
		
	}, [ htmlFor ]);

	// Toolbar styles
	const classes: ClassValue = [

		// Base class
		"min-h-[64px] transition-shadow flex items-center z-50 max-w-full",

		// Glassmorphism
		glassmorphism ? "backdrop-blur-lg bg-white/50 dark:bg-gray-950/50" : "bg-white dark:bg-gray-800",

		// Raised
		(raised || elevate) ? "shadow-lg" : "shadow-none",

		// User classes
		className,

	];

	return (
		<header className={ cn(classes) }>
			{children}
		</header>
	);
}