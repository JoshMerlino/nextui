import { cn } from "@util/cn";
import { HTMLAttributes } from "react";
import "./index.css";

export default function Spinner({ className }: HTMLAttributes<SVGElement>): JSX.Element {
	return (
		<svg
			className={ cn("spinner max-w-[48px] stroke-gray-800 dark:stroke-gray-200", className) }
			viewBox="0 0 50 50">
			<circle
				className={ cn("path", className?.split(" ").filter(a => a.includes("stroke")).join(" ")) }
				cx="25"
				cy="25"
				fill="none"
				r="20"
				shapeRendering="geometricPrecision"
				strokeWidth="5" />
		</svg>
	);
}