import { type VariantProps } from "class-variance-authority";
import { isFunction, merge, omit } from "lodash";
import { useConvergedRef, useEventMap } from "nextui/hooks";
import { cn } from "nextui/util";
import { forwardRef, useEffect, useState, type InputHTMLAttributes, type ReactElement, type RefObject } from "react";
import type { IconType } from "react-icons";
import { classes } from ".";

type BaseInputProps =
    Omit<InputHTMLAttributes<HTMLInputElement>, "size"> &
    VariantProps<typeof classes[keyof typeof classes]> &
	Partial<{

        /**
         * The color of the input
         * @default "primary"
         */
        color: "primary" | "primary:pastel" | "error" | "error:pastel" | "warning" | "warning:pastel" | "success" | "success:pastel" | "neutral";

        /**
         * The icon to display in the input
         */
		icon: IconType | ReactElement;
		
		/**
		 * Whether the input is invalid
		 * @default false
		 */
		invalid: boolean;

        /**
         * The text to display in the floating label
         */
        label: string;

        /**
         * The size of the input
         * @default "default"
         */
        size: "default" | "dense";

        /**
         * The ref to the wrapper element
         */
		wrapper: RefObject<HTMLLabelElement | null>;
        
    }>;

export default forwardRef<HTMLInputElement, BaseInputProps>(function({
	children,
	className,
	icon: Icon,
	label,
	invalid = false,
	wrapper,
	...props
}, ref) {
    
	// Initialize the refs
	const inputRef = useConvergedRef(ref);
	const wrapperRef = useConvergedRef(wrapper);
    
	// Initialize the state
	const [ hasContents, setHasContents ] = useState(((props.defaultValue || props.value || props.placeholder)?.toString().length ?? 0) > 0);
	const [ isValid, setIsValid ] = useState(!invalid);
	
	// Add event listeners
	useEventMap(inputRef, {
		input() {
			setHasContents(this.value.length > 0);
			setIsValid(this.checkValidity());
		}
	});
    
	useEventMap(wrapperRef, {
		click(event) {
			if (event.target === wrapperRef.current) inputRef.current?.focus();
		}
	});

	// Sync  props with state
	useEffect(() => setIsValid(!invalid), [ invalid ]);

	return (
		<label
			className={ cn(classes.wrapper(merge(props, { invalid: !isValid || invalid }) as VariantProps<typeof classes.wrapper>), className) }
			ref={ wrapperRef }>
	
			{ /* Leading icon */ }
			{ Icon && isFunction(Icon) ? <Icon className={ cn(classes.icon(merge(props, { invalid: !isValid || invalid }) as VariantProps<typeof classes.icon>)) } /> : Icon }

			{ /* Input wrapper */ }
			<div className="flex relative h-full grow items-center">

				{ /* Input */ }
				<input
					{ ...omit(merge(props, { invalid: !isValid || invalid }), "size") }
					className={ cn(classes.input(merge(props, { invalid: !isValid || invalid }) as VariantProps<typeof classes.input>)) }
					ref={ inputRef } />
			
				{ /* Floating label */ }
				{ label && <p
					className={ cn(classes.label(merge(props, { invalid: !isValid || invalid }) as VariantProps<typeof classes.label>), (hasContents || props.placeholder) && [ "top-0", props.size === "dense" ? "text-xs" : "text-sm" ]) }
					style={{ backgroundColor: "var(--tw-ring-offset-color)" }}>{ label }</p> }
					
			</div>
            
			{ children }

		</label>
	);

});