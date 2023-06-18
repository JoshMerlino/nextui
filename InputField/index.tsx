"use client";

import { ClassValue } from "clsx";
import { InputHTMLAttributes, useEffect } from "react";
import { cn } from "../util";

interface Props {

	/**
	 * Additional class names to apply to the spinner.
	 */
	className?: ClassValue;

	/**
	 * Color of the button
	 * @default "neutral"
	 */
	color?: "primary" | "neutral" | "error" | "warning" | "success";

	/**
	 * Size of the button (this can be overridden by className)
	 * @default "medium"
	 */
	size?: "medium" | "large";

	/**
	 * Floating label tex
	 */
	label?: string;

	/**
	 * Underline hint or error text
	 */
	hint?: string;
	
}

export function InputField({ color = "primary", className, size = "medium", label, hint, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & Props): JSX.Element {
	"use client";

	// Initialize unique ID
	props.id = props.id || Math.floor(Math.random() * 1e10).toString(36);

	// Check for content
	useEffect(function() {
		if (!props.id) return;
		const input = document.getElementById(props.id) as HTMLInputElement;
		const setHasContent = (hasContent: boolean) => input.parentElement?.classList.toggle("hascontents", hasContent);
		setHasContent((input?.value.length || 0) > 0);
		input?.addEventListener("input", () => setHasContent(input.value.length > 0));
		return () => input?.removeEventListener("input", () => setHasContent(input.value.length > 0));
	});

	// Container classnames
	const container = [

		// Base classnames
		"relative group input-group flex items-center bg-inherit",

		// Size
		{
			"h-20": size === "medium",
			"h-24": size === "large",
		},

	];

	// Input classnames
	const input = [

		// Base classnames
		"peer text-gray-700 dark:text-gray-200 font-roboto font-normal disabled:border-dashed transition-colors placeholder-shown:border placeholder-shown:border-gray-500/20 border px-3 py-2.5 focus:px-[11px] focus:!border-2 rounded-lg border-gray-400/40 dark:border-gray-400/25 backdrop-blur-2xl !bg-transparent group-[.hascontents]:invalid:!border-error group-[.invalid]:!border-error placeholder:text-gray-600 dark:placeholder:text-gray-400 text-base focus:outline-none ",

		// Color
		{
			"focus:border-gray-800 dark:focus:border-gray-200": color === "neutral",
			"focus:border-primary dark:focus:border-primary": color === "primary",
			"focus:border-error dark:focus:border-error": color === "error",
			"focus:border-warning dark:focus:border-warning": color === "warning",
			"focus:border-success dark:focus:border-success": color === "success",
		},
		
		// Mobile check
		("ontouchstart" in document.documentElement) ? "md:text-sm" : "text-sm",

		// Size
		size === "large" ? "h-14 text-base px-5 focus:px-[19px]" : "h-10"

	];

	// Label classnames
	const labelStyles = [

		// Base classnames
		"text-gray-600 dark:text-gray-400 font-roboto font-normal px-1 absolute left-2 -translate-y-1/2 py-0.5 peer-focus:top-5 pointer-events-none peer-focus:text-xs peer-focus:px-2 peer-placeholder-shown:text-xs peer-placeholder-shown:px-2 peer-placeholder-shown:top-0.5 z-[1] transition-all bg-inherit group-[.hascontents]:text-xs group-[.hascontents]:px-2 group-[.hascontents]:top-5 group-[.hascontents]:peer-invalid:text-error group-[.invalid]:text-error whitespace-nowrap",

		// Height adjustment
		size === "large" ? "top-12 mx-2 text-base" : "top-10 text-sm",

		// Color
		{
			"peer-focus:text-gray-800 dark:peer-focus:text-gray-200": color === "neutral",
			"peer-focus:text-primary": color === "primary",
			"peer-focus:text-error": color === "error",
			"peer-focus:text-warning": color === "warning",
			"peer-focus:text-success": color === "success",
		}

	];

	return (
		<div className={ cn(container) }>

			{/* Input */}
			<input
				className={ cn(input, className) }
				{ ...props } />

			{/* Label */}
			{ label && <label
				className={ cn(labelStyles) }
				htmlFor={ props.id }>{label}</label>}
			
			{/* Hint */}
			<p className={ cn("bottom-0 text-xs font-medium font-roboto text-gray-600 dark:text-gray-400 group-[.hascontents]:peer-invalid:!text-error group-[.invalid]:!text-error absolute") }>{hint}</p>
			
		</div>
	);
}