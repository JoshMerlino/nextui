import { ClassValue } from "clsx";
import { InputHTMLAttributes } from "react";
import { cn } from "../util";

interface Props {

	/**
	 * Color of the checkbox
	 * @default "primary"
	 */
	color: "primary" | "neutral" | "error" | "warning" | "success";

	/**
	 * Pastel color
	 * @default false
	 */
	pastel: boolean;

}

export function RadioButton({ color = "neutral", className, children, pastel, ...props }: InputHTMLAttributes<HTMLInputElement> & Partial<Props>) {

	// Initialize unique ID
	props.id = props.id || Math.floor(Math.random() * 1e10).toString(36);

	// Checkbox styles
	const radioButton: ClassValue[] = [

		// Base class
		"appearance-none border-2 border-gray-500 w-5 h-5 rounded-full transition-[border] duration-75 focus:outline-0 peer",

		// Color
		{
			"checked:border-primary checked:after:bg-primary/20": color === "primary",
			"checked:border-gray-800 checked:dark:border-gray-200 checked:after:bg-gray/20": color === "neutral",
			"checked:border-error checked:after:bg-error/20": color === "error",
			"checked:border-warning checked:after:bg-warning/20": color === "warning",
			"checked:border-success checked:after:bg-success/20": color === "success",
		},

		// Pastel color
		{
			"dark:checked:border-primary-300 dark:checked:after:bg-primary-300/10": color === "primary" && pastel,
			"dark:checked:border-gray-300 dark:checked:after:bg-gray-300/10": color === "neutral" && pastel,
			"dark:checked:border-error-300 dark:checked:after:bg-error-300/10": color === "error" && pastel,
			"dark:checked:border-warning-300 dark:checked:after:bg-warning-300/10": color === "warning" && pastel,
		},

		// Ripple jawn
		!props.disabled && "after:content[''] after:bg-gray-500/20 after:absolute after:w-12 after:h-12 after:left-1/2 after:top-1/2 after:rounded-full after:-translate-x-1/2 after:-translate-y-1/2 after:pointer-events-none after:-z-[1] after:scale-0 focus:after:scale-100 group-active/radio:after:scale-100 group-active/radio:focus-within:after:scale-100 duration-100 after:transition-transform after:z-10",

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
			"bg-gray-800 dark:bg-gray-300": color === "neutral",
			"bg-error": color === "error",
			"bg-warning": color === "warning",
			"bg-success": color === "success",
		},

		// Pastel color
		{
			"dark:bg-primary-300": color === "primary" && pastel,
			"dark:bg-gray-300": color === "neutral" && pastel,
			"dark:bg-error-300": color === "error" && pastel,
			"dark:bg-warning-300": color === "warning" && pastel,
		},

		// Disabled
		props.disabled && "!bg-gray-500",

	];

	return (
		<label className="flex items-center gap-4 mr-auto group/radio font-roboto">
			<div className="relative flex">
				<input
					className={ cn(radioButton) }
					type="radio"
					{ ...props } />
				<div className={ cn(nipple) } />
			</div>
			{ children && <div className={ cn("select-none", className) }>{ children }</div> }
		</label>
	);
}