import { cva, type VariantProps } from "class-variance-authority";
import { omit } from "lodash";
import { useConvergedRef } from "nextui/hooks";
import { Ripple } from "nextui/Ripple";
import { cn } from "nextui/util";
import { forwardRef, InputHTMLAttributes } from "react";
import { MdCheck, MdRemove } from "react-icons/md";

export const classes = {

	// The box is 20px with a 2px border, expressed the way `box-sizing: border-box`
	// needs it expressed: `w-5` is the OUTER size, with the border drawn inside it.
	//
	// It used to read `w-4 ... checked:border-[8px]`, which is the same intent
	// written for content-box — 16px plus 2px of border on each side. Tailwind's
	// preflight sets `box-sizing: border-box` on everything, so that collapsed to a
	// 16px box with a 12px core instead, and the checkbox rendered a size smaller
	// than it was drawn to be everywhere it was used.
	//
	// `checked:border-*` has to stay exactly half the box: the checked state is
	// drawn by growing the border until it meets in the middle, and any less leaves
	// a hole in the centre of a checkbox that is supposed to read as filled.
	// `block` so the box fills its wrapper exactly. An input is inline by default,
	// which sits it on a text baseline and leaves descender space under it — the
	// box then hangs low inside the wrapper, and the check and the ripple, which
	// are positioned against the WRAPPER, no longer line up with it.
	//
	// The optical nudge that used to live here is on the wrapper now, so the box,
	// the tick and the ripple all move together.
	// `disabled:` comes from the prop landing on the input, and the icon
	// mirrors it through `peer-disabled:` below, so a disabled box and its
	// glyph dim together. Half strength rather than hidden: a disabled
	// checkbox still states its value, it just refuses the click.
	checkbox: cva([
		"appearance-none block border-2 border-gray-500 aspect-square rounded-[2px] peer not-motion-reduce:transition-[border-color,border-width] cursor-pointer z-50",
		"disabled:cursor-not-allowed disabled:opacity-50"
	], {
		defaultVariants: {
			color: "primary",
			size: "default"
		},
		variants: {

			// The checked border is always HALF the box — see the note above; it is
			// what fills the middle in. A dense box keeps the same 2px unchecked
			// border, so it reads as the same control drawn smaller rather than as a
			// thinner one.
			size: {
				default: "w-5 h-5 checked:border-[10px]",
				dense: "w-4 h-4 checked:border-[8px]"
			},
			color: {
				primary: "checked:border-primary",
				"primary:pastel": "checked:border-primary dark:checked:border-primary-300",
				error: "checked:border-error",
				"error:pastel": "checked:border-error dark:checked:border-error-300",
				success: "checked:border-success",
				"success:pastel": "checked:border-success dark:checked:border-success-300",
				warning: "checked:border-warning",
				"warning:pastel": "checked:border-warning dark:checked:border-warning-300",
				neutral: "checked:border-gray-800 dark:checked:border-gray-200",
			}
		}
	}),

	// `text-xl` sizes the glyph, which react-icons draws at 1em: 20px, matching the
	// box, so the icon element never spills past it. The tick itself has margins
	// inside its own viewBox and lands around 12px, which is the proportion
	// Material draws a checkmark at. Without a size here it inherited whatever the
	// surrounding text happened to be and changed size per call site.
	icon: cva([
		"absolute inset-0 flex items-center justify-center z-10 not-motion-reduce:transition-transform peer-disabled:opacity-50"
	], {
		defaultVariants: {
			color: "primary",
			size: "default"
		},
		variants: {

			// One em per box, so the glyph never spills past it at either size.
			size: {
				default: "text-xl",
				dense: "text-base"
			},
			checked: {
				false: "scale-0",
				true: "scale-100",
			},
			color: {
				primary: "text-white",
				"primary:pastel": "text-white dark:text-primary-950",
				error: "text-white",
				"error:pastel": "text-white dark:text-error-950",
				success: "text-white",
				"success:pastel": "text-white dark:text-success-950",
				warning: "text-white",
				"warning:pastel": "text-white dark:text-warning-950",
				neutral: "white dark:text-gray-950",
			}
		}
	}),

	ripple: cva("cursor-pointer", {
		defaultVariants: {
			disabled: false,
			color: "primary"
		},
		variants: {
			disabled: {
				true: "pointer-events-none",
			},
			color: {
				primary: "group-has-[.peer:checked]/checkbox:bg-primary dark:group-has-[.peer:checked]/checkbox:bg-primary",
				"primary:pastel": "group-has-[.peer:checked]/checkbox:bg-primary dark:group-has-[.peer:checked]/checkbox:bg-primary-300",
				error: "group-has-[.peer:checked]/checkbox:bg-error dark:group-has-[.peer:checked]/checkbox:bg-error",
				"error:pastel": "group-has-[.peer:checked]/checkbox:bg-error dark:group-has-[.peer:checked]/checkbox:bg-error-300",
				success: "group-has-[.peer:checked]/checkbox:bg-success dark:group-has-[.peer:checked]/checkbox:bg-success",
				"success:pastel": "group-has-[.peer:checked]/checkbox:bg-success dark:group-has-[.peer:checked]/checkbox:bg-success-300",
				warning: "group-has-[.peer:checked]/checkbox:bg-warning dark:group-has-[.peer:checked]/checkbox:bg-warning",
				"warning:pastel": "group-has-[.peer:checked]/checkbox:bg-warning dark:group-has-[.peer:checked]/checkbox:bg-warning-300",
				neutral: "group-has-[.peer:checked]/checkbox:bg-gray-800 dark:group-has-[.peer:checked]/checkbox:bg-gray-200",
			}
		},
	}),

	rippleWrapper: cva([
		"rounded-full overflow-hidden",
		"group-hover/checkbox:bg-gray-500/10 dark:group-hover/checkbox:bg-gray-500/10 group-focus-within/checkbox:bg-gray-500/10 dark:group-focus-within/checkbox:bg-gray-500/10"
	], {
		defaultVariants: {
			disabled: false,
			color: "primary"
		},
		variants: {
			disabled: {
				true: "pointer-events-none",
			},
			color: {
				primary: "group-hover/checkbox:bg-primary/10 group-focus-within/checkbox:bg-primary/10",
				"primary:pastel": "group-hover/checkbox:peer-checked:bg-primary/10 dark:group-hover/checkbox:peer-checked:bg-primary-300/10 group-focus-within/checkbox:peer-checked:bg-primary/10 dark:group-focus-within/checkbox:peer-checked:bg-primary-300/10",
				error: "group-hover/checkbox:bg-error/10 group-focus-within/checkbox:bg-error/10",
				"error:pastel": "group-hover/checkbox:peer-checked:bg-error/10 dark:group-hover/checkbox:peer-checked:bg-error-300/10 group-focus-within/checkbox:peer-checked:bg-error/10 dark:group-focus-within/checkbox:peer-checked:bg-error-300/10",
				success: "group-hover/checkbox:bg-success/10 group-focus-within/checkbox:bg-success/10",
				"success:pastel": "group-hover/checkbox:peer-checked:bg-success/10 dark:group-hover/checkbox:peer-checked:bg-success-300/10 group-focus-within/checkbox:peer-checked:bg-success/10 dark:group-focus-within/checkbox:peer-checked:bg-success-300/10",
				warning: "group-hover/checkbox:bg-warning/10 group-focus-within/checkbox:bg-warning/10",
				"warning:pastel": "group-hover/checkbox:peer-checked:bg-warning/10 dark:group-hover/checkbox:peer-checked:bg-warning-300/10 group-focus-within/checkbox:peer-checked:bg-warning/10 dark:group-focus-within/checkbox:peer-checked:bg-warning-300/10",
				neutral: "group-hover/checkbox:bg-gray-800/10 group-focus-within/checkbox:bg-gray-800/10 dark:group-hover/checkbox:bg-gray-200/10 dark:group-focus-within/checkbox:bg-gray-200/10",
			}
		},
	})

};

