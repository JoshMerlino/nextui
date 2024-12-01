"use client";

import { ClassValue } from "clsx";
import { useCallback, useEffect, useRef } from "react";
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
	className?: string | ClassValue;

	/**
	 * Weather or not the ripple is disabled
	 */
	disabled: boolean;
	
}

export function Ripple({ emitFromCenter, className, disabled }: Partial<Props>) {

	// The duration of the ripple animation
	const DURATION = 500;

	// Create a ref to the ripple element
	const ref = useRef<HTMLDivElement>(null);

	const clear = useCallback(function() {
		const ripple = ref.current;
		if (!ripple) return;
			
		ripple.querySelectorAll<HTMLDivElement>(".ripple")
			.forEach(ripple => {
				ripple.style.transition = `transform ${ DURATION }ms cubic-bezier(0,.5,0,.75), opacity ${ DURATION / 2 }ms ease-out`;
				ripple.style.opacity = "0";
				setTimeout(() => ripple.remove(), DURATION * 2);
			});
	}, [ ref ]);

	// Creates a ripple at the given coordinates
	const createRipple = useCallback(function(event: MouseEvent) {
		const ripple = ref.current;
		if (!ripple) return;

		// Fade out any existing ripples
		clear();

		// Get the element size and mouse position
		const { width, height, top, left } = ripple.getBoundingClientRect();
		const { clientX, clientY } = event;

		// Get offset
		const offsetX = emitFromCenter ? ripple.clientWidth / 2 : clientX - left;
		const offsetY = emitFromCenter ? ripple.clientHeight / 2 : clientY - top;
			
		// Get the distance from the center of the element
		const distance = Math.sqrt(Math.pow(offsetX - width / 2, 2) + Math.pow(offsetY - height / 2, 2));
		const size = (Math.max(width, height) + distance * 1.875) * 1.1;

		// Add the ripple to the DOM
		const rippleElement = document.createElement("div");
		rippleElement.className = cn("absolute bg-current rounded-full aspect-square ripple", className);
		rippleElement.style.transition = `transform ${ DURATION }ms cubic-bezier(0,.5,0,.75), opacity ${ DURATION / 2 }ms ease-out`;
		rippleElement.style.width = `${ size }px`;
		rippleElement.style.top = `${ offsetY - size / 2 }px`;
		rippleElement.style.left = `${ offsetX - size / 2 }px`;
		rippleElement.style.opacity = ".5";
		ripple.appendChild(rippleElement);
			
		// Set initial scale and opacity
		rippleElement.style.transform = "scale(0)";
			
		// Animate the ripple
		requestAnimationFrame(function() {
			rippleElement.style.opacity = "1";
			requestAnimationFrame(function() {
					
				rippleElement.style.transition = `transform ${ DURATION }ms cubic-bezier(0,.5,0,.75), opacity ${ DURATION * 2 }ms ease-out`;
				rippleElement.style.transform = "scale(1)";

				document.body.addEventListener("mouseup", function() {
					rippleElement.style.opacity = "0";
					rippleElement.addEventListener("transitionend", () => rippleElement.addEventListener("transitionend", () => rippleElement.remove(), { once: true }), { once: true });
				}, { once: true });
					
			});

		});
			
	}, [ className, clear, emitFromCenter ]);

	// Add event listeners
	useEffect(function() {
		
		const ripple = ref.current;
		if (!ripple) return;

		// Add event listeners
		ripple.addEventListener("mousedown", createRipple);
		ripple.addEventListener("mouseleave", clear);

		// Cleanup on unmount
		return () => {
			ripple?.removeEventListener("mousedown", createRipple);
			ripple?.removeEventListener("mouseleave", clear);
		};

	}, [ className, clear, createRipple, emitFromCenter, ref ]);

	if (disabled) return null;

	return <div
		className="absolute inset-0 opacity-20"
		draggable="false"
		ref={ ref } />;
}