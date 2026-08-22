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
import { CALENDAR_PROPS, classes, POPOVER_PROPS } from ".";
import BaseInput from "./BaseInput";

type AdditionalProps = {

	/**
	 * If the popover should close on calendar select
	 * @default true
	 */
	closeOnCalendarSelect?: boolean;

};

export default forwardRef<HTMLInputElement, ExtractProps<typeof BaseInput> & Pick<ExtractProps<typeof Calendar>, typeof CALENDAR_PROPS[number]> & Pick<ExtractProps<typeof Popover>, typeof POPOVER_PROPS[number]> & Partial<AdditionalProps>>(function({ closeOnCalendarSelect = true, ...props }, forwarded) {
    
	// Initialize the refs
	const ref = useConvergedRef(forwarded);
    
	// Initialize the state
	const [ popoverOpen, setPopoverOpen ] = useState(false);
	const [ dateValue, setDateValue ] = useState<Date | null>(typeof props.defaultValue === "string" ? dayjs(props.defaultValue).toDate() : props.defaultValue instanceof Date ? props.defaultValue : null);
	
	// Selection range ref
	const selectionRange = useRef<{ start: number | null, end: number | null } | null>(null);
    
	// On date value change, update the input value
	//
	// `props` is NOT a dependency, and must not become one: it is a fresh rest
	// object on every render, so depending on it ran this after every commit —
	// and what this does is dispatch an `input` event, whose handler below
	// parses the field into a NEW Date, which is never Object.is-equal to the
	// last one, which re-renders, which runs this again. That is the loop React
	// reports as "Maximum update depth exceeded", and it took only a date field
	// carrying a value to start it. Nothing in here reads `props`.
	useEffect(function() {
		if (!dateValue || !ref.current) return;
		const date = dayjs(dateValue).toDate();
		if (date.toString() === "Invalid Date") return;

		// Already what the field shows: writing it again would announce a
		// change that has not happened, which is the other half of the loop
		// above and would fight the caret while someone is typing.
		const value = dateValue.toLocaleDateString();
		if (ref.current.value === value) return;

		const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;

		// Set the value
		nativeInputValueSetter?.call(ref.current, value);

		// Set the selection range
		const { start } = selectionRange.current || { start: null, end: null };
		ref.current.setSelectionRange(start || 0, value.length);

		// Dispatch the input event
		const event = new Event("input", { bubbles: true });
		ref.current.dispatchEvent(event);

	}, [ dateValue, ref ]);

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

			// The same instant keeps the same object: a parsed date is a new
			// instance every time, and handing React one it cannot tell from
			// the last is what turns an echoed event into a render loop.
			setDateValue(current => current?.getTime() === date.getTime() ? current : date);
		}
	});

	const onSelect = useCallback(function(date: Date | null) {
		setDateValue(date);
		if (closeOnCalendarSelect) setPopoverOpen(false);
	}, [ closeOnCalendarSelect ]);

	return (
		<BaseInput
			{ ...omit(props, omit(CALENDAR_PROPS, "color"), POPOVER_PROPS) }
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
					{ ...pick(props, POPOVER_PROPS) }>
					<Calendar
						className="cursor-default"
						color={ props.color }
						onSelect={ onSelect }
						selected={ dateValue }
						{ ...pick(props, CALENDAR_PROPS) } />
				</Popover>
			</div>
		</BaseInput>
	);
    
});