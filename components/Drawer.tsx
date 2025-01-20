import { HTMLAttributes } from "react";
import { cn } from "../util";

export function Drawer({ children, className, ...props }: HTMLAttributes<HTMLElement>) {
	return (
		<aside
			className={ cn("bg-white dark:bg-gray-800 ease-in-out w-[300px] h-full z-[10] flex flex-col overflow-y-auto shrink-0 ", className) }
			{ ...props }>
			{ children }
		</aside>
	);
}