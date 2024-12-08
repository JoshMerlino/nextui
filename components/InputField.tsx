"use client";

import { Mask } from "@react-input/mask";
import { cva, type VariantProps } from "class-variance-authority";
import dayjs from "dayjs";
import { isFunction, merge, omit, pick } from "lodash";
import { useFocusLost, useKeybind } from "nextui/hooks";
import { cn } from "nextui/util";
import { Children, createContext, forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState, type ChangeEvent, type HTMLInputTypeAttribute, type InputHTMLAttributes, type MutableRefObject, type PropsWithChildren, type ReactElement, type ReactNode } from "react";
import type { IconType } from "react-icons";
import { IoMdCalendar, IoMdEye, IoMdEyeOff } from "react-icons/io";
import { MdChevronLeft, MdDateRange } from "react-icons/md";
import { Calendar } from "./Calendar";
import { Card } from "./Card";
import { IconButton } from "./IconButton";
import { Popover } from "./Popover";

export const masks = {

	date: (format: string) => new Mask({
		mask: format.replace(/[a-zA-Z]/g, "_"),
		showMask: true,
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

export const SelectionContext = createContext({
	isFocused: false,
	currentSelected: -1,
	currentIndex: -1,
	isSelected: false,
	defaultValue: undefined as undefined | string,
	setSelected: () => {},
});

export const InputField = forwardRef<HTMLInputElement, PropsWithChildren<Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> &({ type: Exclude<HTMLInputTypeAttribute, "button" | "checkbox" | "radio"> } | (
	| {
		type: "select",
		children?: ReactNode,
		options?: unknown
	}
	| {
		type: "date",
		defaultValue?: Date | string | null,
		allowFuture?: boolean,
		allowPast?: boolean
	}
)) & VariantProps<typeof classes[keyof typeof classes]> & Partial<{

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

	/**
	 * The color of the input
	 * @default "primary"
	 */
	color: "primary" | "primary:pastel" | "error" | "error:pastel" | "warning" | "warning:pastel" | "success" | "success:pastel" | "neutral";

}>>>(function({ className, children, label, icon: Icon, ...props }, ref) {

		// Combine forwarded ref with internal ref
		const internalRef = useRef<HTMLInputElement>(null);
		const wrapperRef = useRef<HTMLLabelElement>(null);
	
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
		const [ dateValue, _setDateValue ] = useState<Date | readonly [Date, Date] | null>(function() {
			if (!props.defaultValue) return null;
			const dateRange = props.defaultValue.toString().split(" - ")
				.map(date => dayjs(date).toDate());
			return dateRange.length === 1 ? dateRange[0] : dateRange as [Date, Date];
		}());

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

				// Determine if the value is a valid date and sync with the calendar
				case "date":
					const dateRange = target.value.split(" - ")
						.map(date => dayjs(date).toDate());
					const [ start, end = null ] = dateRange;
				
					const isValid = (!isNaN(start.getTime()) && (!end || !isNaN(end.getTime()))) || (target.value.replace(/[^0-9]/g, "").length === 0);
					target.setCustomValidity(isValid ? "" : "Invalid date");
					setIsValid(isValid);

					if (!isValid || target.value.replace(/[^0-9]/g, "").length === 0) return;
					internalRef.current.value = dateRange instanceof Date ? dayjs(dateRange).format(format) : dateRange?.map(date => dayjs(date).format(format)).join(" - ") || "";

					// @ts-expect-error - This looks dumb but i assure you its necessary
					const event = new Event("change", { bubbles: true, target: internalRef.current });
					internalRef.current.dispatchEvent(event);
					_setDateValue(end ? [ start, end ] : start);
					props.onChange?.(event as unknown as ChangeEvent<HTMLInputElement>);
					
					break;

			}
		}, [ format, props ]);
	
		// Close the popover when the input loses focus
		useFocusLost(wrapperRef, () => (props.type === "select" && setPopoverOpen(false)));

		// On escape, blur the input
		useKeybind("Escape", () => internalRef.current?.blur());
	
		// Popover specific state
		const popoverState = useRef(false); // Use useRef to retain state across renders
		const [ popoverOpen, setPopoverOpenState ] = useState(false);

		const setPopoverOpen = useCallback((open: boolean) => {
			popoverState.current = open;
			setPopoverOpenState(open);
		}, []);

		// Rest of the component logic remains unchanged...

		const onDatePickerSelect = useCallback(function(date: Date | readonly [Date, Date] | null) {
			if (!internalRef.current) return;

			// Prevent duplicate selections
			if (date instanceof Date && dateValue instanceof Date && date.getTime() === dateValue.getTime()) return;
			if (Array.isArray(date) && Array.isArray(dateValue) && date[0].getTime() === dateValue[0].getTime() && date[1].getTime() === dateValue[1].getTime()) return;

			setPopoverOpen(false); // Close popover
			const current = internalRef.current.value;
			internalRef.current.value = date instanceof Date
				? dayjs(date).format(format)
				: date?.map(date => dayjs(date).format(format)).join(" - ") || "";

			if (current === internalRef.current.value) return;
			_setDateValue(date);

			// Dispatch change event
			const event = new Event("change", { bubbles: true, target: internalRef.current } as EventInit);
			internalRef.current.dispatchEvent(event);
			props.onChange?.(event as unknown as ChangeEvent<HTMLInputElement>);
		}, [ dateValue, format, props, setPopoverOpen ]);
	
		// Select specific state
		const [ focused, setFocused ] = useState(-1);
		const [ selected, setSelected ] = useState(-1);
	
		const itemsRef = useRef<Array<HTMLLIElement | null>>([]);
		const shouldIgnoreOpenEvent = useRef(false);
		const selectWrapperRef = useRef<HTMLDivElement>(null);
		const labelRef = useRef<HTMLInputElement>(null);

		useEffect(() => void (focused >= 0 && focused < itemsRef.current.length && itemsRef.current[focused]?.focus()), [ focused ]);
    
		useEffect(function() {
			const sel = selectWrapperRef.current?.children[0].children[selected];
			const ref = internalRef.current;
			const labelField = labelRef.current;
			if (!sel || !ref || !labelField) return;
			const value = sel.querySelector("option")?.getAttribute("value") || sel.textContent as string;
			const label = sel.querySelector("option")?.getAttribute("label") || sel.textContent;

			if (ref.value === value) return;

			ref.value = value;
			labelField.value = label || value;
			setFocused(selected);
			shouldIgnoreOpenEvent.current = true;
			setPopoverOpen(false);
			
			setTimeout(() => shouldIgnoreOpenEvent.current = false, 75);

			// @ts-expect-error - This looks dumb but i assure you its necessary
			const event = new Event("change", { bubbles: true, target: ref });
			
			// @ts-expect-error - This looks dumb but i assure you its necessary
			props.onChange?.(event as ChangeEvent<HTMLInputElement>);
			ref.dispatchEvent(event);
			labelField.focus();

		}, [ props, selected, setPopoverOpen ]);
	
		// Attach keyboard events to the select input
		useKeybind("ArrowDown", function() {
			if (props.type !== "select" || !popoverOpen) return;
			setFocused(focused => (focused + 1) % itemsRef.current.length);
		});
	
		useKeybind("ArrowUp", function() {
			if (props.type !== "select" || !popoverOpen) return;
			setFocused(focused => (focused - 1 + itemsRef.current.length) % itemsRef.current.length);
		});
	
		useKeybind("Enter", function() {
			if (props.type !== "select") return;
			if (popoverOpen) return setSelected(focused);
			if (document.activeElement !== labelRef.current) return;
			setPopoverOpen(true);
		});
	
		return (
			<label
				className={ cn(classes.wrapper(props as VariantProps<typeof classes.wrapper>), className) }
				ref={ wrapperRef }>

				{ props.type !== "select" && children }
	
				{ /* Leading icon */ }
				{ Icon && isFunction(Icon) ? <Icon className={ cn(classes.icon(merge(props, { invalid: !isValid }) as VariantProps<typeof classes.icon>)) } /> : Icon }

				{ /* Input wrapper */ }
				<div
					className={ cn("flex relative h-full grow items-center", props.type === "select" && "group/popover-limit") }
					onBlur={ () => setPlainText(false) }>

					{ /* Input */ }
					<input
						{ ...omit(props, "size", "allowPast", "allowFuture") }
						className={ cn(classes.input(props as VariantProps<typeof classes.input>), props.type === "select" && "hidden") }
						onChange={ event => [
							props.onChange?.(event),
							setHasContents(event.target.value.length > 0),
							setIsValid(event.target.validity.valid),
							coerceValue(event),
							props.type === "date" && _setDateValue
						] }
						placeholder={ props.type === "date" ? format : props.placeholder }
						readOnly={ props.type === "select" || props.readOnly }
						ref={ internalRef }
						type={ props.type === "password" ? (plainText ? "text" : "password")
							: props.type === "date" ? "text"
								: props.type || "text" } />
					
					{ props.type === "select" && (<input
						{ ...omit(props, "size", "allowPast", "allowFuture") }
						className={ cn(classes.input(props as VariantProps<typeof classes.input>)) }
						onChange={ event => [
							props.onChange?.(event),
							setHasContents(event.target.value.length > 0),
						] }
						onClick={ event => [
							props.onClick?.(event),
							setPopoverOpen(true),
						] }
						onFocus={ event => [
							props.onFocus?.(event),
							setHasContents(event.target.value.length > 0),
							shouldIgnoreOpenEvent.current || setPopoverOpen(true),
						] }
						placeholder={ props.type === "date" ? format : props.placeholder }
						readOnly
						ref={ labelRef }
						type="text" />) }
			
					{ /* Floating label */ }
					{ label && <p
						className={ cn(classes.label(props as VariantProps<typeof classes.label>), (hasContents || props.placeholder) && [ "top-0", props.size === "dense" ? "text-xs" : "text-sm" ]) }
						style={{ backgroundColor: "var(--tw-ring-offset-color)" }}>{ label }</p> }

					{ /* Password visibility toggle */ }
					{ props.type === "password" && <IconButton
						className={ cn(classes.button(props as VariantProps<typeof classes.button>), "hidden", hasContents && "group-focus-within/inputfield:inline-flex") }
						disabled={ props.disabled }
						icon={ plainText ? IoMdEyeOff : IoMdEye }
						onClick={ () => setPlainText(!plainText) }
						size={ props.size === "dense" ? "small" : "medium" } /> }
				
					{ /* Date picker icon calendar */ }
					{ props.type === "date" && <div className="relative">
						<IconButton
							className={ cn(classes.button(props as VariantProps<typeof classes.button>)) }
							disabled={ props.disabled }
							icon={ props.multiple ? MdDateRange : IoMdCalendar }
							onClick={ () => setPopoverOpen(!popoverOpen) }
							onMouseDown={ event => event.stopPropagation() }
							onTouchStart={ event => event.stopPropagation() }
							size={ props.size === "dense" ? "small" : "medium" } />
					
						{ /* Date picker calendar popover */ }
						<Popover
							screenMargin={ 16 }
							state={ [ popoverOpen, setPopoverOpen ] }>
							<Calendar
								{ ...pick(props, [ "allowFuture", "allowPast" ]) }
								className="cursor-default"
								color={ props.color }
								onSelect={ onDatePickerSelect }
								selection={ dateValue } />
						</Popover>
					
					</div> }

					{ /* Select dropdown and menu */ }
					{ props.type === "select" && <>
						<IconButton
							className={ cn(classes.button(props as VariantProps<typeof classes.button>)) }
							disabled={ props.disabled }
							icon={ <MdChevronLeft className={ cn("transition-transform", popoverOpen ? "rotate-90" : "-rotate-90") } /> }
							onClick={ () => setPopoverOpen(!popoverOpen) }
							onMouseDown={ event => event.stopPropagation() }
							onTouchStart={ event => event.stopPropagation() }
							size={ props.size === "dense" ? "small" : "medium" } />
						<Popover
							closeOnBlur={ false }
							duration={ 50 }
							screenMargin={ props.size === "dense" ? 14 : 18 }
							state={ [ popoverOpen, setPopoverOpen ] }>
							<Card className="p-0" variant="popover">
								<div
									className="py-2 overflow-auto max-h-[calc(100vh-32px)] cursor-default"
									onClick={ e => e.stopPropagation() }
									ref={ selectWrapperRef }
									style={{
										scrollbarWidth: "thin",
										WebkitMaskImage: "linear-gradient(#0005, #000 8px, #000 calc(100% - 8px), #0005)",
										maskImage: "linear-gradient(#0005, #000 8px, #000 calc(100% - 8px), #0005)"
									}}>
									<ul className="flex flex-col">
										{ Children.map(children, function(child, index) {
											return <li
												className="focus:outline-none"
												key={ index }
												onClick={ () => [ setSelected(index), setFocused(index) ] }
												onMouseMove={ () => setFocused(index) }
												ref={ el => (itemsRef.current[index] = el) }>
												<SelectionContext.Provider value={{
													isFocused: focused === index,
													isSelected: selected === index,
													currentSelected: selected,
													currentIndex: index,
													setSelected: () => setSelected(index),
													defaultValue: props.defaultValue?.toString()
												}}>
													{ child }
												</SelectionContext.Provider>
											</li>;
										}) }
									</ul>
								</div>
							</Card>
						</Popover>
					
					</> }
					
				</div>

			</label>
		);

	});