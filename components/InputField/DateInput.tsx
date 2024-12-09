import type { VariantProps } from "class-variance-authority";
import dayjs from "dayjs";
import { omit, pick } from "lodash";
import { Calendar } from "nextui/Calendar";
import { useConvergedRef, useEventMap } from "nextui/hooks";
import { IconButton } from "nextui/IconButton";
import { Popover } from "nextui/Popover";
import { cn } from "nextui/util";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { IoMdCalendar } from "react-icons/io";
import { MdDateRange } from "react-icons/md";
import BaseInput, { classes } from "./BaseInput";

// Props to pass to the calendar
const CALENDAR_PROPS = [ "yearFormat", "yearPicker", "yearPickerEnd", "yearPickerStart", "allowFuture", "allowPast", "openToDate" ] as const;

export default forwardRef<HTMLInputElement, ExtractProps<typeof BaseInput> & Pick<ExtractProps<typeof Calendar>, "yearFormat" | "yearPicker" | "yearPickerEnd" | "yearPickerStart" | "allowFuture" | "allowPast" | "openToDate">>(function(props, forwarded) {
    
	// Initialize the refs
	const ref = useConvergedRef(forwarded);
    
	// Initialize the state
	const [ popoverOpen, setPopoverOpen ] = useState(false);
	const [ dateValue, setDateValue ] = useState<Date | null>(null);
	
	// Skip value coercion on backspace
	const shouldSkipValueCoercion = useRef(false);
    
	// On date value change, update the input value
	useEffect(function() {
		if (!dateValue || !ref.current) return;
		const date = dayjs(dateValue).toDate();
		if (date.toString() === "Invalid Date") return;
		const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
		nativeInputValueSetter?.call(ref.current, dateValue.toLocaleDateString());
		const event = new Event("input", { bubbles: true });
		ref.current.dispatchEvent(event);
	}, [ dateValue, props, ref ]);

	// Add event listeners
	useEventMap(ref, {
		input(event) {
			event.stopImmediatePropagation();
			const date = dayjs(event.target?.value).toDate();
			if (date.toString() === "Invalid Date") return setDateValue(null);
			setDateValue(date);
		},
		change(event) {
			event.stopImmediatePropagation();
		}
	});

	// On date select, update the date value
	const onSelect = useCallback(function(date: Date | null) {
		if (shouldSkipValueCoercion.current) return shouldSkipValueCoercion.current = false;
		setDateValue(date);
	}, []);

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
						onSelect={ onSelect }
						selected={ dateValue }
						{ ...pick(props, CALENDAR_PROPS) } />
				</Popover>
			</div>
		</BaseInput>
	);
    
});