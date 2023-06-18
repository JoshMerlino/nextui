import { HTMLAttributes, ReactNode } from "react";
import { cn } from "../util";

interface Props {

	/**
	 * The current state of the drawer
	 * @default false
	 */
	state: [boolean, (open: boolean) => void];
	
	/**
	 * The drawer to render
	 */
	drawer: ReactNode;

}

export function DrawerScrim({ drawer, children, className, state: [ open, setOpen ], ...props }: Props & HTMLAttributes<HTMLElement>): JSX.Element {
	return (
		<div className="absolute inset-0 flex isolate bg-inherit">
			<div>{drawer}</div>
			<div className={ cn("grow relative bg-inherit", className) }>{children}</div>
			<div className={ cn("absolute inset-0 bg-black/25 backdrop-blur-xl transition-[opacity,backdrop-filter] xl:hidden", open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0") } onClick={ () => setOpen(false) } { ...props } />
		</div>
	);
}