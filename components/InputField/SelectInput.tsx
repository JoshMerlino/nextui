import type { VariantProps } from "class-variance-authority";
import { omit, pick } from "lodash";
import { Card } from "nextui/Card";
import { useConvergedRef, useEventMap, useFocusLost, useKeybind } from "nextui/hooks";
import { IconButton } from "nextui/IconButton";
import type { Option } from "nextui/Option";
import { Popover } from "nextui/Popover";
import { cn } from "nextui/util";
import React, { Children, createContext, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, type ReactElement, type RefObject } from "react";
import { MdChevronLeft } from "react-icons/md";
import { classes, POPOVER_PROPS } from ".";
import BaseInput from "./BaseInput";

export const SelectProvider = createContext({

	/**
	 * The ref of the input element
	 */
	ref: null as RefObject<HTMLInputElement | null> | null,

	/**
	 * Whether the input is focused
	 */
	isFocused: false,

	/**
	 * Whether the input is selected
	 */
	isSelected: false,

	/**
	 * Set the current input as focused
	 */
	setFocused: (() => void 0) as React.Dispatch<React.SetStateAction<void>>,
		
	/**
	 * Set the current input as selected
	 */
	setSelected: (() => void 0) as React.Dispatch<React.SetStateAction<void>>

});

export default forwardRef<HTMLInputElement, ExtractProps<typeof BaseInput> & Pick<ExtractProps<typeof Popover>, typeof POPOVER_PROPS[number]>>(function({ wrapper, children, className, ...props }, forwarded) {
    
	// Initialize the refs
	const ref = useConvergedRef(forwarded);
	const wrapperRef = useConvergedRef(wrapper);
	const popoverProps = pick(props, POPOVER_PROPS);
	const { contained: contained = true, ...restPopoverProps } = popoverProps;

	// Get the options
	const options = (Children.toArray(children) as ReactElement<ExtractProps<typeof Option>>[])
		.map(({ props }) => ({ value: props.value, label: props.label ?? (Children.toArray(props.children).join("") || null) }));

	// Initialize the state
	const [ popoverOpen, setPopoverOpen ] = useState(false);

	// The menu's own element. A modal popover renders in the top layer, outside
	// this field entirely, so "did that happen inside the menu" cannot be asked
	// of the wrapper — without this, clicking an option counted as clicking away
	// and closed the menu before the option's own handler ran.
	const popoverRef = useRef<HTMLDialogElement>(null);

	// `node !== popoverRef.current` is the whole trick. A modal popover is a
	// <dialog> in the top layer, and a click on its ::backdrop — which is to say
	// anywhere else on the page — reports the dialog ITSELF as the target. Asking
	// only whether the dialog contains the target answered yes for those clicks
	// too, so every attempt to dismiss the menu was read as a click inside it and
	// the thing could not be closed.
	const isInsideMenu = useCallback(function(node: EventTarget | Node | null) {
		if (!node || !popoverRef.current) return false;
		if (node === popoverRef.current) return false;
		return popoverRef.current.contains(node as Node);
	}, []);

	// Opened by clicking the field, not by focusing it. A modal popover returns
	// focus to whatever had it when the dialog closes — this input — so a `focus`
	// opener reopened the menu the instant anything closed it, and the thing
	// could not be dismissed. Tabbing into a field also has no business popping a
	// menu open; Enter still does, through the keybind below.
	useEventMap(ref, {
		click: () => setPopoverOpen(true)
	});
	
	// Close the popover when the focus is lost
	useFocusLost(wrapperRef, event => {
		if (isInsideMenu(event.target)) return;
		setPopoverOpen(false);
	});
	useEventMap(wrapperRef, {
		focusout(event) {
			if (wrapperRef.current?.contains(event.relatedTarget as HTMLElement)) return;
			if (isInsideMenu(event.relatedTarget)) return;
			setPopoverOpen(false);
		}
	});

	// Dropdown specific state
	const [ selected, setSelected ] = useState(-1);
	const [ focused, setFocused ] = useState(-1);
	
	// On selection change, update the input value
	useEffect(function() {
		const current = ref.current;
		if (!current) return;
		
		// Get the selected option
		const selectedOption = Children.toArray(children)[selected] as ReactElement<ExtractProps<typeof Option>>;
		if (!selectedOption) return;

		const label = selectedOption.props.label ?? Children.toArray(selectedOption.props.children).join("");
		const value = selectedOption.props.value?.toString() || label;

		// Set the input value to the text content of the selected option
		const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
		nativeInputValueSetter?.call(current, label || value);

		// Modify the getter
		Object.defineProperty(current, "value", { get: () => value });

		// Dispatch the input event
		const event = new Event("input", { bubbles: true, target: current } as EventInit);
		current.dispatchEvent(event);
		setPopoverOpen(false);

	}, [ children, ref, selected ]);

	// Expose the custom value getter/setter
	useImperativeHandle(forwarded, function() {
		return {
			get value() {
				const selectedOption = Children.toArray(children)[selected] as ReactElement<ExtractProps<typeof Option>>;
				const label = selectedOption.props.label ?? Children.toArray(selectedOption.props.children).join("");
				return selectedOption.props.value?.toString() || label;
			},
			set value(value: string) {
				const options = (Children.toArray(children) as ReactElement<ExtractProps<typeof Option>>[])
					.map(({ props }) => ({ value: props.value, label: props.label ?? Children.toArray(props.children).join("") }));
				const selected = options.find(({ value: v }) => v?.toString() === value.toString());
				if (!selected) return;
				setSelected(options.indexOf(selected));
			}
		};
	} as () => HTMLInputElement, [ children, selected ]);
	
	// Attach keyboard event listeners
	useEventMap(wrapperRef, {
		keydown(event) {
			if (!popoverOpen) return;
			switch (event.key) {

				case "ArrowDown":
					event.preventDefault();
					setFocused(focused => (focused + 1) % Children.count(children));
					break;
				
				case "ArrowUp":
					event.preventDefault();
					setFocused(focused => (focused - 1 + Children.count(children)) % Children.count(children));
					break;
				
				case " ":
					event.preventDefault();
					setSelected(focused);
					requestAnimationFrame(() => ref.current?.focus());
					break;
					
				case "Enter":
					event.preventDefault();
					setSelected(focused);
					setPopoverOpen(false);
					requestAnimationFrame(() => ref.current?.focus());
					break;

			}
		}
	});

	useKeybind("Enter", function() {
		if (!wrapperRef.current?.contains(document.activeElement)) return;
		if (!popoverOpen) setPopoverOpen(true);
	});

	useEffect(function() {
		if (selected !== -1 || !(props.defaultValue || props.value)) return;
		setSelected(options.findIndex(({ value }) => value?.toString() === (props.defaultValue || props.value)?.toString()));
	}, [ options, props.defaultValue, props.value, selected ]);

	// What the closed field shows. An option whose children are plain text needs
	// nothing — the input carries it. One rendering a chip or an icon row cannot
	// go inside an <input> at all, so it is drawn over the top and the input's
	// own text is hidden: the value, the label float and the form all still read
	// off the input, which is the part that has to keep working.
	const chosen = Children.toArray(children)[selected] as ReactElement<ExtractProps<typeof Option>> | undefined;
	const overlay = chosen && typeof chosen.props.children !== "string" ? chosen.props.children : null;

	return (

		// `name` moves off the visible input, deliberately: that input's native
		// value is the chosen option's LABEL (what the closed field displays),
		// and FormData serializes the native value — the `.value` getter that
		// answers the VALUE only exists for scripts. So a form asking this
		// field by name received "Simulated" where code read "Simulator". The
		// hidden input below carries the name instead, and always holds the
		// value.
		<BaseInput
			{ ...omit(props, [ ...POPOVER_PROPS, "name" ]) }
			className={ cn("group/popover-constraint", overlay && "[&_input]:text-transparent", className) }
			readOnly
			ref={ ref }
			type="text"
			wrapper={ wrapperRef }>

			{ props.name && (
				<input
					name={ props.name }
					readOnly
					type="hidden"
					value={ chosen ? chosen.props.value?.toString() || chosen.props.label || Children.toArray(chosen.props.children).join("") : "" } />
			) }

			{ /* Over the input, not in it. Positioned against the field's own
			     padding rather than its border, since this renders as a sibling of
			     the input's box rather than inside it. `pointer-events-none` so the
			     field still takes the click that opens the menu. */ }
			{ overlay && (
				<div className={ cn("flex absolute inset-y-0 items-center pointer-events-none", props.size === "dense" ? "left-3" : "left-4") }>
					{ overlay }
				</div>
			) }

			<IconButton
				className={ cn(classes.button(props as VariantProps<typeof classes.button>)) }
				disabled={ props.disabled }
				icon={ <MdChevronLeft className={ cn("not-motion-reduce:transition-transform duration-50 rotate-90", popoverOpen || "-scale-x-100") } /> }
				onMouseDown={ function(event) {
					event.preventDefault();
					setPopoverOpen(open => !open);
				} }
				size={ props.size === "dense" ? "small" : "medium" } />
			{ /* `useModal={ false }` by default — an ordinary positioned element,
			     which any ancestor with `overflow` clips. Inside a scrolling dialog
			     pass `useModal`: only the top layer escapes a scroll container. It
			     sits before the spread below so a caller can override it. */ }
			<Popover
				className="w-full -mx-px"
				ref={ popoverRef }
				closeOnBlur={ false }
				duration={ 50 }
				screenMargin={ 16 }
				state={ [ popoverOpen, setPopoverOpen ] }
				useModal={ false }
				contained={ contained }
				{ ...restPopoverProps }>
				<Card
					className="p-0 border-0 max-h-full flex"
					style={{ maxHeight: "inherit" }}
					variant="popover">
					<ul className={ cn("flex flex-col py-2 group/select max-h-full overflow-y-auto min-h-0 grow", props.size === "dense" && "size-dense") }
						style={{ maxHeight: "inherit" }}>

						{ /* Iterate over children and provide the select context */ }
						{ Children.map(children, (child, key) => <SelectProvider
							key={ key }
							value={{
								ref,
								isFocused: focused === key,
								isSelected: selected === key,
								setFocused: () => setFocused(key),
								setSelected: () => {
									setSelected(key);
									setPopoverOpen(false);
								}
							}}>
							{ child }
						</SelectProvider>) }

					</ul>
				</Card>
			</Popover>
		</BaseInput>
	);
    
});