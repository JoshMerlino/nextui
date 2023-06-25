import { ClassValue } from "clsx";
import { HTMLAttributes } from "react";
import { IconType } from "react-icons";
import { cn } from "../util";

interface Props {

	/**
	 * Custom classnames to apply to the tooltip
	 */
	className: ClassValue;

	/**
	 * Icon to display in the toast
	 */
	icon: IconType;

	/**
	 * The color of the icon
	 * @default "primary"
	 */
	iconColor: "primary" | "neutral" | "error" | "warning" | "success";

}

export function Toast({ children, className, iconColor = "primary", icon: Icon, ...props }: HTMLAttributes<HTMLDivElement> & Partial<Props>) {

	const notification: ClassValue[] = [

		// Base styles
		"bg-gray-950 p-3 rounded-md shadow-lg flex gap-3 my-auto items-center drop-shadow-2xl shadow-black/20 w-full sm:w-min grow overflow-hidden"

	];

	const iconClass: ClassValue[] = [

		// Base styles
		"relative flex items-center justify-center w-10 h-10 rounded-full after:bg-current after:inset-0 after:content[''] after:absolute overflow-hidden after:opacity-5 before:bg-current before:inset-1 before:content[''] before:absolute before:opacity-5 before:rounded-full shrink-0 ml-1 mb-auto",

		// Color
		{
			"text-primary": iconColor === "primary",
			"text-gray-200": iconColor === "neutral",
			"text-error": iconColor === "error",
			"text-warning": iconColor === "warning",
			"text-success": iconColor === "success",
		}

	];

	return (
		<div className={cn(notification)}>

			{/* Icon */}
			{Icon && (
				<div className={cn(iconClass)}>
					<Icon className="text-xl text-inherit" />
				</div>
			)}

			{/* Content */}
			<div className="flex items-start gap-1 sm:gap-4 px-1 whitespace-nowrap [&_button]:ml-auto [&_button]:shrink-0 grow [&_p]:text-sm [&_p]:text-gray-700 [&_p]:dark:text-gray-300 [&_p]:whitespace-normal [&_p]:grow flex-col sm:items-center sm:flex-row">{children}</div>

		</div>
	);
}