"use client";

import { ClassValue } from "clsx";
import { useEffect, useRef } from "react";
import { cn } from "../util";

interface Props {

	/**
	 * Weather or not to emit the ripple from the center of the element
	 * @default false
	 */
	emitFromCenter: boolean;

	/**
	 * Custom class overrides
	 */
	className?: ClassValue;
}

export function Ripple({ emitFromCenter, className }: Partial<Props>): JSX.Element {

	// The duration of the ripple animation
	const DURATION = 500;

	// Create a ref to the ripple element
	const ref = useRef<HTMLDivElement>(null);

	// Add event listeners
	useEffect(function() {
		if (!ref.current) return;

		function clear() {
			if (!ref.current) return;
			ref.current.querySelectorAll<HTMLDivElement>(".ripple")
				.forEach(ripple => {
					ripple.style.transition = `transform ${ DURATION }ms cubic-bezier(0,.5,0,.75), opacity ${ DURATION / 2 }ms ease-out`;
					ripple.style.opacity = "0";
					setTimeout(() => ripple.remove(), DURATION * 2);
				});
		}

		/**
		 * Creates a ripple at the given coordinates
		 * @param event The event that triggered the ripple
		 */
		function createRipple(event: MouseEvent) {
			if (!ref.current) return;

			// Fade out any existing ripples
			clear();

			// Get the element size and mouse position
			const { width, height, top, left } = ref.current.getBoundingClientRect();
			const { clientX, clientY } = event;

			// Get offset
			const offsetX = emitFromCenter ? width / 2 : clientX - left;
			const offsetY = emitFromCenter ? height / 2 : clientY - top;
			
			// Get the distance from the center of the element
			const distance = Math.sqrt(Math.pow(offsetX - width / 2, 2) + Math.pow(offsetY - height / 2, 2));
			const size = (Math.max(width, height) + distance * 1.875) * 1.1;

			// Add the ripple to the DOM
			const ripple = document.createElement("div");
			ripple.className = cn("absolute bg-white rounded-full aspect-square ripple", className);
			ripple.style.transition = `transform ${ DURATION }ms cubic-bezier(0,.5,0,.75), opacity ${ DURATION / 2 }ms ease-out`;
			ripple.style.width = `${ size }px`;
			ripple.style.top = `${ offsetY - size / 2 }px`;
			ripple.style.left = `${ offsetX - size / 2 }px`;
			ripple.style.opacity = ".5";
			ref.current.appendChild(ripple);
			
			// Set initial scale and opacity
			ripple.style.transform = "scale(0)";
			
			// Animate the ripple
			requestAnimationFrame(function() {
				ripple.style.opacity = "1";
				requestAnimationFrame(function() {
					
					ripple.style.transition = `transform ${ DURATION }ms cubic-bezier(0,.5,0,.75), opacity ${ DURATION * 2 }ms ease-out`;
					ripple.style.transform = "scale(1)";

					document.body.addEventListener("mouseup", function() {
						ripple.style.opacity = "0";
						ripple.addEventListener("transitionend", () => ripple.addEventListener("transitionend", () => ripple.remove(), { once: true }), { once: true });
					}, { once: true });
					
				});

			});
			
		}

		// Add event listeners
		ref.current.addEventListener("mousedown", createRipple);
		ref.current.addEventListener("mouseleave", clear);

		// Cleanup on unmount
		return () => {
			ref.current?.removeEventListener("mousedown", createRipple);
			ref.current?.removeEventListener("mouseleave", clear);
		};

	}, [ className, emitFromCenter, ref ]);

	return <div className={ cn("absolute inset-0 z-50 opacity-30") } ref={ ref } />;
}