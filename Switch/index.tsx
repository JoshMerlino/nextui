import { ClassValue } from "clsx";
import { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import { cn } from "../util";

interface Props {

	/**
	 * Color of the checkbox
	 * @default "primary"
	 */
	color: "primary" | "neutral" | "error" | "warning" | "success";

	/**
	 * Variant of the checkbox
	 * @default "default"
	 */
	variant: "default" | "legacy";

	/**
	 * Icon to display on the thumb
	 * @see https://react-icons.github.io/react-icons/
	 */
	icon?: ReactNode;

}

export const Switch = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & Partial<Props>>(function Switch({ color = "neutral", className, variant = "default", children, icon, ...props }, ref) {

	// Initialize unique ID
	props.id = props.id || Math.floor(Math.random() * 1e10).toString(36);

	// Checkbox styles
	const track: ClassValue[] = [

		// Base class
		"appearance-none peer focus:outline-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50",

		// Variant
		{
			"border-2 w-[52px] h-8 checked:border-transparent dark:checked:border-transparent bg-gray-200 border-gray-500 disabled:!bg-gray-300 dark:disabled:!bg-gray-800 dark:bg-gray-800 dark:border-gray-400 disabled:opacity-25 checked:disabled:opacity-50": variant === "default",

			"w-[34px] h-[14px] checked:bg-opacity-50 dark:checked:bg-opacity-50 disabled:checked:!bg-opacity-50 bg-gray-300 dark:bg-gray-500": variant === "legacy"
		},

		// Colors
		{
			"checked:bg-primary dark:checked:bg-primary": color === "primary",
			"checked:bg-gray-500 dark:checked:bg-gray-500": color === "neutral",
			"checked:bg-error dark:checked:bg-error": color === "error",
			"checked:bg-warning dark:checked:bg-warning": color === "warning",
			"checked:bg-success dark:checked:bg-success": color === "success",
		},
		
	];

	// Thumb styles
	const thumb: ClassValue[] = [

		// Base class
		"aspect-square w-4 absolute inset-0 rounded-full transition-all text-transparent flex items-center justify-center peer-disabled:cursor-not-allowed bg-gray-500 peer-checked:bg-white z-[2]",

		// Variant
		{
			"peer-disabled:opacity-50 m-2 peer-checked:m-1 group-active/switch:peer-checked:m-0.5 peer-checked:w-6 pointer-events-none peer-checked:bg-white peer-checked:ml-6 group-active/switch:peer-checked:ml-[22px] peer-disabled:peer-checked:!text-inherit peer-disabled:text-[0px] dark:bg-gray-400 peer-disabled:opacity-25 peer-checked:peer-disabled:opacity-50 group-active/switch:peer-checked:w-7 peer-disabled:peer-checked:!w-6 peer-disabled:peer-checked:!mt-1 peer-disabled:peer-checked:!ml-6": variant === "default",
			
			"w-5 bg-gray-100 shadow-sm shadow-black/20 -mt-[3px] peer-checked:ml-3.5 peer-disabled:bg-gray-400 peer-disabled:peer-checked:bg-current peer-checked:bg-current peer-disabled:grayscale-[0.5] text-[0px]": variant === "legacy"
		},

		// Colors
		{
			"peer-checked:text-primary": color === "primary",
			"peer-checked:text-gray-500": color === "neutral",
			"peer-checked:text-error": color === "error",
			"peer-checked:text-warning": color === "warning",
			"peer-checked:text-success": color === "success",
		},

		variant === "default" && !props.disabled && {
			"peer-checked:bg-primary-text": color === "primary",
			"peer-checked:bg-error-text": color === "error",
			"peer-checked:bg-warning-text": color === "warning",
			"peer-checked:bg-success-text": color === "success"
		},

		{
			"dark:peer-checked:bg-gray-300": variant === "legacy" && color === "neutral",
		},

		// Ripple jawn
		!props.disabled && "after:content[''] after:bg-gray-500 peer-checked:after:bg-current after:opacity-20 after:absolute after:w-12 after:h-12 after:left-1/2 after:top-1/2 after:rounded-full after:-translate-x-1/2 after:-translate-y-1/2 after:pointer-events-none after:-z-[1] after:scale-0 peer-focus:after:scale-100 group-active/checkbox:after:scale-100 duration-100 after:transition-transform after:z-[1]",

		// Checkmark
		!icon && "[&>svg]:scale-0 peer-checked:[&>svg]:scale-100 [&>svg]:transition-transform duration-100"

	];

	return (
		<div className="flex items-center gap-4 mr-auto group/checkbox font-roboto bg-inherit isolate">
			<div className="relative flex bg-inherit group/switch">
				<input
					className={ cn(track) }
					type="checkbox"
					ref={ref}
					{ ...props } />
				<label className={ cn(thumb) } htmlFor={ props.id }>
					{ icon }
				</label>
			</div>
			{ children && <label className={ cn("select-none", className) } htmlFor={ props.id }>{ children }</label> }
		</div>
	);
});