import type { VariantProps } from "class-variance-authority";
import { pick } from "lodash";
import { Card } from "nextui/Card";
import { useConvergedRef, useEventMap, useFocusLost } from "nextui/hooks";
import { IconButton } from "nextui/IconButton";
import type { Option } from "nextui/Option";
import { Popover } from "nextui/Popover";
import { cn } from "nextui/util";
import React, { Children, createContext, forwardRef, useEffect, useImperativeHandle, useState, type ReactElement } from "react";
import { MdChevronLeft } from "react-icons/md";
import { classes, POPOVER_PROPS } from ".";
import BaseInput from "./BaseInput";

export const SelectProvider = createContext({

	/**
	 * The ref of the input element
	 */
	ref: null as React.RefObject<HTMLInputElement | null> | null,

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
	setSelected: (() => void 0) as React.Dispatch<React.SetStateAction<void>>,

});

export default forwardRef<HTMLInputElement, ExtractProps<typeof BaseInput> & Pick<ExtractProps<typeof Popover>, typeof POPOVER_PROPS[number]>>(function({ wrapper, children, className, ...props }, forwarded) {
    
	// Initialize the refs
	const ref = useConvergedRef(forwarded);
	const wrapperRef = useConvergedRef(wrapper);

	// Initialize the state
	const [ popoverOpen, setPopoverOpen ] = useState(false);

	// Open the popover when the input is focused
	useEventMap(ref, { focus: () => setPopoverOpen(true) });
	
	// Close the popover when the focus is lost
	useFocusLost(wrapperRef, () => setPopoverOpen(false));
	useEventMap(wrapperRef, {
		focusout(event) {
			if (wrapperRef.current?.contains(event.relatedTarget as HTMLElement)) return;
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

		const label = Children.toArray(selectedOption.props.children).join("");
		const value = selectedOption.props.value?.toString() || label;

		// Set the input value to the text content of the selected option
		const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
		nativeInputValueSetter?.call(current, label || value);

		// Modify the getter
		Object.defineProperty(current, "value", { get: () => value });

		// Dispatch the input event
		const event = new Event("input", { bubbles: true, target: current } as EventInit);
		current.dispatchEvent(event);

	}, [ children, ref, selected ]);

	// Expose the custom value getter/setter
	useImperativeHandle(forwarded, function() {
		return {
			get value() {
				const selectedOption = Children.toArray(children)[selected] as ReactElement<ExtractProps<typeof Option>>;
				const label = Children.toArray(selectedOption.props.children).join("");
				return selectedOption.props.value?.toString() || label;
			},
			set value(value: string) {
				const options = (Children.toArray(children) as ReactElement<ExtractProps<typeof Option>>[])
					.map(({ props }) => ({ value: props.value, label: Children.toArray(props.children).join("") }));
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
				
				case "Enter":
					event.preventDefault();
					setSelected(focused);
					break;

			}
		}
	});

	return (
		<BaseInput
			{ ...props }
			className={ cn("group/popover-constraint", className) }
			readOnly
			ref={ ref }
			type="text"
			wrapper={ wrapperRef }>
			<IconButton
				className={ cn(classes.button(props as VariantProps<typeof classes.button>)) }
				disabled={ props.disabled }
				icon={ <MdChevronLeft className={ cn("transition-transform duration-50 rotate-90", popoverOpen || "-scale-x-100") } /> }
				onClick={ () => setPopoverOpen(!popoverOpen) }
				size={ props.size === "dense" ? "small" : "medium" } />
			<Popover
				className="w-full"
				closeOnBlur={ false }
				duration={ 50 }
				screenMargin={ 16 }
				state={ [ popoverOpen, setPopoverOpen ] }
				useModal={ false }
				{ ...pick(props, POPOVER_PROPS) }>
				<Card
					className="p-0 -mx-px mt-px"
					variant="popover">
					<ul className="flex flex-col py-2">

						{ /* Iterate over children and provide the select context */ }
						{ Children.map(children, (child, key) => <SelectProvider
							key={ key }
							value={{
								ref,
								isFocused: focused === key,
								isSelected: selected === key,
								setFocused: () => setFocused(key),
								setSelected: () => setSelected(key),
							}}>
							{ child }
						</SelectProvider>) }

					</ul>
				</Card>
			</Popover>
		</BaseInput>
	);
    
});