import { ClassValue } from "clsx";
import { InputHTMLAttributes } from "react";
import { MdCheck, MdRemove } from "react-icons/md";
import { cn } from "../util";

interface Props {

	/**
	 * Color of the checkbox
	 * @default "primary"
	 */
	color: "primary" | "neutral" | "error" | "warning" | "success";

	/**
	 * Whether the checkbox is indeterminate
	 * @default false
	 */
	indeterminate: boolean;

}

export function Checkbox({ color = "neutral", className, children, ...props }: InputHTMLAttributes<HTMLInputElement> & Partial<Props>) {

	// Initialize unique ID
	props.id = props.id || Math.floor(Math.random() * 1e10).toString(36);

	// Checkbox styles
	const checkbox: ClassValue[] = [

		// Base class
		"appearance-none border-2 border-gray-500 w-5 h-5 rounded checked:border-[10px] transition-[border] duration-75 focus:outline-0 peer",

		// Color
		{
			"checked:border-primary checked:after:bg-primary/20": color === "primary",
			"checked:border-gray-800 dark:checked:border-gray-200 checked:after:bg-gray/20": color === "neutral",
			"checked:border-error checked:after:bg-error/20": color === "error",
			"checked:border-warning checked:after:bg-warning/20": color === "warning",
			"checked:border-success checked:after:bg-success/20": color === "success",
		},

		// Ripple jawn
		!(props.disabled || props.readOnly) && "after:content[''] after:bg-gray-500/20 after:absolute after:w-12 after:h-12 after:left-1/2 after:top-1/2 after:rounded-full after:-translate-x-1/2 after:-translate-y-1/2 after:pointer-events-none after:-z-[1] after:scale-0 focus:after:scale-100 group-active/checkbox:after:scale-100 duration-100 after:transition-transform after:z-10",

		// Disabled
		props.disabled && "cursor-not-allowed !border-gray-500",

		className,

	];

	// Icon class color
	const icon: ClassValue[] = [

		// Base class
		"m-0.5 scale-0 peer-checked:scale-125 absolute transition-transform pointer-events-none",

		// Color
		{
			"text-primary-text": color === "primary",
			"text-gray-200 dark:text-gray-800": color === "neutral",
			"text-error-text": color === "error",
			"text-warning-text": color === "warning",
			"text-success-text": color === "success",
		},

		// Disabled
		props.disabled && "opacity-50 !text-white",

	];

	return (
		<div className="flex items-center gap-4 mr-auto group/checkbox font-roboto">
			<div className="relative flex">
				<input
					className={ cn(checkbox) }
					type="checkbox"
					{ ...props } />
				<div className={ cn(icon) }>
					{ props.indeterminate ? <MdRemove /> : <MdCheck /> }
				</div>
			</div>
			{children && <label className={ cn("select-none", className) } htmlFor={ props.id }>{children}</label>}
		</div>
	);
}