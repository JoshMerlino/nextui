"use client";
import { ClassValue } from "clsx";
import { TextareaHTMLAttributes, useEffect, useRef, useState } from "react";
import { cn } from "../util";

interface Props {

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
	 * Floating label text
	 */
	label: string;

	/**
	 * Whether the input is invalid
	 * @default false
	 */
	invalid: boolean;

}

export function MultilineInputField({ invalid = false, className, color = "primary", label, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & Partial<Props>): JSX.Element {

	const [ hasContents, setHasContents ] = useState(false);
	const ref = useRef<HTMLLabelElement>(null);

	// Initialize unique ID
	props.id = props.id || Math.floor(Math.random() * 10000000000).toString(36);

	// Keep the height of the textarea in sync with its contents
	function resize(event: { target: HTMLTextAreaElement }) {
		const target = event.target as HTMLTextAreaElement;
		if (!target) return;
		target.style.height = "auto";
		target.style.height = target.scrollHeight + "px";
	}

	// Input classnames
	const input = {
		"peer focus:outline-0 text-gray-700 dark:text-gray-200 font-roboto bg-transparent font-normal placeholder:text-gray-600 dark:placeholder:text-gray-400 text-base w-full min-h-full resize-none py-4 appearance-none": true,
		"pointer-events-none": props.disabled,
		"caret-gray-800 dark:caret-gray-200": color === "neutral",
		"caret-primary": color === "primary",
		"caret-error": color === "error" || invalid,
		"caret-warning": color === "warning",
		"caret-success": color === "success",
		"invalid:caret-error": hasContents,
	};

	// Wrapper classnames
	const wrapper = {
		"border border-gray-400/40 dark:border-gray-400/25 ring-1 ring-transparent rounded-lg relative [&:has(:disabled)]:border-dashed flex gap-2 px-4 items-center bg-inherit transition-all select-none cursor-text group/wrapper rounded-lg h-full": true,
		"focus-within:border-gray-800 focus-within:ring-gray-800 dark:focus-within:border-gray-200 focus-within:ring-gray-200": color === "neutral",
		"focus-within:border-primary focus-within:ring-primary dark:focus-within:border-primary": color === "primary",
		"focus-within:border-error focus-within:ring-error dark:focus-within:border-error": color === "error",
		"focus-within:border-warning focus-within:ring-warning dark:focus-within:border-warning": color === "warning",
		"focus-within:border-success focus-within:ring-success dark:focus-within:border-success": color === "success",
		"[&:has(:invalid)]:border-error [&:has(:invalid)]:focus-within:ring-error [&:has(:invalid)]:dark:border-error": hasContents,
		"!border-error focus-within:!ring-error dark:!border-error": invalid,
	};

	// Label classnames
	const labelStyles = {
		"absolute select-none text-gray-600 dark:text-gray-400 font-roboto font-normal pointer-events-none whitespace-nowrap transition-[top,font-size,color,transform] bg-inherit rounded-md text-base -mx-1.5 px-1.5": true,
		"text-sm": hasContents,
		"peer-focus-within:text-gray-800 group-focus-within/wrapper:text-gray-800 dark:peer-focus-within:text-gray-200 dark:group-focus-within/wrapper:text-gray-200": color === "neutral",
		"peer-focus-within:text-primary group-focus-within/wrapper:text-primary": color === "primary",
		"peer-focus-within:text-error group-focus-within/wrapper:text-error": color === "error",
		"peer-focus-within:text-warning group-focus-within/wrapper:text-warning": color === "warning",
		"peer-focus-within:text-success group-focus-within/wrapper:text-success": color === "success",
		
		"top-4 left-4": true,
		"peer-focus-within:top-0 group-focus-within/wrapper:top-0 peer-focus-within:-translate-y-1/2 group-focus-within/wrapper:-translate-y-1/2 peer-focus-within:text-xs group-focus-within/wrapper:text-xs peer-focus-within:-mx-1.5 group-focus-within/wrapper:-mx-1.5 peer-focus-within:px-1.5 group-focus-within/wrapper:px-1.5": true,

		"top-0 -translate-y-1/2 text-xs": hasContents,
	};

	useEffect(function() {
		if (props.placeholder) setHasContents(true);
	}, [ props.placeholder, hasContents ]);

	// Resize on content change
	useEffect(function() {
		resize({ target: document.getElementById(props.id as string) as HTMLTextAreaElement } as React.ChangeEvent<HTMLTextAreaElement>);
	}, [ props.id, props.value ]);

	return (
		<div className={ cn("relative group input-group items-center bg-inherit rounded-lg h-full") }>
			<label className={ cn(wrapper) } htmlFor={ props.id } ref={ ref }>
				{ label && <p className={ cn(labelStyles) }>{ label }</p> }
				<textarea
					{ ...props }
					className={ cn(input, className) }
					onChange={ event => {
						resize(event);
						props.onChange && props.onChange(event);
						setHasContents(event.target.value.length > 0);
					} }
					onKeyDownCapture={ event => {
						const target = event.target as HTMLTextAreaElement;
						resize({ target });
						props.onKeyDownCapture && props.onKeyDownCapture(event);
						setHasContents(target.value.length > 0);
					} }
					onKeyUpCapture={ event => {
						const target = event.target as HTMLTextAreaElement;
						resize({ target });
						props.onKeyUpCapture && props.onKeyUpCapture(event);
						setHasContents(target.value.length > 0);
					} } />
			</label>
		</div>
	);
}
