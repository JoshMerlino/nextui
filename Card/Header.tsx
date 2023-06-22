import { HTMLAttributes } from "react";
import { cn } from "../util";

export function CardHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return (
		<h1 className={cn("text-2xl font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap pt-2 px-2", className)} {...props}>{children}</h1>
	);
}