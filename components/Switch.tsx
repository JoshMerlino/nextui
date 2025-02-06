import { cva, type VariantProps } from "class-variance-authority";
import { omit } from "lodash";
import { useConvergedRef } from "nextui/hooks";
import { Ripple } from "nextui/Ripple";
import { cn } from "nextui/util";
import { forwardRef, InputHTMLAttributes } from "react";

export const classes = {
	track: cva(
		[
			"appearance-none peer focus:outline-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50",
			"w-[34px] h-[14px] bg-gray-300 dark:bg-gray-600 checked:bg-opacity-50 dark:checked:bg-opacity-50 disabled:checked:!bg-opacity-50"
		],
		{
			variants: {
				color: {
					primary: "checked:bg-primary/50 dark:checked:bg-primary/50",
					"primary:pastel": "checked:bg-primary/50 dark:checked:bg-primary-300/50",
					error: "checked:bg-error/50 dark:checked:bg-error/50",
					"error:pastel": "checked:bg-error/50 dark:checked:bg-error-300/50",
					success: "checked:bg-success/50 dark:checked:bg-success/50",
					"success:pastel": "checked:bg-success/50 dark:checked:bg-success-300/50",
					warning: "checked:bg-warning/50 dark:checked:bg-warning/50",
					"warning:pastel": "checked:bg-warning/50 dark:checked:bg-warning-300/50",
					neutral: "checked:bg-gray-500/50 dark:checked:bg-gray-500/50"
				}
			},
			defaultVariants: {
				color: "primary"
			}
		}
	),

	thumb: cva(
		[
			"aspect-square w-5 absolute inset-0 rounded-full transition-all text-transparent flex items-center justify-center peer-disabled:cursor-not-allowed bg-gray-100 dark:bg-gray-400 shadow-sm shadow-black/20 peer-disabled:bg-gray-400 peer-disabled:grayscale-[0.5] text-[0px] peer-checked:ml-3.5 peer-checked:bg-current"
		],
		{
			variants: {
				color: {
					primary: "peer-checked:text-primary",
					"primary:pastel": "peer-checked:text-primary dark:peer-checked:text-primary-300",
					error: "peer-checked:text-error",
					"error:pastel": "peer-checked:text-error dark:peer-checked:text-error-300",
					success: "peer-checked:text-success",
					"success:pastel": "peer-checked:text-success dark:peer-checked:text-success-300",
					warning: "peer-checked:text-warning",
					"warning:pastel": "peer-checked:text-warning dark:peer-checked:text-warning-300",
					neutral: "peer-checked:text-gray-500"
				}
			},
			defaultVariants: {
				color: "primary"
			}
		}
	),

	ripple: cva([], {
		defaultVariants: {
			disabled: false,
			color: "primary"
		},
		variants: {
			disabled: {
				true: "pointer-events-none",
			},
			color: {
				primary: "group-has-[.peer:checked]/switch:bg-primary group-has-[.peer:checked]/switch:dark:bg-primary",
				"primary:pastel": "group-has-[.peer:checked]/switch:bg-primary group-has-[.peer:checked]/switch:dark:bg-primary-300",
				error: "group-has-[.peer:checked]/switch:bg-error group-has-[.peer:checked]/switch:dark:bg-error",
				"error:pastel": "group-has-[.peer:checked]/switch:bg-error group-has-[.peer:checked]/switch:dark:bg-error-300",
				success: "group-has-[.peer:checked]/switch:bg-success group-has-[.peer:checked]/switch:dark:bg-success",
				"success:pastel": "group-has-[.peer:checked]/switch:bg-success group-has-[.peer:checked]/switch:dark:bg-success-300",
				warning: "group-has-[.peer:checked]/switch:bg-warning group-has-[.peer:checked]/switch:dark:bg-warning",
				"warning:pastel": "group-has-[.peer:checked]/switch:bg-warning group-has-[.peer:checked]/switch:dark:bg-warning-300",
				neutral: "group-has-[.peer:checked]/switch:bg-gray-500 group-has-[.peer:checked]/switch:dark:bg-gray-500"
			}
		},
	}),

	rippleWrapper: cva([
		"rounded-full overflow-hidden",
		"group-hover/switch:bg-gray-500/10 dark:group-hover/switch:bg-gray-500/10 group-focus-within/switch:bg-gray-500/10 dark:group-focus-within/switch:bg-gray-500/10 "
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
				primary: "group-hover/switch:bg-primary/10 group-focus-within/switch:bg-primary/10",
				"primary:pastel": "group-hover/switch:peer-checked:bg-primary/10 dark:group-hover/switch:peer-checked:bg-primary-300/10 group-focus-within/switch:peer-checked:bg-primary/10 dark:group-focus-within/switch:peer-checked:bg-primary-300/10",
				error: "group-hover/switch:bg-error/10 group-focus-within/switch:bg-error/10",
				"error:pastel": "group-hover/switch:peer-checked:bg-error/10 dark:group-hover/switch:peer-checked:bg-error-300/10 group-focus-within/switch:peer-checked:bg-error/10 dark:group-focus-within/switch:peer-checked:bg-error-300/10",
				success: "group-hover/switch:bg-success/10 group-focus-within/switch:bg-success/10",
				"success:pastel": "group-hover/switch:peer-checked:bg-success/10 dark:group-hover/switch:peer-checked:bg-success-300/10 group-focus-within/switch:peer-checked:bg-success/10 dark:group-focus-within/switch:peer-checked:bg-success-300/10",
				warning: "group-hover/switch:bg-warning/10 group-focus-within/switch:bg-warning/10",
				"warning:pastel": "group-hover/switch:peer-checked:bg-warning/10 dark:group-hover/switch:peer-checked:bg-warning-300/10 group-focus-within/switch:peer-checked:bg-warning/10 dark:group-focus-within/switch:peer-checked:bg-warning-300/10",
				neutral: "group-hover/switch:bg-gray-800/10 group-focus-within/switch:bg-gray-800/10 dark:group-hover/switch:bg-gray-200/10 dark:group-focus-within/switch:bg-gray-200/10",
			}
		},
	})
};

