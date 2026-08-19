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
	
	// Recompute from the DOM after every commit, rather than from the keystroke
	// that caused it.
	//
	// These two flags only ever CHANGE on the edges — the first character typed,
	// the last one deleted — and a change re-renders the input. Do that from the
	// `input` event and the re-render lands while `value` is still the
	// pre-keystroke prop (a controlled parent has not necessarily caught up, and
	// with a deferred setter such as a query-param hook it definitely has not);
	// React then writes that stale value back into the DOM and the keystroke is
	// undone. A commit is precisely the moment React has finished writing `value`
	// into the input, so what we read here agrees with the props and the
	// resulting render cannot clobber anything.
	useEffect(function() {
		const input = inputRef.current;
		if (!input) return;
		setHasContents(input.value.length > 0);
		setIsValid(input.checkValidity());
	});

	// An uncontrolled input re-renders for nobody, so its own typing has to
	// schedule the sync above. A controlled one gets it from its parent's render.
	useEventMap(inputRef, {
		input() {
			if (props.value !== undefined) return;
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

	// Merged into a fresh object: lodash's merge MUTATES its first argument, so
	// merging into `props` writes `invalid` into the very object the input
	// spreads below, and React forwards it to the DOM as an unknown attribute.
	const state = merge({}, props, { invalid: !isValid || invalid });

	return (
		<label
			className={ cn(classes.wrapper(state as VariantProps<typeof classes.wrapper>), className) }
			ref={ wrapperRef }>

			{ /* Leading icon */ }
			{ Icon && isFunction(Icon) ? <Icon className={ cn(classes.icon(state as VariantProps<typeof classes.icon>)) } /> : Icon }

			{ /* Input wrapper */ }
			<div className="flex relative h-full items-center grow">

				{ /* Input */ }
				<input
					{ ...omit(props, "size") }
					className={ cn(classes.input(state as VariantProps<typeof classes.input>)) }
					ref={ inputRef } />

				{ /* Floating label */ }
				{ label && <p
					className={ cn(classes.label(state as VariantProps<typeof classes.label>), (hasContents || props.placeholder) && [ "top-0", props.size === "dense" ? "text-xs" : "text-sm" ]) }
					style={{ backgroundColor: "var(--tw-ring-offset-color)" }}>{ label }</p> }

			</div>
            
			{ children }

		</label>
	);

});