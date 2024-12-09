import { cva, type VariantProps } from "class-variance-authority";
import { isFunction, merge } from "lodash";
import { useConvergedRef, useEventMap } from "nextui/hooks";
import { cn } from "nextui/util";
import { forwardRef, useState, type InputHTMLAttributes, type ReactElement, type RefObject } from "react";
import type { IconType } from "react-icons";

export const classes = {

	wrapper: cva([
		"relative group/inputfield inline-flex items-center cursor-text gap-2 px-4 shrink-0 min-w-32",
		"[&:has(input:invalid)]:border-error/50 [&:has(input:invalid)]:dark:border-error/50 [&:has(input:invalid)]:focus-within:border-error [&:has(input:invalid)]:focus-within:ring-error [&:has(input:invalid)]:active:border-error [&:has(input:invalid)]:active:ring-error [&:has(input:invalid)]:dark:focus-within:border-error [&:has(input:invalid)]:dark:focus-within:ring-error [&:has(input:invalid)]:dark:active:border-error [&:has(input:invalid)]:dark:active:ring-error",
		"[&:has(input:disabled)]:border-dashed [&:has(input:disabled)]:active:ring-0 [&:has(input:disabled)]:focus-within:ring-0 [&:has(input:disabled)]:dark:border-dashed [&:has(input:disabled)]:active:border-gray-200 [&:has(input:disabled)]:active:dark:border-gray-700",
	], {
		defaultVariants: {
			variant: "outlined",
			color: "primary"
		},
		variants: {
			size: {
				dense: "px-3",
			},
			variant: {
				outlined: "rounded-md border border-gray-200 dark:border-gray-700 focus-within:ring-1 active:ring-1 transition-[border,box-shadow]",
			},
			color: {
				primary: "focus-within:border-primary focus-within:ring-primary active:border-primary active:ring-primary dark:focus-within:border-primary-500 dark:focus-within:ring-primary-500 dark:active:border-primary-500 dark:active:ring-primary-500",
				"primary:pastel": "focus-within:border-primary focus-within:ring-primary active:border-primary active:ring-primary dark:focus-within:border-primary-300 dark:focus-within:ring-primary-300 dark:active:border-primary-300 dark:active:ring-primary-300",
				error: "focus-within:border-error focus-within:ring-error active:border-error active:ring-error dark:focus-within:border-error-500 dark:focus-within:ring-error-500 dark:active:border-error-500 dark:active:ring-error-500",
				"error:pastel": "focus-within:border-error focus-within:ring-error active:border-error active:ring-error dark:focus-within:border-error-300 dark:focus-within:ring-error-300 dark:active:border-error-300 dark:active:ring-error-300",
				warning: "focus-within:border-warning focus-within:ring-warning active:border-warning active:ring-warning dark:focus-within:border-warning-500 dark:focus-within:ring-warning-500 dark:active:border-warning-500 dark:active:ring-warning-500",
				"warning:pastel": "focus-within:border-warning focus-within:ring-warning active:border-warning active:ring-warning dark:focus-within:border-warning-300 dark:focus-within:ring-warning-300 dark:active:border-warning-300 dark:active:ring-warning-300",
				success: "focus-within:border-success focus-within:ring-success active:border-success active:ring-success dark:focus-within:border-success-500 dark:focus-within:ring-success-500 dark:active:border-success-500 dark:active:ring-success",
				"success:pastel": "focus-within:border-success focus-within:ring-success active:border-success active:ring-success dark:focus-within:border-success-300 dark:focus-within:ring-success-300 dark:active:border-success-300 dark:active:ring-success-300",
				neutral: "focus-within:border-gray-800 focus-within:ring-gray-800 active:border-gray-800 active:ring-gray-800 dark:focus-within:border-gray-200 dark:focus-within:ring-gray-200 dark:active:border-gray-200 dark:active:ring-gray-200",
			},
			disabled: {
				true: "cursor-not-allowed border-dashed active:ring-0 focus-within:ring-0 dark:border-dashed active:border-gray-200 active:dark:border-gray-700",
			},
			invalid: {
				true: "border-error/50 dark:border-error/50 focus-within:border-error focus-within:ring-error active:border-error active:ring-error dark:focus-within:border-error dark:focus-within:ring-error dark:active:border-error dark:active:ring-error",
			}
		}
	}),

	input: cva([
		"peer bg-transparent cursor-text outline-0 border-0 shrink grow inline-flex w-0 min-w-0",
		"placeholder:text-gray-500 placeholder:dark:text-gray-400",
		"disabled:select-none"
	], {
		defaultVariants: {
			color: "primary",
			size: "default"
		},
		variants: {
			size: {
				dense: "h-10 text-sm",
				default: "h-14"
			},
			color: {
				primary: "caret-primary",
				"primary:pastel": "caret-primary dark:caret-primary-300",
				error: "caret-error",
				"error:pastel": "caret-error dark:caret-error-300",
				warning: "caret-warning",
				"warning:pastel": "caret-warning dark:caret-warning-300",
				success: "caret-success",
				"success:pastel": "caret-success dark:caret-success-300",
				neutral: "caret-gray-800 dark:caret-gray-200",
			},
			disabled: {
				true: "cursor-not-allowed select-none",
			},
			invalid: {
				true: "caret-error dark:caret-error",
			}
		}
	}),

	label: cva([
		"absolute inline-flex ring-offset-white dark:ring-offset-gray-800 w-min text-gray-500 dark:text-gray-400",
		"select-none font-normal pointer-events-none whitespace-nowrap transition-[top,font-size,color,padding] -mx-1.5 px-1.5 top-1/2 -translate-y-1/2",
		"group-focus-within/inputfield:top-0 peer-placeholder-shown:top-0",
		"peer-invalid:text-error/85 peer-invalid:dark:text-error/85 group-focus-within/inputfield:peer-invalid:text-error group-active/inputfield:peer-invalid:text-error dark:group-focus-within/inputfield:peer-invalid:text-error dark:group-active/inputfield:peer-invalid:text-error",
	], {
		defaultVariants: {
			size: "default",
			color: "primary"
		},
		variants: {
			size: {
				dense: "text-sm group-focus-within/inputfield:text-xs peer-placeholder-shown:text-xs",
				default: "text-base group-focus-within/inputfield:text-sm peer-placeholder-shown:text-sm"
			},
			color: {
				primary: "group-focus-within/inputfield:text-primary group-active/inputfield:text-primary",
				"primary:pastel": "group-focus-within/inputfield:text-primary group-active/inputfield:text-primary dark:group-focus-within/inputfield:text-primary-300 dark:group-active/inputfield:text-primary-300",
				error: "group-focus-within/inputfield:text-error group-active/inputfield:text-error",
				"error:pastel": "group-focus-within/inputfield:text-error group-active/inputfield:text-error dark:group-focus-within/inputfield:text-error-300 dark:group-active/inputfield:text-error-300",
				warning: "group-focus-within/inputfield:text-warning group-active/inputfield:text-warning",
				"warning:pastel": "group-focus-within/inputfield:text-warning group-active/inputfield:text-warning dark:group-focus-within/inputfield:text-warning-300 dark:group-active/inputfield:text-warning-300",
				success: "group-focus-within/inputfield:text-success group-active/inputfield:text-success",
				"success:pastel": "group-focus-within/inputfield:text-success group-active/inputfield:text-success dark:group-focus-within/inputfield:text-success-300 dark:group-active/inputfield:text-success-300",
				neutral: "group-focus-within/inputfield:text-gray-800 group-active/inputfield:text-gray-800 dark:group-focus-within/inputfield:text-gray-200 dark:group-active/inputfield:text-gray-200",
			},
			disabled: {
				true: "text-gray-400 dark:text-gray-500 group-focus-within/inputfield:text-gray-400 group-active/inputfield:text-gray-400 dark:group-focus-within/inputfield:text-gray-500 dark:group-active/inputfield:text-gray-500"
			},
			invalid: {
				true: "text-error/85 dark:text-error/85 group-focus-within/inputfield:text-error group-active/inputfield:text-error dark:group-focus-within/inputfield:text-error dark:group-active/inputfield:text-error"
			}
		}
	}),

	icon: cva("shrink-0 opacity-80 text-gray-700 dark:text-gray-300", {
		variants: {
			size: {
				dense: "text-xl -mx-0.5",
				default: "text-2xl"
			},
			disabled: {
				true: "text-gray-400 dark:text-gray-500"
			},
			invalid: {
				true: "text-error dark:text-error"
			}
		},
		defaultVariants: {
			size: "default"
		}
	}),

	button: cva("shrink-0", {
		variants: {
			size: {
				dense: "-mr-1.5",
				default: "-mr-2"
			}
		},
		defaultVariants: {
			size: "default"
		}
	})
	
};

