import type { VariantProps } from "class-variance-authority";
import { pick } from "lodash";
import { Card } from "nextui/Card";
import { useConvergedRef, useEventMap, useFocusLost } from "nextui/hooks";
import { IconButton } from "nextui/IconButton";
import { Popover } from "nextui/Popover";
import { cn } from "nextui/util";
import { forwardRef, useState } from "react";
import { MdChevronLeft } from "react-icons/md";
import { classes, POPOVER_PROPS } from ".";
import BaseInput from "./BaseInput";

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
	useEventMap(wrapperRef, { focusout(event) {
		if (wrapperRef.current?.contains(event.relatedTarget as HTMLElement)) return;
		setPopoverOpen(false);
	} });

	// const [ selectedIndex, setSelectedIndex ] = useState(-1);
	// Change the value behavior when getting and setting
	// useImperativeHandle(ref, () => merge(ref.current as HTMLInputElement, {
	// 	get value() {
	// 		return `Processed: ${ ref.current?.value }`;
	// 	},
	// }));

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
				icon={ <MdChevronLeft className={ cn("transition-transform rotate-90 -scale-x-100", popoverOpen && "scale-x-100") } /> }
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
					
					{ children }

				</Card>
			</Popover>
		</BaseInput>
	);
    
});