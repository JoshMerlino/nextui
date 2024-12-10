"use client";

import { useConvergedRef, useEvent, useEventMap } from "nextui/hooks";
import { forwardRef, type HTMLAttributes, useCallback } from "react";

export const CursorProvider = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & Partial<{

	/**
	 * Whether to track the mouse position globally.
	 * @default false
	 */
	trackWindow: boolean;

	/**
	 * Whether to allow the mouse to clip the element.
	 * @default false
	 */
	allowClip: boolean;

	/**
	 * The fluidity of the movement.
	 * @default 0
	 */
	fluidity: number;

}>>(function XYWrapper({ children, trackWindow = false, fluidity = 0, allowClip = false, ...props }, fref) {
	const ref = useConvergedRef(fref);

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
	}, [ allowClip, fluidity, ref ]);

	useEventMap(ref, { mousemove: event => !trackWindow && mousemove(event) });
	useEvent("mousemove", event => trackWindow && mousemove(event));

	return <div ref={ ref } { ...props }>{ children }</div>;
});
