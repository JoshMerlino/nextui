import { cn } from "@util/cn";
import { HTMLAttributes } from "react";

export function Container({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={ cn("max-w-7xl mx-auto w-full flex flex-col", className) } { ...props }>
			{children}
		</div>
	);
}