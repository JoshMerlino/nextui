"use client";

import { HTMLAttributes, useEffect, useRef } from "react";
import { cn } from ".";

export function Parallax({ children, className, htmlFor, scale = 1 / 2, blur = false, ...props }: HTMLAttributes<HTMLDivElement> & Partial<{ htmlFor: string, scale: number, blur: boolean }>) {

	const ref = useRef<HTMLDivElement>(null);

	// Observe scroll position
	useEffect(function() {
		const $for = (htmlFor ? document.getElementById(htmlFor) : document.body) as HTMLElement;
		let mounted = true;

		(function frame() {
			if (!mounted) return;
			requestAnimationFrame(frame);

			if (!$for || !ref.current) return;
			const $ref = ref.current;
			
			$ref.style.transform = `translate3d(0, ${ $for.scrollTop * scale }px, 0) ${ blur ? `scale3d(${ Array(3).fill(1 + $for.scrollTop / 2500).join(", ") })` : "" }`;
			if (blur) $ref.style.filter = `blur(${ $for.scrollTop / 100 }px)`;

		}());

		return () => {
			mounted = false;
		};
	}, [ htmlFor, scale, blur ]);

	return (
		<div className={ cn("overflow-hidden flex items-center", className) } { ...props }>
			<div className="transform-gpu" ref={ ref }>
				{children}
			</div>
		</div>
	);
}