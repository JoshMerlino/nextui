"use client";

import { Mask } from "@react-input/mask";
import { cva, type VariantProps } from "class-variance-authority";
import dayjs from "dayjs";
import { isFunction, merge, omit } from "lodash";
import { cn } from "nextui/util";
import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState, type ChangeEvent, type HTMLInputTypeAttribute, type InputHTMLAttributes, type MutableRefObject, type PropsWithChildren, type ReactElement } from "react";
import type { IconType } from "react-icons";
import { IoMdCalendar, IoMdEye, IoMdEyeOff } from "react-icons/io";
import { MdDateRange } from "react-icons/md";
import { Calendar } from "./Calendar";
import { IconButton } from "./IconButton";
import { Popover } from "./Popover";

export const masks = {

	date: (format: string) => new Mask({
		mask: format.replace(/[a-zA-Z]/g, "_"),
		showMask: true,
		separate: true,
		replacement: { _: /[0-9]/ }
	})

};

export const classes = {

	wrapper: cva([
		"relative group/inputfield inline-flex items-center cursor-text gap-2 px-4 shrink-0 min-w-32",
		"[&:has(input:invalid)]:border-error/50 [&:has(input:invalid)]:dark:border-error/50 [&:has(input:invalid)]:focus-within:border-error [&:has(input:invalid)]:focus-within:ring-error [&:has(input:invalid)]:active:border-error [&:has(input:invalid)]:active:ring-error [&:has(input:invalid)]:dark:focus-within:border-error [&:has(input:invalid)]:dark:focus-within:ring-error [&:has(input:invalid)]:dark:active:border-error [&:has(input:invalid)]:dark:active:ring-error",
		"[&:has(input:disabled)]:border-dashed [&:has(input:disabled)]:active:ring-0 [&:has(input:disabled)]:focus-within:ring-0 [&:has(input:disabled)]:dark:border-dashed [&:has(input:disabled)]:active:border-gray-200 [&:has(input:disabled)]:active:dark:border-gray-700",
	], {
		defaultVariants: {
			variant: "outlined",
			color: "primary"
		},
		variants: {
			size: {
				dense: "px-3",
			},
			variant: {
				outlined: "rounded-md border border-gray-200 dark:border-gray-700 focus-within:ring-1 active:ring-1 transition-[border,box-shadow]",
			},
			color: {
				primary: "focus-within:border-primary focus-within:ring-primary active:border-primary active:ring-primary dark:focus-within:border-primary-500 dark:focus-within:ring-primary-500 dark:active:border-primary-500 dark:active:ring-primary-500",
				"primary:pastel": "focus-within:border-primary focus-within:ring-primary active:border-primary active:ring-primary dark:focus-within:border-primary-300 dark:focus-within:ring-primary-300 dark:active:border-primary-300 dark:active:ring-primary-300",
				error: "focus-within:border-error focus-within:ring-error active:border-error active:ring-error dark:focus-within:border-error-500 dark:focus-within:ring-error-500 dark:active:border-error-500 dark:active:ring-error-500",
				"error:pastel": "focus-within:border-error focus-within:ring-error active:border-error active:ring-error dark:focus-within:border-error-300 dark:focus-within:ring-error-300 dark:active:border-error-300 dark:active:ring-error-300",
				warning: "focus-within:border-warning focus-within:ring-warning active:border-warning active:ring-warning dark:focus-within:border-warning-500 dark:focus-within:ring-warning-500 dark:active:border-warning-500 dark:active:ring-warning-500",
				"warning:pastel": "focus-within:border-warning focus-within:ring-warning active:border-warning active:ring-warning dark:focus-within:border-warning-300 dark:focus-within:ring-warning-300 dark:active:border-warning-300 dark:active:ring-warning-300",
				success: "focus-within:border-success focus-within:ring-success active:border-success active:ring-success dark:focus-within:border-success-500 dark:focus-within:ring-success-500 dark:active:border-success-500 dark:active:ring-success",
				"success:pastel": "focus-within:border-success focus-within:ring-success active:border-success active:ring-success dark:focus-within:border-success-300 dark:focus-within:ring-success-300 dark:active:border-success-300 dark:active:ring-success-300",
				neutral: "focus-within:border-gray-800 focus-within:ring-gray-800 active:border-gray-800 active:ring-gray-800 dark:focus-within:border-gray-200 dark:focus-within:ring-gray-200 dark:active:border-gray-200 dark:active:ring-gray-200",
			},
			disabled: {
				true: "cursor-not-allowed border-dashed active:ring-0 focus-within:ring-0 dark:border-dashed active:border-gray-200 active:dark:border-gray-700",
			},
			invalid: {
				true: "border-error/50 dark:border-error/50 focus-within:border-error focus-within:ring-error active:border-error active:ring-error dark:focus-within:border-error dark:focus-within:ring-error dark:active:border-error dark:active:ring-error",
			}
		}
	}),

	input: cva([
		"peer bg-transparent cursor-text outline-0 border-0 shrink grow inline-flex w-0 min-w-0",
		"placeholder:text-gray-500 placeholder:dark:text-gray-400",
		"disabled:select-none"
	], {
		defaultVariants: {
			color: "primary",
			size: "default"
		},
		variants: {
			size: {
				dense: "h-10 text-sm",
				default: "h-14"
			},
			color: {
				primary: "caret-primary",
				"primary:pastel": "caret-primary dark:caret-primary-300",
				error: "caret-error",
				"error:pastel": "caret-error dark:caret-error-300",
				warning: "caret-warning",
				"warning:pastel": "caret-warning dark:caret-warning-300",
				success: "caret-success",
				"success:pastel": "caret-success dark:caret-success-300",
				neutral: "caret-gray-800 dark:caret-gray-200",
			},
			disabled: {
				true: "cursor-not-allowed select-none",
			},
			invalid: {
				true: "caret-error dark:caret-error",
			}
		}
	}),

	label: cva([
		"absolute inline-flex ring-offset-white dark:ring-offset-gray-800 w-min text-gray-500 dark:text-gray-400",
		"select-none font-normal pointer-events-none whitespace-nowrap transition-[top,font-size,color,padding] -mx-1.5 px-1.5 top-1/2 -translate-y-1/2",
		"group-focus-within/inputfield:top-0 peer-placeholder-shown:top-0",
		"peer-invalid:text-error/85 peer-invalid:dark:text-error/85 group-focus-within/inputfield:peer-invalid:text-error group-active/inputfield:peer-invalid:text-error dark:group-focus-within/inputfield:peer-invalid:text-error dark:group-active/inputfield:peer-invalid:text-error",
	], {
		defaultVariants: {
			size: "default",
			color: "primary"
		},
		variants: {
			size: {
				dense: "text-sm group-focus-within/inputfield:text-xs peer-placeholder-shown:text-xs",
				default: "text-base group-focus-within/inputfield:text-sm peer-placeholder-shown:text-sm"
			},
			color: {
				primary: "group-focus-within/inputfield:text-primary group-active/inputfield:text-primary",
				"primary:pastel": "group-focus-within/inputfield:text-primary group-active/inputfield:text-primary dark:group-focus-within/inputfield:text-primary-300 dark:group-active/inputfield:text-primary-300",
				error: "group-focus-within/inputfield:text-error group-active/inputfield:text-error",
				"error:pastel": "group-focus-within/inputfield:text-error group-active/inputfield:text-error dark:group-focus-within/inputfield:text-error-300 dark:group-active/inputfield:text-error-300",
				warning: "group-focus-within/inputfield:text-warning group-active/inputfield:text-warning",
				"warning:pastel": "group-focus-within/inputfield:text-warning group-active/inputfield:text-warning dark:group-focus-within/inputfield:text-warning-300 dark:group-active/inputfield:text-warning-300",
				success: "group-focus-within/inputfield:text-success group-active/inputfield:text-success",
				"success:pastel": "group-focus-within/inputfield:text-success group-active/inputfield:text-success dark:group-focus-within/inputfield:text-success-300 dark:group-active/inputfield:text-success-300",
				neutral: "group-focus-within/inputfield:text-gray-800 group-active/inputfield:text-gray-800 dark:group-focus-within/inputfield:text-gray-200 dark:group-active/inputfield:text-gray-200",
			},
			disabled: {
				true: "text-gray-400 dark:text-gray-500 group-focus-within/inputfield:text-gray-400 group-active/inputfield:text-gray-400 dark:group-focus-within/inputfield:text-gray-500 dark:group-active/inputfield:text-gray-500"
			},
			invalid: {
				true: "text-error/85 dark:text-error/85 group-focus-within/inputfield:text-error group-active/inputfield:text-error dark:group-focus-within/inputfield:text-error dark:group-active/inputfield:text-error"
			}
		}
	}),

	icon: cva("shrink-0 opacity-80 text-gray-700 dark:text-gray-300", {
		variants: {
			size: {
				dense: "text-xl -mx-0.5",
				default: "text-2xl"
			},
			disabled: {
				true: "text-gray-400 dark:text-gray-500"
			},
			invalid: {
				true: "text-error dark:text-error"
			}
		},
		defaultVariants: {
			size: "default"
		}
	}),

	button: cva("shrink-0", {
		variants: {
			size: {
				dense: "-mr-1.5",
				default: "-mr-2"
			}
		},
		defaultVariants: {
			size: "default"
		}
	})
	
};

