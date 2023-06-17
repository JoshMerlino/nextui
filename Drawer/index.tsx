import { cn } from "@util/cn";
import { ClassValue } from "clsx";
import { HTMLAttributes } from "react";
import { IconType } from "react-icons";
import "./index.css";
export { DrawerItem } from "./Item";
export { DrawerScrim } from "./Scrim";

interface Props {

	/**
	 * The current state of the drawer
	 * @default false
	 */
	state: [boolean, (open: boolean) => void];

}

export function Drawer({ children, className, state: [ open ], ...props }: Props & HTMLAttributes<HTMLElement>): JSX.Element {
	
	// Drawer classes
	const classes: ClassValue[] = [

		// Base class
		"bg-white dark:bg-gray-800 ease-in-out w-[300px] h-full z-[10] shadow-md transition-[opacity] flex flex-col py-4 rounded-r-2xl overflow-y-auto shrink-0 group/drawer",
		
		// Custom class
		"xl:!rounded-none absolute xl:sticky top-0 z-[60] transition-[transform,opacity] xl:opacity-100 xl:translate-x-0", open ? "opacity-100 -translate-x-0" : "opacity-0 -translate-x-[300px]",

		// Custom class
		className

	];

	return (
		<aside className={cn(classes)} {...props}>
			<ul>
				{children}
			</ul>
		</aside>
	);
}