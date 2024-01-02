"use client";

import { HTMLAttributes, useCallback, useEffect, useRef } from "react";

export function XYWrapper({ children, trackWindow = false, fluidity = 0, allowClip = false, ...props }: HTMLAttributes<HTMLDivElement> & Partial<{
	trackWindow: boolean;
	allowClip: boolean;
	fluidity: number;
}>) {
	const ref = useRef<HTMLDivElement>(null);

	const mousemove = useCallback(function(event: MouseEvent) {
		const element = ref.current;
		if (!element) return;
		const rect = element.getBoundingClientRect();
		const x = allowClip ? event.clientX - rect.left : Math.min(Math.max(0, event.clientX - rect.left), rect.width);
		const y = allowClip ? event.clientY - rect.top : Math.min(Math.max(0, event.clientY - rect.top), rect.height);

		if (fluidity > 0) {
			element.animate([
				{ "--x": `${ element.style.getPropertyValue("--x") }`, "--y": `${ element.style.getPropertyValue("--y") }` },
				{ "--x": `${ x }px`, "--y": `${ y }px` },
			], {
				duration: fluidity,
				easing: "ease-out",
				fill: "forwards",
			});
			
		} else {
			element.style.setProperty("--x", `${ x }px`);
			element.style.setProperty("--y", `${ y }px`);
		}
	}, [ allowClip, fluidity ]);
	
	useEffect(function() {
		const element = ref.current;
		if (!element) return;
		const target = trackWindow ? document.body : element;
		target.addEventListener("mousemove", mousemove);
		return () => target.removeEventListener("mousemove", mousemove);
	}, [ mousemove, ref, trackWindow ]);
	return <div ref={ ref } { ...props }>{ children }</div>;
}
