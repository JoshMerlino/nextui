import { ClassValue } from "clsx";
import { cn } from "../util";
import "./index.css";

interface Props {

	/**
	 * Additional class names to apply to the progress bar.
	 */
	className?: ClassValue;

	/**
	 * Value as a percentage (0-1)
	 * @default 0
	 * @example 0.5
	 */
	value?: number;
	
}

export function Progress({ className, ...props }: Props): JSX.Element {

	// Record of classnames to apply based on props
	const classes = cn("pure-material-progress-linear", className);

	return <progress className={ classes } { ...props } />;
	
}