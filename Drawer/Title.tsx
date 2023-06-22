import { HTMLAttributes } from "react";
import { cn } from "../util";

export function DrawerTitle(props: HTMLAttributes<HTMLParagraphElement>): JSX.Element {
	return (
		<p {...props} className={cn("text-sm font-medium leading-[20px] tracking-wide px-4 text-inherit text-gray-800 dark:text-gray-300 h-8 flex items-end", props.className)}>{ props.children }</p>
	);
}