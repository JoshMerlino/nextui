import { HTMLAttributes } from "react";
import { cn } from "../util";

export { CardActions } from "./Actions";
export { CardContent } from "./Content";
export { CardHeader } from "./Header";

export function Card({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn("flex flex-col gap-4 p-4 overflow-hidden text-gray-600 bg-white rounded-lg dark:bg-gray-800 dark:text-gray-400 shadow-md", className)} {...props}>{children}</div>
	);
}