import { ClassValue } from "clsx";
import { InputHTMLAttributes } from "react";
import { MdCheck } from "react-icons/md";
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

	/**
	 * Variant of the checkbox
	 * @default "default"
	 */
	variant: "default" | "legacy";

}

export function Switch({ color = "neutral", className, variant = "default", children, ...props }: InputHTMLAttributes<HTMLInputElement> & Partial<Props>) {

	// Initialize unique ID
	props.id = props.id || Math.floor(Math.random() * 1e10).toString(36);

	// Checkbox styles
	const track: ClassValue[] = [

		// Base class
		"appearance-none peer focus:outline-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50",

		// Variant
		{
			"border-2 w-[52px] h-8 checked:border-transparent dark:checked:border-transparent bg-gray-200 border-gray-500 disabled:!bg-gray-300 dark:disabled:!bg-gray-800 dark:bg-gray-800 dark:border-gray-600": variant === "default",
			"w-[34px] h-[14px] checked:bg-opacity-50 dark:checked:bg-opacity-50 disabled:checked:!bg-opacity-50 bg-gray-300 dark:bg-gray-500": variant === "legacy"
		},

		// Colors
		{
			"checked:bg-primary dark:checked:bg-primary": color === "primary",
			"checked:bg-gray-800 checked:dark:bg-gray-200": color === "neutral",
			"checked:bg-error dark:checked:bg-error": color === "error",
			"checked:bg-warning dark:checked:bg-warning": color === "warning",
			"checked:bg-success dark:checked:bg-success": color === "success",
		},
		
	];

	// Thumb styles
	const thumb: ClassValue[] = [

		// Base class
		"aspect-square w-4 absolute inset-0 rounded-full transition-all text-transparent overflow-hidden flex items-center justify-center peer-disabled:cursor-not-allowed ",

		// Colors
		{
			"peer-checked:text-primary": color === "primary",
			"peer-checked:text-gray-800 dark:peer-checked:text-gray-200 dark:peer-checked:bg-gray-800 dark:peer-disabled:peer-checked:bg-gray-200": color === "neutral",
			"peer-checked:text-error": color === "error",
			"peer-checked:text-warning": color === "warning",
			"peer-checked:text-success": color === "success",
		},

		// Variant
		{
			"bg-gray-500 peer-disabled:opacity-50 m-2 peer-checked:m-1 peer-checked:w-6 pointer-events-none peer-checked:bg-white peer-checked:ml-6 peer-disabled:peer-checked:!text-inherit peer-disabled:text-[0px] dark:bg-gray-600": variant === "default",
			"w-5 shadow-sm shadow-black/20 bg-white -mt-[3px] peer-checked:ml-3.5 peer-checked:bg-current text-[0px] peer-disabled:bg-gray-100 dark:bg-gray-300 dark:peer-disabled:bg-gray-800": variant === "legacy"
		},

	];

	return (
		<div className="flex items-center gap-4 mr-auto group/checkbox font-roboto bg-inherit isolate">
			<div className="relative flex bg-inherit group/switch">
				<input
					className={ cn(track) }
					type="checkbox"
					{...props} />
				<label className={cn(thumb)} htmlFor={props.id}>
					<MdCheck/>
				</label>
			</div>
			{children && <label className={ cn("select-none", className) } htmlFor={ props.id }>{children}</label>}
		</div>
	);
}