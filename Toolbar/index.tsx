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

	/**
	 * If the toolbar should be elevated on scroll
	 * @default false
	 */
	elevate?: boolean;
	
}

export function Toolbar({ children, glassmorphism = true, className, raised: defaultRaised = false, htmlFor, elevate = false }: HTMLAttributes<HTMLElement> & Partial<Props>) {

	// If the toolbar should be elevated
	const [ raised, setRaised ] = useState(defaultRaised);
	
	// Bind defaultRaised changes
	useEffect(() => setRaised(defaultRaised), [ defaultRaised ]);

	// When the content scrolls, elevate the toolbar
	useEffect(function() {
		if (!htmlFor) return;
		
		// Get the content element
		const content = document.getElementById(htmlFor);
		if (!content) return;

		// When the content scrolls, elevate the toolbar
		function onScroll() {
			if (!content || !elevate) return;
			setRaised(content.scrollTop > 0);
		}

		// Add the event listener
		content.addEventListener("scroll", onScroll);
		() => content.removeEventListener("scroll", onScroll);
		
	}, [ elevate, htmlFor ]);

	// Toolbar styles
	const classes: ClassValue = [

		// Base class
		"min-h-[64px] transition-[box-shadow,background-color,border-color] flex items-center z-50 max-w-full",

		// Glassmorphism
		glassmorphism ? "backdrop-blur-lg dark:shadow-black/30" : "bg-gray-50 dark:bg-gray-900",

		// Raised
		raised ? "shadow-lg" : "shadow-none",

		// User classes
		className,

	];

	return (
		<header className={ cn(classes) }>
			{ children }
		</header>
	);
}