export const InputField = forwardRef<HTMLInputElement, PropsWithChildren<Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> & { type: Exclude<HTMLInputTypeAttribute, "button" | "checkbox" | "radio"> } & VariantProps<typeof classes[keyof typeof classes]> & Partial<{

	/**
	 * The text to display in the floating label
	 */
	label: string;

	/**
	 * Whether or not the input is disabled
	 * @default false
	 */
	disabled: boolean;

	/**
	 * Whether or not the input is invalid
	 * @default false
	 */
	invalid: boolean;

	/**
	 * The size of the input
	 * @default "default"
	 */
	size: "default" | "dense";

	/**
	 * The icon to display in the input
	 */
	icon: IconType | ReactElement;

}>>>(function({ className, children, label, icon: Icon, ...props }, ref) {

	// Combine forwarded ref with internal ref
	const internalRef = useRef<HTMLInputElement>(null);
	
	useEffect(() => {
		const currentRef = internalRef.current;
		if (ref && typeof ref === "function") ref(currentRef);
		else if (ref) (ref as MutableRefObject<HTMLInputElement | null>).current = currentRef;
	}, [ internalRef, ref ]);

	// Hook the input value to determine if it has contents
	const [ hasContents, setHasContents ] = useState(false);
	useEffect(() => setHasContents(!!internalRef.current?.value), [ internalRef ]);
	
	// Hook the input value to determine if it is invalid
	const [ isValid, setIsValid ] = useState(false);
	useEffect(() => setIsValid(internalRef.current?.validity.valid || false), [ internalRef ]);
	
	// Password specific state
	const [ plainText, setPlainText ] = useState(props.type !== "password");
	
	// Date specific state
	const [ format, setFormat ] = useState("");
	const [ dateValue, setDateValue ] = useState<Date | readonly [Date, Date] | null>(null);
	useLayoutEffect(function() {
		if (props.type !== "date") return;
		const date = new Date("1000-10-20");
		const format = date
			.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })
			.replace(/\d{4}/, "YYYY")
			.replace((date.getMonth() + 1).toString(), "MM")
			.replace(date.getDate().toString(), "DD");
		setFormat(format);
	}, [ props.type ]);

	// Popover specific state
	const [ popoverOpen, setPopoverOpen ] = useState(false);

	// Apply the mask if it exists
	useEffect(function() {
		if (!format) return;
		if (masks[props.type as keyof typeof masks]) {
			if (!internalRef.current) return;
			const mask = masks[props.type as keyof typeof masks](format);
			mask.register(internalRef.current);
		}
	}, [ format, internalRef, props.type ]);
	
	// A function to coerce the value of the input
	const coerceValue = useCallback(function({ target }: ChangeEvent<HTMLInputElement>) {
		if (!internalRef.current) return;
		switch (props.type) {

			// Determine if the value is a valid date
			case "date":

				// const date = new Date(target.value);
				const dateRange = target.value.split(" - ")
					.map(date => dayjs(date).toDate());
				const [ start, end = null ] = dateRange;
				
				const isValid = (!isNaN(start.getTime()) && (!end || !isNaN(end.getTime()))) || (target.value.replace(/[^0-9]/g, "").length === 0);
				target.setCustomValidity(isValid ? "" : "Invalid date");
				setIsValid(isValid);

				if (!isValid || target.value.replace(/[^0-9]/g, "").length === 0) return;

				const value = dateRange[1] ? dateRange : dateRange[0];
				
				// const isValid = !isNaN(date.getTime()) || target.value.toString().trim().length === 0;
				// target.setCustomValidity(isValid ? "" : "Invalid date");
				// setIsValid(isValid);

				// if (!isValid) return;
				// if (target.value.toString().trim().length === 0) return;

				// useEffect(function() {
				// 	const value = (selectionEndDate && selectionStartDate) ? [ selectionStartDate, selectionEndDate ] as const : selectionStartDate ?? null;
				// 	const [ currStart, currEnd ] = Array.isArray(value) ? value : [ value, null ] as const;
				// 	const [ prevStart, preEnd ] = Array.isArray(previousSelectionRef.current) ? previousSelectionRef.current : [ previousSelectionRef.current, null ] as const;
		
				// 	// If selectiono is differetn
				// 	if (dayjs(prevStart).isSame(currStart, "day") && dayjs(preEnd).isSame(currEnd, "day")) return;
				// 	if (!value) return;

				// 	previousSelectionRef.current = value;
				// 	onSelect?.(value);

				// }, [ selectionStartDate, selectionEndDate, onSelect ]);

				// setDateValue(date);
				// console.log({ value });

				break;

		}
	}, [ props.type ]);

	return (
		<label className={ cn(classes.wrapper(props as VariantProps<typeof classes.wrapper>), className) }>

			{ children }
	
			{ /* Leading icon */ }
			{ Icon && isFunction(Icon) ? <Icon className={ cn(classes.icon(merge(props, { invalid: !isValid }) as VariantProps<typeof classes.icon>)) } /> : Icon }

			{ /* Input wrapper */ }
			<div className="flex relative h-full grow items-center" onBlur={ () => setPlainText(false) }>

				{ /* Input */ }
				<input
					{ ...omit(props, "size") }
					className={ cn(classes.input(props as VariantProps<typeof classes.input>)) }
					onChange={ event => [
						props.onChange?.(event),
						setHasContents(event.target.value.length > 0),
						setIsValid(event.target.validity.valid),
						coerceValue(event),
					] }
					placeholder={ props.type === "date" ? format : props.placeholder }
					ref={ internalRef }
					type={ props.type === "password" ? (plainText ? "text" : "password")
						: props.type === "date" ? "text"
							: props.type || "text" } />
			
				{ /* Floating label */ }
				{ label && <p
					className={ cn(classes.label(props as VariantProps<typeof classes.label>), (hasContents || props.placeholder) && [ "top-0", props.size === "dense" ? "text-xs" : "text-sm" ]) }
					style={{ backgroundColor: "var(--tw-ring-offset-color)" }}>{ label }</p> }

				{ /* Password visibility toggle */ }
				{ props.type === "password" && <IconButton
					className={ cn(classes.button(props as VariantProps<typeof classes.button>), "hidden", hasContents && "group-focus-within/inputfield:inline-flex") }
					icon={ plainText ? IoMdEyeOff : IoMdEye }
					onClick={ () => setPlainText(!plainText) }
					size={ props.size === "dense" ? "small" : "medium" } /> }
				
				{ /* Date picker icon calendar */ }
				{ props.type === "date" && <div className="relative">
					<IconButton
						className={ cn(classes.button(props as VariantProps<typeof classes.button>)) }
						icon={ props.multiple ? MdDateRange : IoMdCalendar }
						onClick={ () => setPopoverOpen(!popoverOpen) }
						onMouseDown={ event => event.stopPropagation() }
						onTouchStart={ event => event.stopPropagation() }
						size={ props.size === "dense" ? "small" : "medium" } />
					
					{ /* Date picker calendar popover */ }
					<Popover state={ [ popoverOpen, setPopoverOpen ] }>
						{ /* <pre>{ JSON.stringify(dateValue, null, 2) }</pre> */ }
						<Calendar
							className="cursor-default"
							onSelect={ date => {
								if (!internalRef.current) return;
								
								if (date instanceof Date && dateValue instanceof Date && date.getTime() === dateValue.getTime()) return;
								if (Array.isArray(date) && Array.isArray(dateValue) && date[0].getTime() === dateValue[0].getTime() && date[1].getTime() === dateValue[1].getTime()) return;
								
								// console.log("onSelectCalled", date, dateValue);

								// setPopoverOpen(false);
								internalRef.current.value = date instanceof Date ? dayjs(date).format(format) : date?.map(date => dayjs(date).format(format)).join(" - ") || "";
								setDateValue(date);
							} }
							selection={ dateValue } />
					</Popover>
					
				</div> }
					
			</div>

		</label>
	);

});