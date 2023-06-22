import { HTMLAttributes } from "react";
import { cn } from "../util";

export function CardActions({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {

	return (
		<div className={cn("flex items-center justify-end gap-4 px-4 pt-4 mt-2 -mx-4 border-t border-gray-200 dark:border-gray-700/50", className)} {...props}>{children}</div>
	);
}