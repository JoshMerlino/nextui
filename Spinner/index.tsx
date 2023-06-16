import { cn } from "@util/cn";
import { ClassValue } from "clsx";
import "./index.css";

interface Props {

	/**
	 * Additional class names to apply to the spinner.
	 */
	className?: ClassValue;

	/**
	 * Color of the button
	 * @default "neutral"
	 */
	color: "primary" | "neutral" | "error" | "warning" | "success";
	
}

export function Spinner({ className, color = "neutral" }: Props): JSX.Element {

	// Record of classnames to apply based on props
	const classes = cn({
		"stroke-gray-800 dark:stroke-gray-200": color === "neutral",
		"stroke-primary": color === "primary",
		"stroke-error": color === "error",
		"stroke-warning": color === "warning",
		"stroke-success": color === "success",
	});

	return (
		<svg
			className={ cn("spinner max-w-[48px] h-full", className) }
			viewBox="0 0 50 50">
			<circle
				className={ cn("path", classes) }
				cx="25"
				cy="25"
				fill="none"
				r="20"
				shapeRendering="geometricPrecision"
				strokeWidth="5" />
		</svg>
	);
}