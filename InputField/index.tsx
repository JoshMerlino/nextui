"use client";

import { Card } from "@nextui/Card";
import { Ripple } from "@nextui/Ripple";
import { ClassValue } from "clsx";
import { InputHTMLAttributes, useEffect, useState } from "react";
import { MdArrowDropDown, MdVisibility, MdVisibilityOff } from "react-icons/md";
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
	size?: "dense" | "large";

	/**
	 * Floating label tex
	 */
	label?: string;
	
}

export function InputField({ color = "primary", className, size = "dense", label, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & Props): JSX.Element {
	
	// Initialize unique ID
	props.id = props.id || Math.floor(Math.random() * 1e10).toString(36);
	
	// Check if input has contents
	const [ hasContents, setHasContents ] = useState(false);
	const [ passwordVisible, setPasswordVisible ] = useState(false);
	
	useEffect(function() {
		if (!props.id) return;
		const input = document.getElementById(props.id) as HTMLInputElement;

		// Change event handler
		function change(event: Event) {
			const target = event.target as HTMLInputElement;
			setHasContents(!!target.value);
		}
		
		// Add event listeners
		input.addEventListener("change", change);
		() => input.removeEventListener("change", change);

	}, [ props.id ]);
	
	// Hook into password visibility
	useEffect(function() {
		if (!props.id || props.type !== "password") return;
		const input = document.getElementById(props.id) as HTMLInputElement;
		input.type = passwordVisible ? "text" : "password";
	}, [ props.id, passwordVisible, props.type ]);

	// Input classnames
	const input = {
		"peer text-gray-700 dark:text-gray-200 font-roboto bg-transparent font-normal placeholder:text-gray-600 dark:placeholder:text-gray-400 text-sm focus:outline-none grow": true,
		"pointer-events-none": props.disabled,
		"text-base": size === "large",
		"caret-gray-800 dark:caret-gray-200": color === "neutral",
		"caret-primary": color === "primary",
		"caret-error": color === "error",
		"caret-warning": color === "warning",
		"caret-success": color === "success",
	};
	
	// Input classnames
	const wrapper = {
		"peer border border-gray-400/40 dark:border-gray-400/25 ring-1 ring-transparent rounded-lg relative [&:has(:disabled)]:border-dashed flex gap-2 px-3 items-center bg-inherit transition-all select-none cursor-text h-10 group/wrapper": true,
		"cursor-not-allowed": props.disabled,
		"h-14 px-3.5": size === "large",
		"focus-within:border-gray-800 focus-within:ring-gray-800 dark:focus-within:border-gray-200 focus-within:ring-gray-200": color === "neutral",
		"focus-within:border-primary focus-within:ring-primary dark:focus-within:border-primary": color === "primary",
		"focus-within:border-error focus-within:ring-error dark:focus-within:border-error": color === "error",
		"focus-within:border-warning focus-within:ring-warning dark:focus-within:border-warning": color === "warning",
		"focus-within:border-success focus-within:ring-success dark:focus-within:border-success": color === "success",
	};

	// Label classnames
	const labelStyles = {
		"absolute select-none text-gray-600 dark:text-gray-400 text-sm font-roboto font-normal pointer-events-none whitespace-nowrap top-1/2 -translate-y-1/2 transition-[top,font-size,color]": true,
		"peer-focus-within:top-0 peer-focus-within:text-xs peer-focus-within:-mx-1.5 peer-focus-within:px-1.5 bg-inherit": true,
		"peer-placeholder-shown:top-0 peer-placeholder-shown:text-xs peer-placeholder-shown:-mx-1.5 peer-placeholder-shown:px-1.5 bg-inherit": true,
		"top-0 text-xs -mx-1.5 px-1.5": hasContents,
		"text-base": size === "large",
		"text-sm": size === "large" && hasContents,
		"peer-placeholder-shown:text-sm peer-focus-within:text-sm": size === "large",
		"peer-focus-within:text-gray-800 group-focus-within/wrapper:text-gray-800 dark:peer-focus-within:text-gray-200 dark:group-focus-within/wrapper:text-gray-200": color === "neutral",
		"peer-focus-within:text-primary group-focus-within/wrapper:text-primary": color === "primary",
		"peer-focus-within:text-error group-focus-within/wrapper:text-error": color === "error",
		"peer-focus-within:text-warning group-focus-within/wrapper:text-warning": color === "warning",
		"peer-focus-within:text-success group-focus-within/wrapper:text-success": color === "success",
	};

	const button = cn("relative flex items-center justify-center -mr-2 text-xl shrink-0 rounded-full w-7 h-7 aspect-square focus-within:outline-0 text-gray-800 dark:text-gray-200 overflow-hidden", size === "large" && "-mr-1 w-9 h-9 text-2xl");

	function setValue(value: string) {
		if (!props.id) return;
		const input = document.getElementById(props.id) as HTMLInputElement;

		// Set value
		input.value = value;
		input.dispatchEvent(new Event("change"));

	}

	return (
		<div className={ cn("relative group input-group items-center bg-inherit") }>
			<label className={cn(wrapper)} htmlFor={props.id}>
				<input className={ cn(input, className) } {...props} />
				{label && <p className={cn(labelStyles)}>{label}</p>}
				
				{/* Toggle password visibility */}
				{props.type === "password" && (
					<button className={cn(button, "hover:opacity-50 group-focus-within/wrapper:opacity-100 opacity-0 focus-within:bg-black/10 dark:focus-within:bg-white/20")} onClick={() => setPasswordVisible(a => !a)}>
						<Ripple emitFromCenter className="bg-black dark:bg-white"/>
						{ passwordVisible ? <MdVisibilityOff/> : <MdVisibility/> }
					</button>
				)}

				{/* Select dropdown arrow */}
				{props.type === "select" && (
					<button className={cn(button, "select-none")} tabIndex={-1}>
						<MdArrowDropDown />
					</button>
				)}

			</label>
			
			{/* Select dropdown */}
			{props.type === "select" && (
				<Card className="absolute top-full w-full z-[10] py-2 px-0">
					<ul>

						{[
							"Turkey",
							"Ham",
							"Chicken",
							"Beef",
							"Pork",
							"Fish",
							"Shrimp",
							"Crab",
							"Lobster",
						].map((item, key) => (
							<option value={item} key={key} onClick={ () => setValue(item) }>{item}</option>
						))}

					</ul>
				</Card>
			)}

		</div>
	);
}