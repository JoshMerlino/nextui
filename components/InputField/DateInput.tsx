import type { VariantProps } from "class-variance-authority";
import dayjs from "dayjs";
import { omit, pick } from "lodash";
import { Calendar } from "nextui/Calendar";
import { useConvergedRef, useEventMap } from "nextui/hooks";
import { IconButton } from "nextui/IconButton";
import { Popover } from "nextui/Popover";
import { cn } from "nextui/util";
import { forwardRef, useEffect, useRef, useState } from "react";
import { IoMdCalendar } from "react-icons/io";
import { MdDateRange } from "react-icons/md";
import { classes } from ".";
import BaseInput from "./BaseInput";

// Props to pass to the calendar
const CALENDAR_PROPS = [ "yearFormat", "yearPicker", "yearPickerEnd", "yearPickerStart", "allowFuture", "allowPast", "openToDate" ] as const;

export default forwardRef<HTMLInputElement, ExtractProps<typeof BaseInput> & Pick<ExtractProps<typeof Calendar>, "yearFormat" | "yearPicker" | "yearPickerEnd" | "yearPickerStart" | "allowFuture" | "allowPast" | "openToDate">>(function(props, forwarded) {
    
	// Initialize the refs
	const ref = useConvergedRef(forwarded);
    
	// Initialize the state
	const [ popoverOpen, setPopoverOpen ] = useState(false);
	const [ dateValue, setDateValue ] = useState<Date | null>(typeof props.defaultValue === "string" ? dayjs(props.defaultValue).toDate() : props.defaultValue instanceof Date ? props.defaultValue : null);
	
	// Selection range ref
	const selectionRange = useRef<{ start: number | null, end: number | null } | null>(null);
    
	// On date value change, update the input value
	useEffect(function() {
		if (!dateValue || !ref.current) return;
		const date = dayjs(dateValue).toDate();
		if (date.toString() === "Invalid Date") return;
		const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;

		// Set the value
		const value = dateValue.toLocaleDateString();
		nativeInputValueSetter?.call(ref.current, value);

		// Set the selection range
		const { start } = selectionRange.current || { start: null, end: null };
		ref.current.setSelectionRange(start || 0, value.length);

		// Dispatch the input event
		const event = new Event("input", { bubbles: true });
		ref.current.dispatchEvent(event);

	}, [ dateValue, props, ref ]);

	// Add event listeners
	useEventMap(ref, {
		change: event => event.stopImmediatePropagation(),
		input(event) {
			event.stopImmediatePropagation();
			const date = dayjs(event.target?.value).toDate();
			if (date.toString() === "Invalid Date") return setDateValue(null);
			const sel = event.target?.selectionStart || null;
			const len = event.target?.value.length || null;
			selectionRange.current = { start: sel, end: len };
			setDateValue(date);
		}
	});

	return (
		<BaseInput
			{ ...omit(props, CALENDAR_PROPS) }
			ref={ ref }
			type="text">
			<div className="relative">
				<IconButton
					className={ cn(classes.button(props as VariantProps<typeof classes.button>)) }
					disabled={ props.disabled }
					icon={ props.multiple ? MdDateRange : IoMdCalendar }
					onClick={ () => setPopoverOpen(!popoverOpen) }
					onMouseDown={ event => event.stopPropagation() }
					onTouchStart={ event => event.stopPropagation() }
					size={ props.size === "dense" ? "small" : "medium" } />
				<Popover
					screenMargin={ 16 }
					state={ [ popoverOpen, setPopoverOpen ] }
					useModal={ false }>
					<Calendar
						className="cursor-default"
						onSelect={ setDateValue }
						selected={ dateValue }
						{ ...pick(props, CALENDAR_PROPS) } />
				</Popover>
			</div>
		</BaseInput>
	);
    
});