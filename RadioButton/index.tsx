import { ClassValue } from "clsx";
import { InputHTMLAttributes } from "react";
import { cn } from "../util";

interface Props {

	/**
	 * Color of the checkbox
	 * @default "primary"
	 */
	color: "primary" | "neutral" | "error" | "warning" | "success";

}

export function RadioButton({ color = "neutral", className, children, ...props }: InputHTMLAttributes<HTMLInputElement> & Partial<Props>) {

	// Initialize unique ID
	props.id = props.id || Math.floor(Math.random() * 1e10).toString(36);

	// Checkbox styles
	const radioButton: ClassValue[] = [

		// Base class
		"appearance-none border-2 border-gray-500 w-5 aspect-square rounded-full transition-[border] duration-75 focus:outline-0 peer",

		// Color
		{
			"checked:border-primary checked:after:bg-primary/20": color === "primary",
			"checked:border-gray-800 checked:dark:border-gray-200 checked:after:bg-gray/20": color === "neutral",
			"checked:border-error checked:after:bg-error/20": color === "error",
			"checked:border-warning checked:after:bg-warning/20": color === "warning",
			"checked:border-success checked:after:bg-success/20": color === "success",
		},

		// Ripple jawn
		!props.disabled && "after:content[''] after:bg-gray-500/20 after:absolute after:w-12 after:h-12 after:left-1/2 after:top-1/2 after:rounded-full after:-translate-x-1/2 after:-translate-y-1/2 after:pointer-events-none after:-z-[1] after:scale-0 focus:after:scale-100 group-active/checkbox:after:scale-100 duration-100 after:transition-transform active:border-gray-600 active:dark:border-gray-500 after:z-10",

		// Disabled
		props.disabled && "cursor-not-allowed !border-gray-500",

		className,

	];

	// Nipple style
	const nipple: ClassValue[] = [
	
		// Base class
		"absolute inset-0 m-[5px] rounded-full transition-transform scale-0 peer-checked:scale-100 pointer-events-none",
		
		// Color
		{
			"bg-primary": color === "primary",
			"bg-gray-800 dark:bg-gray-200": color === "neutral",
			"bg-error": color === "error",
			"bg-warning": color === "warning",
			"bg-success": color === "success",
		},

		// Disabled
		props.disabled && "!bg-gray-500",

	];

	return (
		<div className="flex items-center gap-4 mr-auto group/checkbox font-roboto">
			<div className="relative flex">
				<input
					className={ cn(radioButton) }
					type="radio"
					{ ...props } />
				<div className={ cn(nipple) } />
			</div>
			{children && <label className={ cn("select-none", className) } htmlFor={ props.id }>{children}</label>}
		</div>
	);
}