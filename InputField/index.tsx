"use client";

import { ClassValue } from "clsx";
import { ChangeEvent, InputHTMLAttributes, useEffect, useRef, useState } from "react";
import { MdArrowDropDown, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Card } from "../Card";
import { Ripple } from "../Ripple";
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

	/**
	 * Options for select inputs
	 */
	options?: string[];
	
}

export function InputField({ color = "primary", className, size = "dense", label, options, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & Props): JSX.Element {
	
	// Initialize unique ID
	props.id = props.id || Math.floor(Math.random() * 1e10).toString(36);

	// Make dropdowns readonly
	if (props.type === "select") props.readOnly = true;
	
	// Check if input has contents
	const [ hasContents, setHasContents ] = useState(false);
	const [ passwordVisible, setPasswordVisible ] = useState(false);
	
	// Select dropdown states
	const dropdownRef = useRef<HTMLDialogElement>(null);
	const [ dropdownOpen, setDropdownOpen ] = useState(false);
	const [ dropdownVisible, setDropdownVisible ] = useState(false);
	const [ activeKey, setActiveKey ] = useState(-1);

	// Hook into input changes 
	useEffect(function() {
		if (!props.id) return;
		const input = document.getElementById(props.id) as HTMLInputElement;

		if (props.defaultValue && typeof props.defaultValue === "string" && activeKey === -1) {
			setHasContents(true);
			setActiveKey(options?.indexOf(props.defaultValue) ?? -1);
		}

		// Change event handler
		function change(event: Event) {
			const target = event.target as HTMLInputElement;
			setHasContents(!!target.value);
		}
		
		// Add event listeners
		input.addEventListener("change", change);
		() => input.removeEventListener("change", change);

	}, [ props.id, props.type, props.defaultValue, options, activeKey ]);
	
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
		"select-none": props.type === "select",
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
		"border-gray-800 ring-gray-800 dark:border-gray-200 dark:ring-gray-200": dropdownVisible && color === "neutral",
		"border-primary ring-primary dark:border-primary dark:ring-primary": dropdownVisible && color === "primary",
		"border-error ring-error dark:border-error dark:ring-error": dropdownVisible && color === "error",
		"border-warning ring-warning dark:border-warning dark:ring-warning": dropdownVisible && color === "warning",
		"border-success ring-success dark:border-success dark:ring-success": dropdownVisible && color === "success",
		
	};

	// Label classnames
	const labelStyles = {
		"absolute select-none text-gray-600 dark:text-gray-400 text-sm font-roboto font-normal pointer-events-none whitespace-nowrap top-1/2 -translate-y-1/2 transition-[top,font-size,color] pointer-events-none": true,
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
		"text-gray-800 dark:text-gray-200": dropdownVisible && color === "neutral",
		"text-primary dark:text-primary": dropdownVisible && color === "primary",
		"text-error dark:text-error": dropdownVisible && color === "error",
		"text-warning dark:text-warning": dropdownVisible && color === "warning",
		"text-success dark:text-success": dropdownVisible && color === "success",
	};

	// Button classnames
	const button = {
		"relative flex items-center justify-center -mr-2 text-xl shrink-0 rounded-full w-7 h-7 aspect-square focus-within:outline-0 text-gray-800 dark:text-gray-200 overflow-hidden": true,
		"-mr-1 w-9 h-9 text-2xl": size === "large"
	};

	// Dropdown classnames
	const dropdownCard = {
		"transition-[transform,opacity] select-none duration-75 p-0 origin-top": true,
		"scale-100 opacity-100": dropdownVisible,
		"scale-75 opacity-0 pointer-events-none": !dropdownVisible
	};

	const dropdownItem = {
		"relative flex items-center px-4 overflow-hidden text-sm h-9 hover:bg-gray-200/50 dark:hover:bg-gray-700/50": true,
		"h-12 text-base font-medium": size === "large",
	};
	
	// Helper functions for select dropdown
	function open() {

		if (!props.id) return;
		const input = document.getElementById(props.id) as HTMLInputElement;
		input.focus();

		// Make sure its a dropdown
		if (props.type !== "select") return;
		if (props.disabled) return;

		setDropdownOpen(true);
		requestAnimationFrame(() => setDropdownVisible(true));
	}
	
	// Close dropdown
	function close() {
		setDropdownVisible(false);
		requestAnimationFrame(() => dropdownRef.current?.addEventListener("transitionend", () => setDropdownOpen(false), { once: true }));
	}
	
	// Set input value
	function setValue(value: string, key?: number) {
		if (key !== undefined && key > -1) setActiveKey(key);

		if (!props.id) return;
		const input = document.getElementById(props.id) as HTMLInputElement;

		// Set value and dispatch change event
		input.value = value;
		input.dispatchEvent(new Event("change", { bubbles: true }));
		if (props.onChange) props.onChange({ target: input } as ChangeEvent<HTMLInputElement>);

		// Close dropdown
		close();
		
	}

	// Bind event listeners
	useEffect(function() {
		if (!props.id) return;
		const input = document.getElementById(props.id) as HTMLInputElement;

		function keydown(event: KeyboardEvent) {
			if (!options) return;
			switch (event.key) {
				case "Enter":
					if (!dropdownVisible) open();
					else setValue(options[activeKey], activeKey);
					break;
				case "Escape":
					close();
					break;
				case "ArrowDown": {
					event.preventDefault();
					let key = (activeKey + 1) % options.length;
					if (key < 0) key = 0;
					if (dropdownVisible || dropdownOpen) setActiveKey(key);
					else setValue(options[key], key);
					break;
				}
				case "ArrowUp": {
					event.preventDefault();
					let key = (activeKey - 1 + options.length) % options.length;
					if (key < 0) key = (options.length - 1);
					if (dropdownVisible || dropdownOpen) setActiveKey(key);
					else setValue(options[key], key);
					break;
				}
			}
		}

		const focus = () => requestAnimationFrame(open);
		function labelMousedown(event: MouseEvent) {
			event.preventDefault();
			open();
		}

		// On focus open, and on blur close
		input.addEventListener("focus", focus);
		input.addEventListener("blur", close);
		input.addEventListener("mousedown", open);
		input.addEventListener("keydown", keydown);
		input.parentElement?.addEventListener("mousedown", labelMousedown);
		input.parentElement?.addEventListener("click", labelMousedown);
		
		return function() {
			input.removeEventListener("focus", focus);
			input.removeEventListener("blur", close);
			input.removeEventListener("mousedown", open);
			input.removeEventListener("keydown", keydown);
			input.parentElement?.removeEventListener("mousedown", labelMousedown);
			input.parentElement?.removeEventListener("click", labelMousedown);

		};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ activeKey, dropdownVisible, options, props.id ]);
	
	// Make sure the dialog isnt off the screen
	useEffect(function() {
		if (!dropdownRef.current) return;
		const dialog = dropdownRef.current;

		// Get the bounding rect of the dialog
		const rect = dialog.getBoundingClientRect();

		// If the dialog is off the screen, move it
		if (rect.bottom - 16 > window.innerHeight) {

			// Translate so its 16px from the bottom of the screen
			const translate = window.innerHeight - rect.bottom - 16;
			dialog.style.transform = `translateY(${ translate }px)`;

		}

	}, [ dropdownRef, dropdownVisible ]);

	return (
		<div className={ cn("relative group input-group items-center bg-inherit") }>
			<label className={ cn(wrapper) } htmlFor={ props.id }>
				<input className={ cn(input, className) } { ...props } />
				{label && <p className={ cn(labelStyles) }>{label}</p>}
				
				{/* Toggle password visibility */}
				{props.type === "password" && (
					<button className={ cn(button, "hover:opacity-50 group-focus-within/wrapper:opacity-100 opacity-0 focus-within:bg-black/10 dark:focus-within:bg-white/20") } onClick={ () => setPasswordVisible(a => !a) }>
						<Ripple className="bg-black dark:bg-white" emitFromCenter />
						{ passwordVisible ? <MdVisibilityOff /> : <MdVisibility /> }
					</button>
				)}

				{/* Select dropdown arrow */}
				{props.type === "select" && (
					<div className={ cn(button, "pointer-events-none select-none") }>
						<MdArrowDropDown />
					</div>
				)}

			</label>
			
			{/* Select dropdown */}
			{props.type === "select" && (
				<dialog
					className={ cn("m-0 w-full p-0 pt-[1px] bg-transparent focus-within:outline-0", (dropdownOpen || dropdownVisible) && "z-[10]", !dropdownVisible && "pointer-events-none") }
					onMouseDown={ e => e.preventDefault() }
					open={ dropdownOpen || dropdownVisible }
					ref={ dropdownRef }>
					<Card className={ cn(dropdownCard) }>
						<ul className="flex flex-col py-2">
							
							{/* Dropdown options */}
							{options?.map((option, key) => (
								<li className={ cn(dropdownItem, (activeKey === key) && "bg-gray-200/75 dark:bg-gray-700/75 hover:first-letter:bg-gray-200/50 hover:first-letter:dark:bg-gray-700/50") }
									key={ key }
									onClick={ () => setValue(option, key) }>
									<Ripple className="bg-black/50 dark:bg-white/50" />
									{option}
								</li>
							))}
						
						</ul>
					</Card>
				</dialog>
			)}

		</div>
	);
}