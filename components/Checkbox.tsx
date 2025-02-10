import { cva, type VariantProps } from "class-variance-authority";
import { omit } from "lodash";
import { useConvergedRef } from "nextui/hooks";
import { Ripple } from "nextui/Ripple";
import { cn } from "nextui/util";
import { forwardRef, InputHTMLAttributes } from "react";
import { MdCheck, MdRemove } from "react-icons/md";

export const classes = {

	checkbox: cva([
		"appearance-none -translate-y-px border-2 border-gray-500 w-4 h-4 aspect-square rounded-[2px] peer checked:border-[8px] not-motion-reduce:transition-[border-color,border-width] cursor-pointer z-50"
	], {
		defaultVariants: {
			color: "primary",
		},
		variants: {
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

	icon: cva([
		"absolute inset-0 flex items-center justify-center z-10 not-motion-reduce:transition-transform"
	], {
		defaultVariants: {
			color: "primary",
		},
		variants: {
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
				primary: "group-has-[.peer:checked]/checkbox:bg-primary group-has-[.peer:checked]/checkbox:dark:bg-primary",
				"primary:pastel": "group-has-[.peer:checked]/checkbox:bg-primary group-has-[.peer:checked]/checkbox:dark:bg-primary-300",
				error: "group-has-[.peer:checked]/checkbox:bg-error group-has-[.peer:checked]/checkbox:dark:bg-error",
				"error:pastel": "group-has-[.peer:checked]/checkbox:bg-error group-has-[.peer:checked]/checkbox:dark:bg-error-300",
				success: "group-has-[.peer:checked]/checkbox:bg-success group-has-[.peer:checked]/checkbox:dark:bg-success",
				"success:pastel": "group-has-[.peer:checked]/checkbox:bg-success group-has-[.peer:checked]/checkbox:dark:bg-success-300",
				warning: "group-has-[.peer:checked]/checkbox:bg-warning group-has-[.peer:checked]/checkbox:dark:bg-warning",
				"warning:pastel": "group-has-[.peer:checked]/checkbox:bg-warning group-has-[.peer:checked]/checkbox:dark:bg-warning-300",
				neutral: "group-has-[.peer:checked]/checkbox:bg-gray-800 group-has-[.peer:checked]/checkbox:dark:bg-gray-200",
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

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof classes[keyof typeof classes]> & Partial<{

	/**
	 * The color of the input
	 * @default "primary"
	 */
	color: "primary" | "primary:pastel" | "error" | "error:pastel" | "warning" | "warning:pastel" | "success" | "success:pastel" | "neutral";

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
		<label className={ cn("flex items-center gap-4 group/checkbox", className) }>
			<Checkbox { ...props } />
			{ children }
		</label>
	);

	return (
		<label className="relative h-4 w-4 isolate group/checkbox">
			
			<input
				className={ cn(classes.checkbox(props as VariantProps<typeof classes.checkbox>), className) }
				ref={ ref }
				type="checkbox"
				{ ...omit(props, "indeterminate") } />
			
			<div className={ cn(classes.icon(props as VariantProps<typeof classes.icon>)) }>
				{ indeterminate ? <MdRemove /> : <MdCheck /> }
			</div>

			{ /* Ripple */ }
			{ (props.disabled || (typeof ripple === "boolean" && !ripple)) || (
				<div className={ cn("-inset-2.5 z-20 absolute rounded-full overflow-hidden", classes.rippleWrapper(props as VariantProps<typeof classes.rippleWrapper>)) }>
					<Ripple { ...typeof ripple === "boolean" ? {} : ripple } className={ cn(classes.ripple(props as VariantProps<typeof classes.ripple>), typeof ripple === "object" && ripple.className) } emitFromCenter />
				</div>
			) }
			
		</label>
	);

});