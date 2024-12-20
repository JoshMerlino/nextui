"use client";

import { ClassValue } from "clsx";
import { useEvent } from "nextui/hooks";
import { InputHTMLAttributes, forwardRef, useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { MdArrowDropDown, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Card } from "../Card";
import { Ripple } from "../Ripple";
import { cn } from "../util";

export interface InputFieldProps {

	/**
	 * Additional class names to apply to the spinner.
	 */
	className: ClassValue;

	/**
	 * Color of the button
	 * @default "neutral"
	 */
	color: "primary" | "neutral" | "error" | "warning" | "success";

	/**
	 * Size of the button (this can be overridden by className)
	 * @default "dense"
	 */
	size: "dense" | "large";

	/**
	 * Floating label tex
	 */
	label: string;

	/**
	 * Options for select inputs
	 */
	options: Array<string | Option>;

	/**
	 * Whether the input is invalid
	 * @default false
	 */
	invalid: boolean;

	before?: ReactNode;
	after?: ReactNode;

	/**
	 * Whether the color should be pastel on dark mode
	 */
	pastel?: boolean;
	
}

interface Option {

	/**
	 * The value of the option
	 */
	value: string;

	/**
	 * The label of the option
	 */
	label?: string;

	/**
	 * Icon to display next to the option
	 */
	icon?: ReactNode;

	/**
	 * The label of the option
	 */
	disabled?: boolean;

}

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & Partial<InputFieldProps>

export const InputField = forwardRef<HTMLInputElement, Props>(function({ color = "primary", before, after, className, size = "dense", label, pastel = false, options: ox, invalid = false, ...props }, fref) {

	const options = useMemo(() => ox?.map(value => typeof value === "string" ? { value } : value), [ ox ]);
	const labelRef = useRef<HTMLParagraphElement>(null);

	const ref = useRef<HTMLDivElement>(null);
	
	// Initialize unique ID
	props.id = props.id || Math.floor(Math.random() * 1e10).toString(36) as string;

	// Make dropdowns readonly
	if (props.type === "select") props.readOnly = true;
	
	// Check if input has contents
	const [ hasContents, setHasContents ] = useState(false);
	const [ passwordVisible, setPasswordVisible ] = useState(false);
	const [ icon, setIcon ] = useState<ReactNode | null>(before);
	const [ value, setValueState ] = useState<Option | null>(null);
	
	// Select dropdown states
	const dropdownRef = useRef<HTMLDialogElement>(null);
	const [ dropdownOpen, setDropdownOpen ] = useState(false);
	const [ dropdownVisible, setDropdownVisible ] = useState(false);
	const [ activeKey, setActiveKey ] = useState(-1);

	// Hook into input changes 
	useEffect(function effect() {
		if (!props.id) return;
		const input = document.getElementById(props.id) as HTMLInputElement;
		
		if (props.defaultValue && typeof props.defaultValue === "string" && activeKey === -1) {
			setHasContents(true);
			setActiveKey(options?.filter(a => !a.disabled).map(a => a.value).indexOf(props.defaultValue) ?? -1);
		}

		// Change event handler
		function change(event: Event) {
			const target = event.target as HTMLInputElement;
			setHasContents(!!target.value);
			setValueState(options?.find(a => a.value === target.value) || options?.find(a => a.label === target.value) || null);
		}

		if (!input) {
			requestAnimationFrame(effect);
			return;
		}
		
		// Add event listeners
		input.addEventListener("change", change);
		return () => input.removeEventListener("change", change);

	}, [ props.id, props.type, props.defaultValue, options, activeKey ]);
	
	// Hook into password visibility
	useEffect(function effect() {
		if (!props.id || props.type !== "password") return;
		const input = document.getElementById(props.id) as HTMLInputElement;
		if (!input) {
			requestAnimationFrame(effect);
			return;
		}
		input.type = passwordVisible ? "text" : "password";
	}, [ props.id, passwordVisible, props.type ]);

	// Input classnames
	const input = {
		"peer text-gray-700 dark:text-gray-200 font-roboto bg-transparent font-normal placeholder:text-gray-600 dark:placeholder:text-gray-400 text-sm focus:outline-none grow h-full appearance-none": true,
		"pointer-events-none": props.disabled,
		"select-none": props.type === "select",
		"text-base": size === "large",
		"caret-gray-800 dark:caret-gray-200": color === "neutral",
		"caret-primary": color === "primary",
		"caret-error": color === "error" || invalid,
		"caret-warning": color === "warning",
		"caret-success": color === "success",
		"invalid:caret-error": hasContents,

		"dark:caret-primary-300": pastel && color === "primary",
		"dark:caret-error-300": pastel && color === "error",
		"dark:caret-warning-300": pastel && color === "warning",
		"dark:caret-success-300": pastel && color === "success",
		"dark:caret-error": invalid,
	};
	
	// Input classnames
	const wrapper = {
		"border border-gray-400/40 dark:border-gray-400/25 ring-1 ring-transparent rounded-lg relative [&:has(:disabled)]:border-dashed flex gap-2 px-3 items-center bg-inherit transition-all select-none cursor-text h-10 group/wrapper rounded-lg": true,
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
		"[&:has(:invalid)]:border-error [&:has(:invalid)]:focus-within:ring-error [&:has(:invalid)]:dark:border-error/50  [&:has(:invalid)]:dark:focus-within:border-error": hasContents,
		"!border-error focus-within:!ring-error dark:!border-error/50  dark:focus-within:!border-error": invalid,

		"focus-within:dark:ring-primary-300 focus-within:dark:border-primary-300 dark:focus-within:border-primary-300": pastel && color === "primary",
		"focus-within:dark:ring-error-300 focus-within:dark:border-error-300 dark:focus-within:border-error-300": pastel && color === "error",
		"focus-within:dark:ring-warning-300 focus-within:dark:border-warning-300 dark:focus-within:border-warning-300": pastel && color === "warning",
		"focus-within:dark:ring-success-300 focus-within:dark:border-success-300 dark:focus-within:border-success-300": pastel && color === "success",
		"dark:ring-primary-300 dark:border-primary-300": pastel && color === "primary" && dropdownVisible,
		"dark:ring-error-300 dark:border-error-300": pastel && color === "error" && dropdownVisible,
		"dark:ring-warning-300 dark:border-warning-300": pastel && color === "warning" && dropdownVisible,
		"dark:ring-success-300 dark:border-success-300": pastel && color === "success" && dropdownVisible

	};

	// Label classnames
	const labelStyles = {
		"absolute select-none text-gray-600 dark:text-gray-400 text-sm font-roboto font-normal pointer-events-none whitespace-nowrap top-1/2 -translate-y-1/2 transition-[top,font-size,color,padding] bg-inherit rounded-md -mx-1.5 px-1.5": true,
		"peer-focus-within:top-0 peer-focus-within:text-xs peer-focus-within:-mx-1.5 peer-focus-within:px-1.5": true,
		"peer-placeholder-shown:top-0 peer-placeholder-shown:text-xs peer-placeholder-shown:-mx-1.5 peer-placeholder-shown:px-1.5": true,
		"top-0 text-xs": (hasContents || !!props.placeholder),
		"text-base": size === "large",
		"text-sm": size === "large" && (hasContents || !!props.placeholder),
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
		"peer-invalid:text-error peer-invalid:dark:text-error": (hasContents || !!props.placeholder),
		"!text-error dark:!text-error": invalid,

		"peer-focus-within:dark:text-primary-300 dark:group-focus-within/wrapper:text-primary-300": pastel && color === "primary",
		"peer-focus-within:dark:text-error-300 dark:group-focus-within/wrapper:text-error-300": pastel && color === "error",
		"peer-focus-within:dark:text-warning-300 dark:group-focus-within/wrapper:text-warning-300": pastel && color === "warning",
		"peer-focus-within:dark:text-success-300 dark:group-focus-within/wrapper:text-success-300": pastel && color === "success",
		"dark:text-primary-300": pastel && color === "primary" && dropdownVisible,
		"dark:text-error-300": pastel && color === "error" && dropdownVisible,
		"dark:text-warning-300": pastel && color === "warning" && dropdownVisible,
		"dark:text-success-300": pastel && color === "success" && dropdownVisible
	};

	// Button classnames
	const button = {
		"relative flex items-center justify-center -mr-2 text-xl shrink-0 rounded-full w-7 h-7 aspect-square focus-within:outline-0 text-gray-800 dark:text-gray-200 overflow-hidden": true,
		"-mr-1 w-9 h-9 text-2xl": size === "large"
	};

	// Dropdown classnames
	const dropdownCard = {
		"transition-[transform,opacity] select-none duration-75 p-0 origin-top bg-white dark:bg-gray-900 after:absolute after:inset-0 after:content-[''] after:bg-gray-50/50 dark:after:bg-gray-800/50 after:-z-10 isolate": true,
		"scale-100 opacity-100": dropdownVisible,
		"scale-75 opacity-0 pointer-events-none": !dropdownVisible
	};

	const dropdownItem = {
		"relative flex items-center px-4 overflow-hidden text-sm h-9 hover:bg-gray-50 hover:dark:bg-gray-700/25": true,
		"h-12 text-base font-medium": size === "large",
	};
	
	// Helper functions for select dropdown
	const open = useCallback(function() {

		if (!props.id) return;
		const input = ref.current?.querySelector("input");
		
		input?.focus();

		// Make sure its a dropdown
		if (props.type !== "select") return;
		if (props.disabled) return;

		setDropdownOpen(true);
		requestAnimationFrame(() => setDropdownVisible(true));
		
	}, [ props.disabled, props.id, props.type ]);
	
	// Close dropdown
	const close = useCallback(function() {
		setDropdownVisible(false);
		requestAnimationFrame(() => dropdownRef.current?.addEventListener("transitionend", () => setDropdownOpen(false), { once: true }));
	}, []);
	
	// Set input value
	const setValue = useCallback(function(iv: string | Option, key?: number) {

		if (key !== undefined && key > -1) setActiveKey(key);

		if (!props.id) return;
		const input = ref.current?.querySelector("input");

		if (typeof iv === "object" && iv.disabled || typeof iv !== "object" || !input) return;

		setIcon(iv.icon || null);

		input.value = iv.value;

		setValueState(options?.find(a => a.value === iv.value) || options?.find(a => a.label === iv.value) || null);
		
		input.dispatchEvent(new Event("change", { bubbles: true }));
		if (props.onChange) props.onChange({ target: input } as ChangeEvent<HTMLInputElement>);

		// Close dropdown
		close();
		
	}, [ close, options, props ]);

	const change = useCallback(function(event: Event) {
		const target = event?.target as HTMLInputElement;
		if (!target) return;
		setValueState(options?.find(a => a.value === target.value) || options?.find(a => a.label === target.value) || null);
	}, [ options ]);

	// Bind event listeners
	useEffect(function() {
		if (!props.id || props.type !== "select") return;
		const input = ref.current?.querySelector("input");
		
		function keydown(event: KeyboardEvent) {

			if (!options) return;
			switch (event.key) {
				case "Enter":
					if (!dropdownVisible) open();
					else {
						setValue(options[activeKey], activeKey);
						setValueState(options?.find(a => a.value === options[activeKey].value) || options?.find(a => a.label === options[activeKey].label) || null);
					}
					break;
				case "Escape":
					close();
					break;
				case "ArrowDown": {
					event.preventDefault();
					let key = (activeKey + 1) % options.length;
					if (key < 0) key = 0;
					if (options[key].disabled) break;
					if (dropdownVisible || dropdownOpen) setActiveKey(key);
					else {
						setValue(options[key], key);
						setValueState(options?.find(a => a.value === options[key].value) || options?.find(a => a.label === options[key].label) || null);
					}
					break;
				}
				case "ArrowUp": {
					event.preventDefault();
					let key = (activeKey - 1 + options.length) % options.length;
					if (key < 0) key = options.length - 1;
					if (options[key].disabled) break;
					if (dropdownVisible || dropdownOpen) setActiveKey(key);
					else {
						setValue(options[key], key);
						setValueState(options?.find(a => a.value === options[key].value) || options?.find(a => a.label === options[key].label) || null);
					}
					break;
				}
			}
		}

		const focus = () => requestAnimationFrame(open);
		function labelMousedown(event: MouseEvent) {
			event.preventDefault();
			open();
		}

		if (!input) return;

		// On focus open, and on blur close
		input.addEventListener("focus", focus);
		input.addEventListener("blur", close);
		input.addEventListener("change", change);
		input.addEventListener("mousedown", open);
		input.addEventListener("keydown", keydown);
		input.parentElement?.addEventListener("mousedown", labelMousedown);
		input.parentElement?.addEventListener("click", labelMousedown);
		
		return function() {
			input.removeEventListener("focus", focus);
			input.removeEventListener("blur", close);
			input.removeEventListener("change", change);
			input.removeEventListener("mousedown", open);
			input.removeEventListener("keydown", keydown);
			input.parentElement?.removeEventListener("mousedown", labelMousedown);
			input.parentElement?.removeEventListener("click", labelMousedown);
		};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ activeKey, dropdownVisible, options, props.id, props.type ]);
	
	// Make sure the dialog isnt off the screen
	useEffect(function() {
		if (!dropdownRef.current) return;
		const dialog = dropdownRef.current;

		// Get the bounding rect of the dialog
		const rect = dialog.getBoundingClientRect();

		// If the dialog is off the screen, move it
		if (rect.bottom - 32 > window.innerHeight) {
			const translate = window.innerHeight - rect.bottom - 32;
			dialog.style.transform = `translateY(${ translate }px)`;
		} else {
			dialog.style.transform = "";
		}

	}, [ dropdownRef, dropdownVisible ]);
	
	useEvent("click", function documentClick(event: MouseEvent) {
		if (!ref.current?.contains(event.target as Node)) close();
	});

	// Set the initial icon
	useEffect(function() {

		const input = ref.current?.querySelector("input");
		if (!input) return;

		// Set the initial icon
		const selected = options?.find(a => a.value === input.value) || options?.find(a => a.label === input.value) || null;
		if (!selected || selected.value === value?.value) return;

		setValue(selected);

	}, [ props, value, options, setValue ]);

	return (
		<div className={ cn("relative group input-group items-center bg-inherit rounded-lg") } ref={ ref }>
			<label className={ cn(wrapper, "rounded-lg", className) } htmlFor={ props.id }>

				{ icon && (
					<div className="w-6 h-6 items-center justify-center flex">
						{ icon }
					</div>
				) }

				{ /* Input */ }
				<div className="relative bg-inherit grow flex">
					<input className={ cn(input, className, props.type === "select" && "opacity-0 w-0 grow-0") } ref={ fref } { ...props } />
					{ props.type === "select" && <p className={ cn(input, className, !(value?.label || value?.value) && "text-gray-600 dark:text-gray-400") }>{ (value?.label || value?.value) || props.placeholder }</p> }
				</div>
				{ label && <p className={ cn(labelStyles, className, "w-auto") } ref={ labelRef }>{ label }</p> }
				
				{ /* Toggle password visibility */ }
				{ props.type === "password" && (
					<button className={ cn(button, "hover:opacity-50 group-focus-within/wrapper:opacity-100 opacity-0 focus-within:bg-black/10 dark:focus-within:bg-white/20") } onClick={ () => setPasswordVisible(a => !a) } type="button">
						<Ripple className="bg-black dark:bg-white" emitFromCenter />
						{ passwordVisible ? <MdVisibilityOff /> : <MdVisibility /> }
					</button>
				) }

				{ /* Select dropdown arrow */ }
				{ props.type === "select" && (
					<div className={ cn(button, "pointer-events-none select-none") }>
						<MdArrowDropDown />
					</div>
				) }

				{ after }

			</label>
			
			{ /* Select dropdown */ }
			{ props.type === "select" && (
				<dialog
					className={ cn("m-0 w-[calc(100%_+_2px)] p-0 pt-[1px] focus-within:outline-0 -mx-[1px] top-full bg-transparent", (dropdownOpen || dropdownVisible) && "z-[10]", !dropdownVisible && "pointer-events-none") }
					onClick={ e => [ e.preventDefault(), e.stopPropagation() ] }
					onMouseDown={ e => [ e.preventDefault(), e.stopPropagation() ] }
					open={ dropdownOpen || dropdownVisible }
					ref={ dropdownRef }>
					<Card className={ cn(dropdownCard) }>
						<ul className="flex flex-col py-2">
							
							{ /* Dropdown options */ }
							{ options?.map((option, key) => (
								<li className={ cn(dropdownItem, (activeKey === key) && "bg-gray-50 dark:bg-gray-700/25", option.disabled && "pointer-events-none opacity-50") }
									key={ key }
									onClick={ () => !option.disabled && setValue(option, key) }>
									{ !option.disabled && <Ripple className="bg-black/10 dark:bg-white/10" /> }
									<div className="flex items-center gap-2">
										{ option.icon && <div className="flex items-center justify-center w-6 h-6">{ option.icon }</div> }
										<p className="text-gray-800 dark:text-gray-200">{ option.label || option.value }</p>
									</div>
								</li>
							)) }
						
						</ul>
					</Card>
				</dialog>
			) }

		</div>
	);
});