// `size` is omitted from the input's own attributes: on an <input> it is a
// number of characters, which means nothing to a checkbox, and keeping it would
// intersect with the variant below into `never`.
export const Checkbox = forwardRef<HTMLInputElement, Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & VariantProps<typeof classes[keyof typeof classes]> & Partial<{

	/**
	 * The color of the input
	 * @default "primary"
	 */
	color: "primary" | "primary:pastel" | "error" | "error:pastel" | "warning" | "warning:pastel" | "success" | "success:pastel" | "neutral";

	/**
	 * How big the box is. `dense` is 16px against the default's 20px, for a list
	 * of them beside one line of text each — where the full-size control is
	 * taller than the row it belongs to.
	 * @default "default"
	 */
	size: "default" | "dense";

	/**
	 * Whether the checkbox is indeterminate
	 * @default false
	 */
	indeterminate: boolean;

	/**
	 * Weather or not to show the ripple effect
	 * @default true
	 */
	ripple: boolean | Partial<{
		
		/**
		 * Custom class overrides
		 */
		className: string;

		/**
		 * Weather or not the ripple is disabled
		 * @default false
		 */
		disabled: boolean;

	}>;

}>>(function({ children, indeterminate, ripple, className, ...props }, fref) {

	const ref = useConvergedRef(fref);

	if (children) return (
		<label className={ cn("flex items-center group/checkbox", props.size === "dense" ? "gap-2" : "gap-4", className) }>
			<Checkbox { ...props } />
			{ children }
		</label>
	);

	// Tracks the box: this is what the check overlay and the ripple below are both
	// positioned against, so a wrapper of a different size — or one the box is
	// offset within — leaves them off-centre inside it. The optical nudge that
	// aligns the box against adjacent text belongs here for the same reason: on
	// the wrapper it moves all three, on the input it moved only the box.
	const dense = props.size === "dense";

	return (
		<label className={ cn("relative -translate-y-px isolate group/checkbox", dense ? "h-4 w-4" : "h-5 w-5") }>

			<input
				className={ cn(classes.checkbox(props as VariantProps<typeof classes.checkbox>), className) }
				ref={ ref }
				type="checkbox"
				{ ...omit(props, "indeterminate", "size") } />
			
			<div className={ cn(classes.icon(props as VariantProps<typeof classes.icon>)) }>
				{ indeterminate ? <MdRemove /> : <MdCheck /> }
			</div>

			{ /* Ripple. Its halo hangs the same distance off the box at either size,
			     so a dense one keeps a target worth pointing at. */ }
			{ (props.disabled || (typeof ripple === "boolean" && !ripple)) || (
				<div className={ cn("z-20 absolute rounded-full overflow-hidden", dense ? "-inset-2" : "-inset-2.5", classes.rippleWrapper(props as VariantProps<typeof classes.rippleWrapper>)) }>
					<Ripple { ...typeof ripple === "boolean" ? {} : ripple } className={ cn(classes.ripple(props as VariantProps<typeof classes.ripple>), typeof ripple === "object" && ripple.className) } emitFromCenter />
				</div>
			) }
			
		</label>
	);

});