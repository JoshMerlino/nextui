import { type VariantProps } from "class-variance-authority";
import { isFunction, merge, omit } from "lodash";
import { useConvergedRef, useEventMap } from "nextui/hooks";
import { cn } from "nextui/util";
import { forwardRef, useEffect, useState, type InputHTMLAttributes, type ReactElement, type RefObject, type TextareaHTMLAttributes } from "react";
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
         * Renders a textarea instead of an input, wearing the same outline,
         * colours and floating label as every other field.
         *
         * A prop rather than a `type` of its own: everything about a multi-line
         * field except the element is what a single-line one already does, and a
         * parallel component meant every fix to the focus handling, the label
         * float or the validity tracking had to be made twice.
         *
         * @default false
         */
        multiline: boolean;

        /** How many lines a `multiline` field opens at. @default 4 */
        rows: number;

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
	multiline = false,
	rows = 4,
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

	const state = merge(props, { invalid: !isValid || invalid });

	// Shared by both elements, so the two can never drift apart on colour, caret
	// or disabled handling. Multi-line only overrides what a fixed row height
	// means: the box takes its height from `rows` and the reader's drag.
	const field = {
		...omit(props, "size"),
		invalid: (!isValid || invalid) || undefined,
		className: cn(classes.input(state as VariantProps<typeof classes.input>), multiline && "h-auto w-full resize-y leading-6"),
		ref: inputRef
	};

	return (
		<label
			className={ cn(
				classes.wrapper(state as VariantProps<typeof classes.wrapper>),

				// A multi-line box can't take its height from a fixed-height child, so
				// the wrapper carries its own padding and lines the icon up with the
				// first line rather than the middle of the paragraph.
				multiline && [ "items-start", props.size === "dense" ? "py-2.5" : "py-4" ],
				className
			) }
			ref={ wrapperRef }>
	
			{ /* Leading icon */ }
			{ Icon && isFunction(Icon) ? <Icon className={ cn(classes.icon(state as VariantProps<typeof classes.icon>)) } /> : Icon }

			{ /* Input wrapper */ }
			<div className={ cn("flex relative grow", multiline ? "items-start w-full" : "h-full items-center") }>

				{ /* Input */ }
				{ multiline
					? <textarea
						{ ...field as unknown as TextareaHTMLAttributes<HTMLTextAreaElement> }
						rows={ rows } />
					: <input { ...field } /> }
			
				{ /* Floating label. Pinned to the top on a multi-line field: "centred"
				     in a four-row box is the middle of a paragraph, not a resting place
				     a label floats up from. */ }
				{ label && <p
					className={ cn(classes.label(state as VariantProps<typeof classes.label>), (multiline || hasContents || props.placeholder) && [ "top-0", props.size === "dense" ? "text-xs" : "text-sm" ]) }
					style={{ backgroundColor: "var(--tw-ring-offset-color)" }}>{ label }</p> }
					
			</div>
            
			{ children }

		</label>
	);

});