type BaseInputProps =
    InputHTMLAttributes<HTMLInputElement> &
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
	wrapper,
	...props
}, ref) {
    
	// Initialize the refs
	const inputRef = useConvergedRef(ref);
	const wrapperRef = useConvergedRef(wrapper);
    
	// Initialize the state
	const [ hasContents, setHasContents ] = useState(false);
	const [ isValid ] = useState(false);
    
	// Add event listeners
	useEventMap(inputRef, {
		input() {
			setHasContents(this.value.length > 0);
		}
	});
    
	useEventMap(wrapperRef, {
		click(event) {
			if (event.target === wrapperRef.current) inputRef.current?.focus();
		}
	});

	return (
		<label
			className={ cn(classes.wrapper(props as VariantProps<typeof classes.wrapper>), className) }
			ref={ wrapperRef }>
	
			{ /* Leading icon */ }
			{ Icon && isFunction(Icon) ? <Icon className={ cn(classes.icon(merge(props, { invalid: !isValid }) as VariantProps<typeof classes.icon>)) } /> : Icon }

			{ /* Input wrapper */ }
			<div className="flex relative h-full grow items-center">

				{ /* Input */ }
				<input
					{ ...props }
					className={ cn(classes.input(props as VariantProps<typeof classes.input>)) }
					ref={ inputRef } />
			
				{ /* Floating label */ }
				{ label && <p
					className={ cn(classes.label(props as VariantProps<typeof classes.label>), (hasContents || props.placeholder) && [ "top-0", props.size === "dense" ? "text-xs" : "text-sm" ]) }
					style={{ backgroundColor: "var(--tw-ring-offset-color)" }}>{ label }</p> }
					
			</div>
            
			{ children }

		</label>
	);

});