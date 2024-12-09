import type { VariantProps } from "class-variance-authority";
import { useConvergedRef, useEvent, useEventMap } from "nextui/hooks";
import { IconButton } from "nextui/IconButton";
import { cn } from "nextui/util";
import { forwardRef, useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { classes } from ".";
import BaseInput from "./BaseInput";

export default forwardRef<HTMLInputElement, ExtractProps<typeof BaseInput>>(function({ type, wrapper, ...props }, forwarded) {
    
	// Initialize the refs
	const ref = useConvergedRef(forwarded);
	const wrapperRef = useConvergedRef(wrapper);
    
	// Initialize the state
	const [ plainText, setPlainText ] = useState(type !== "password");
    
	// Add event listeners
	useEvent("mouseup", () => setPlainText(false));
	useEventMap(wrapperRef, {
		focusout() {
			setPlainText(false);
		}
	});

	return (
		<BaseInput
			{ ...props }
			ref={ ref }
			type={ plainText ? "text" : type }
			wrapper={ wrapperRef }>
			<IconButton
				className={ cn(classes.button(props as VariantProps<typeof classes.button>)) }
				disabled={ props.disabled }
				icon={ plainText ? IoMdEyeOff : IoMdEye }
				onMouseDown={ () => setPlainText(true) }
				size={ props.size === "dense" ? "small" : "medium" } />
		</BaseInput>
	);
    
});