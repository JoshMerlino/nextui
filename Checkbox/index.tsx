import { cn } from "@util/cn";
import { ClassValue } from "clsx";
import { InputHTMLAttributes } from "react";
import { MdCheck, MdRemove } from "react-icons/md";

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
		"appearance-none border-2 border-gray-500 w-5 aspect-square rounded checked:border-[10px] transition-[border] duration-75 focus:outline-0 peer",

		// Color
		{
			"checked:!border-primary checked:after:bg-primary/10": color === "primary",
			"checked:!border-neutral checked:after:bg-gray/10": color === "neutral",
			"checked:!border-error checked:after:bg-error/10": color === "error",
			"checked:!border-warning checked:after:bg-warning/10": color === "warning",
			"checked:!border-success checked:after:bg-success/10": color === "success",
		},

		// Ripple jawn
		"after:content[''] after:bg-gray-500/10 after:absolute after:w-12 after:h-12 after:left-1/2 after:top-1/2 after:rounded-full after:-translate-x-1/2 after:-translate-y-1/2 after:pointer-events-none after:-z-[1] after:scale-0 focus:after:scale-100 group-active/checkbox:after:scale-100 duration-100 after:transition-transform active:border-gray-600 active:dark:border-gray-500 after:z-10",

		className,

	];

	return (
		<div className="flex items-center gap-4 mr-auto group/checkbox font-roboto">
			<div className="relative flex">
				<input
					className={ cn(checkbox) }
					type="checkbox"
					{ ...props } />
				<div className="m-0.5 text-white scale-0 peer-checked:scale-125 absolute transition-transform pointer-events-none">
					{ props.indeterminate ? <MdRemove /> : <MdCheck /> }
				</div>
			</div>
			{children && <label className={ cn("select-none", className) } htmlFor={ props.id }>{children}</label>}
		</div>
	);
}