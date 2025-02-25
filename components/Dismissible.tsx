"use client";

import { PropsWithChildren, useEffect, useRef } from "react";

export interface DismissibleOptions {

	/*
	 * The callback to call when the toast is dismissed
	 */
	onDismiss(): void;

}

export function Dismissible({ children, onDismiss }: PropsWithChildren<Partial<DismissibleOptions>>) {

	// Create a ref
	const ref = useRef<HTMLDivElement>(null);

	// Add event listeners
	useEffect(function() {
		if (!ref.current) return;
		const element = ref.current;
        
		const controller = new AbortController();

		// Store last touch
		let lastTouch: Touch | null = null;
		const parent = element.parentElement as HTMLDivElement;

		let held = false;
		let motion = 0;
		const MGK = Math.min(window.innerWidth / 2, 200);

		// Set default height
		parent.style.height = `${ element.getBoundingClientRect().height }px`;

		// On transition end
		parent.addEventListener("transitionend", () => {
			parent.classList.remove("opacity-0");
			parent.classList.remove("scale-75");
			parent.classList.add("opacity-100");
			parent.classList.add("scale-100");
		}, { once: true });

		// Everytime the pointer is moved, or touch is moved
		function onPointerMove(event: PointerEvent | TouchEvent) {

			// Make sure the mouse is held down
			if (!held) return;

			// Prevent default
			event.preventDefault();

			// Get motion X
			motion += !("changedTouches" in event) ? event.movementX : lastTouch ? event.changedTouches[0].clientX - lastTouch.clientX : 0;

			lastTouch = "changedTouches" in event ? event.changedTouches[0] : null;

			// Remove translation transition
			element.classList.remove("transition-all");

			// Apply translation and opacity
			element.style.transform = `translateX(${ motion }px)`;
			element.style.opacity = `${ 1 - Math.abs(motion / MGK) }`;

		}

		function onPointerUp() {
			held = false;

			// If the motion is enough, dismiss the element
			if (Math.abs(motion) > MGK) {
				dismiss();
				return;
			}

			// Spring back to original position
			element.classList.add("transition-all");

			// Reset motion
			motion = 0;
			element.style.opacity = "1";
			element.style.transform = `translateX(${ motion }px)`;

		}

		async function dismiss() {
			if (element.style.opacity !== "0") {
				element.classList.add("transition-all");
				parent.classList.add("opacity-0");
				await new Promise(resolve => parent.addEventListener("transitionend", resolve, { once: true }));
			}
			onDismiss?.();
		}

		const onPointerDown = () => held = true;

		// Bind events
		document.addEventListener("pointermove", onPointerMove, { signal: controller.signal });
		document.addEventListener("touchmove", onPointerMove, { signal: controller.signal });
		element.addEventListener("pointerdown", onPointerDown, { signal: controller.signal });
		element.addEventListener("touchstart", onPointerDown, { signal: controller.signal });
		document.addEventListener("pointerup", onPointerUp, { signal: controller.signal });
		document.addEventListener("touchend", onPointerUp, { signal: controller.signal });

		// Cleanup
		return () => controller.abort();
        
	}, [ children ]);

	return (
		<div ref={ ref }>{ children }</div>
	);
}