export const Switch = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof classes.track> & VariantProps<typeof classes.thumb> & VariantProps<typeof classes.ripple> & VariantProps<typeof classes.rippleWrapper> & Partial<{

    /**
     * Color of the switch
     * @default "primary"
     */
    color?: "primary" | "primary:pastel" | "error" | "error:pastel" | "warning" | "warning:pastel" | "success" | "success:pastel" | "neutral";

    /**
     * Weather or not to show the ripple effect
     * @default true
     */
    ripple?: boolean | Partial<{

        /**
         * Custom class overrides
         */
        className: string;

        /**
         * Whether or not the ripple is disabled
         * @default false
         */
        disabled: boolean;

    }>;

}>>(function({ children, ripple, className, color = "neutral", ...props }, fref) {

	const ref = useConvergedRef(fref);

	// If children exist, wrap input in label, just like the Checkbox component
	if (children) {
		return (
			<label className={ cn("flex items-center gap-4 group/switch cursor-pointer", className) }>
				<Switch { ...props } color={ color } ref={ fref } ripple={ ripple } />
				{ children }
			</label>
		);
	}

	return (
		<label className="relative h-5 w-[34px] isolate group/switch">
			<input
				className={ cn(classes.track({ color }), className) }
				ref={ ref }
				type="checkbox"
				{ ...omit(props, "ripple") } />

			<div className={ cn(classes.thumb({ color })) } />
			
			{ (props.disabled || (typeof ripple === "boolean" && !ripple)) || (
				<div className={ cn("aspect-square w-9 h-9 -top-2 z-20 absolute rounded-full overflow-hidden transition-transform -translate-x-2 peer-checked:translate-x-1.5", classes.rippleWrapper({ color, disabled: props.disabled })) }>
					<Ripple { ...typeof ripple === "boolean" ? {} : ripple } className={ cn(classes.ripple({ color, disabled: props.disabled }), typeof ripple === "object" && ripple.className) } emitFromCenter />
				</div>
			) }
            
		</label>
	);
});
