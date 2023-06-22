import { HTMLAttributes } from "react";
import { cn } from "../util";

export function CardContent({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {

	return (
		<div className={cn("flex flex-col px-2 gap-2 pb-2", className)} {...props}>{children}</div>
	);
}