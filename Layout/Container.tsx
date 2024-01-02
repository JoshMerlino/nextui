import { HTMLAttributes } from "react";
import { cn } from "../util";

export function Container({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={ cn("max-w-7xl mx-auto w-full flex flex-col", className) } { ...props }>
			{ children }
		</div>
	);
}