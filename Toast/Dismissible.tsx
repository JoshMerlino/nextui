"use client";

import { PropsWithChildren, useEffect, useRef } from "react";

export interface DismissibleOptions {

	/*
	 * The duration of the toast
	 */
	duration: number;

	/*
	 * The callback to call when the toast is dismissed
	 */
	onDismiss(): void;

}

export function Dismissible({ children, duration, onDismiss }: PropsWithChildren<Partial<DismissibleOptions>>) {

	// Create a ref
	const ref = useRef<HTMLDivElement>(null);

	// Add event listeners
	useEffect(function() {
		if (!ref.current) return;
		const element = ref.current;

		// Store last touch
		let lastTouch: Touch | null = null;
		const parent = element.parentElement as HTMLDivElement;

		let held = false;
		let motion = 0;
		const MGK = Math.min(window.innerWidth / 2, 200);

		// Set default height
		parent.style.height = `${ element.getBoundingClientRect().height * 4 / 3 + 4 }px`;

		// On transition end
		parent.addEventListener("transitionend", () => {
			parent.classList.remove("opacity-0");
			parent.classList.remove("scale-75");
			parent.classList.add("opacity-100");
			parent.classList.add("scale-100");
		}, { once: true });

		let reset: NodeJS.Timer;
		let timeout = duration ? setTimeout(() => dismiss(), duration) : undefined;

		// Reset timeout
		function resetTimeout() {
			if (timeout) {
				clearTimeout(timeout);
				timeout = setTimeout(() => dismiss(), duration);
			}
		}

		// Everytime the pointer is moved, or touch is moved
		function onPointerMove(event: PointerEvent | TouchEvent) {

			// Make sure the mouse is held down
			if (!held) return;

			// Prevent default
			event.preventDefault();
			resetTimeout();

			// Get motion X
			const derivative = !("changedTouches" in event) ? event.movementX : lastTouch ? event.changedTouches[0].clientX - lastTouch.clientX : 0;
			motion += derivative / window.devicePixelRatio;

			lastTouch = "changedTouches" in event ? event.changedTouches[0] : null;

			// Remove translation transition
			element.classList.remove("transition-[transform,opacity]");

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
			element.classList.add("transition-[transform,opacity]");

			// Reset motion
			motion = 0;
			element.style.opacity = "1";
			element.style.transform = `translateX(${ motion }px)`;

		}

		async function dismiss() {

			// If opacity is full
			if (element.style.opacity === "1" || element.style.opacity === "") {
				element.classList.add("transition-[height,opacity]");
				parent.classList.remove("opacity-100");
				parent.classList.remove("scale-100");
				parent.classList.remove("origin-top");
				parent.classList.add("opacity-0");
				parent.classList.add("scale-75");

				// Await transition end
				await new Promise(resolve => parent.addEventListener("transitionend", resolve, { once: true }));
				
			}

			// Get the height of the element
			const { height } = parent.getBoundingClientRect();
			parent.style.height = `${ height }px`;

			// Set the height to 0
			requestAnimationFrame(() => {
				parent.style.height = "0px";
				parent.addEventListener("transitionend", () => {

					if (onDismiss) onDismiss();
					
					parent.remove();

				}, { once: true });
			});

		}

		const onPointerEnter = () => reset = setInterval(resetTimeout);
		const onPointerLeave = () => clearInterval(reset);
		const onPointerDown = () => held = true;

		// Bind events
		document.addEventListener("pointermove", onPointerMove);
		document.addEventListener("touchmove", onPointerMove);
		element.addEventListener("pointerdown", onPointerDown);
		element.addEventListener("pointerenter", onPointerEnter);
		element.addEventListener("pointerleave", onPointerLeave);
		element.addEventListener("touchstart", onPointerDown);
		document.addEventListener("pointerup", onPointerUp);
		document.addEventListener("touchend", onPointerUp);

		// Cleanup
		return function() {
			document.removeEventListener("pointermove", onPointerMove);
			document.removeEventListener("touchmove", onPointerMove);
			element.removeEventListener("pointerdown", onPointerDown);
			element.removeEventListener("touchstart", onPointerDown);
			element.removeEventListener("pointerenter", onPointerEnter);
			element.removeEventListener("pointerleave", onPointerLeave);
			document.removeEventListener("pointerup", onPointerUp);
			document.removeEventListener("touchend", onPointerUp);
		};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ duration ]);

	return (
		<div className="relative [&_*]:select-none transition-[height,opacity,transform] flex items-center opacity-0 scale-75" style={{ height: 0 }}>
			<div className="grow" ref={ ref }>{children}</div>
		</div>
	);
}