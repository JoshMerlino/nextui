import { type VariantProps } from "class-variance-authority";
import { isFunction, merge, omit } from "lodash";
import { useConvergedRef, useEventMap } from "nextui/hooks";
import { cn } from "nextui/util";
import { forwardRef, useCallback, useEffect, useState, type ReactElement, type RefObject, type TextareaHTMLAttributes } from "react";
import type { IconType } from "react-icons";
import { classes } from ".";

type TextareaInputProps =
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "rows"> &
    VariantProps<typeof classes[keyof typeof classes]> &
	Partial<{

        /** What routed `type="text"` here instead of BaseInput. Swallowed on
         *  arrival — it is the factory's flag, not a DOM attribute. */
        multiline: boolean;

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

        /** How many lines the field opens at, and the fewest it ever shows —
         *  the floor the auto-height shrinks back to. @default 4 */
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

/**
 * The multi-line text field, wearing the same outline, colours and floating
 * label as every other field — the MD2 filled-outline anatomy, with the label
 * pinned to the top the way the spec draws text areas, since "centred" in a
 * four-row box is the middle of a paragraph rather than a resting place a
 * label floats up from.
 *
 * A dedicated variant rather than a branch inside BaseInput: the element is a
 * `<textarea>`, its height is behaviour rather than a style, and the pair of
 * them threaded through every line of the single-line field made both harder
 * to read than two components that each do one thing.
 *
 * The height follows the content. Each measurement collapses the box to
 * `auto` first so `scrollHeight` reports the content's true height — measured
 * against the standing height it can only ever grow — then writes that back,
 * so the field grows a line when a line wraps and shrinks when it is deleted,
 * never below `rows`. There is no manual resize handle: a box that manages
 * its own height has nothing for one to do.
 */
export default forwardRef<HTMLTextAreaElement, TextareaInputProps>(function({
	children,
	className,
	icon: Icon,
	label,
	invalid = false,
	multiline: _multiline,
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

	/** Fit the box to what it holds — see the component note. */
	const resize = useCallback(function() {
		const textarea = inputRef.current;
		if (!textarea) return;
		textarea.style.height = "auto";
		textarea.style.height = `${ textarea.scrollHeight }px`;
	}, [ inputRef ]);

	// Recompute from the DOM after every commit, rather than from the keystroke
	// that caused it — the same reasoning as BaseInput: a change re-renders the
	// input, and read off the `input` event the re-render lands while `value`
	// is still the pre-keystroke prop, which React then writes back over the
	// keystroke. A commit is the moment React has finished writing `value`, so
	// what is read here agrees with the props. The height is re-fitted in the
	// same breath, which is also what sizes a controlled value's programmatic
	// changes — those never fire `input`.
	useEffect(function() {
		const input = inputRef.current;
		if (!input) return;
		setHasContents(input.value.length > 0);
		setIsValid(input.checkValidity());
		resize();
	});

	// A wrapped line moves when the box changes width, not when anything is
	// typed — a breakpoint, a drawer opening, a grid column freeing up. Width
	// only: the observer also fires for the height this very component writes,
	// and refitting on that echo is a loop.
	useEffect(function() {
		const textarea = inputRef.current;
		if (!textarea) return;

		let width = 0;
		const observer = new ResizeObserver(function(entries) {
			const next = entries[0]?.contentRect.width ?? 0;
			if (next === width) return;
			width = next;
			resize();
		});

		observer.observe(textarea);
		return () => observer.disconnect();
	}, [ inputRef, resize ]);

	// An uncontrolled textarea re-renders for nobody, so its own typing has to
	// schedule the sync above. A controlled one gets it from its parent's
	// render. The height fits on every keystroke either way — for the
	// uncontrolled field this is the only place it happens.
	useEventMap(inputRef, {
		input() {
			resize();
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

	// Sync props with state
	useEffect(() => setIsValid(!invalid), [ invalid ]);

	// Merged into a fresh object: lodash's merge MUTATES its first argument, so
	// merging into `props` writes `invalid` into the very object the textarea
	// spreads below, and React forwards it to the DOM as an unknown attribute.
	const state = merge({}, props, { invalid: !isValid || invalid });

	return (
		<label
			className={ cn(
				classes.wrapper(state as VariantProps<typeof classes.wrapper>),

				// A multi-line box can't take its height from a fixed-height child,
				// so the wrapper carries its own padding and lines the icon up with
				// the first line rather than the middle of the paragraph.
				"items-start",
				props.size === "dense" ? "py-2.5" : "py-4",
				className
			) }
			ref={ wrapperRef }>

			{ /* Leading icon */ }
			{ Icon && isFunction(Icon) ? <Icon className={ cn(classes.icon(state as VariantProps<typeof classes.icon>)) } /> : Icon }

			{ /* Input wrapper */ }
			<div className="flex relative grow items-start w-full">

				{ /* The field itself. `resize-none` and hidden overflow because the
				     height is managed — a drag handle and a scrollbar are both the
				     box refusing to fit, which is the one thing it never does. */ }
				{ /* `type` is the factory's routing key and means nothing to a
				     textarea, so it stops here rather than reaching the DOM. */ }
				<textarea
					{ ...omit(props, "size", "type") }
					className={ cn(classes.input(state as VariantProps<typeof classes.input>), "h-auto w-full resize-none overflow-hidden leading-6") }
					ref={ inputRef }
					rows={ rows } />

				{ /* Floating label, pinned ON the outline rather than merely to the
				     top of the text. The wrapper carries vertical padding a
				     single-line field doesn't have, so `top-0` here is the first
				     text line, a padding's height below the border — the label backs
				     out by exactly that padding. The focus and placeholder variants
				     from the base classes are overridden to the same place, or
				     focusing the field would snap the label back down into the box. */ }
				{ label && <p
					className={ cn(
						classes.label(state as VariantProps<typeof classes.label>),
						props.size === "dense"
							? "-top-2.5 group-focus-within/inputfield:-top-2.5 peer-placeholder-shown:-top-2.5 text-xs"
							: "-top-4 group-focus-within/inputfield:-top-4 peer-placeholder-shown:-top-4 text-sm"
					) }
					style={{ backgroundColor: "var(--tw-ring-offset-color)" }}>{ label }</p> }

			</div>

			{ children }

		</label>
	);

});
