"use client";

import { PropsWithChildren, useEffect, useRef } from "react";

export function Dismissible({ children, ...props }: PropsWithChildren) {

	// Create a ref
	const ref = useRef<HTMLDivElement>(null);

	// Add event listeners
	useEffect(function() {
		if (!ref.current) return;
		const element = ref.current;

		let held = false;
		let motion = 0;

		const mousedown = () => {
			held = true;
			element.classList.remove("transition-[transform,opacity]");
		};

		function mousemove(event: MouseEvent) {

			// If the mouse is out of the window in any direction, return
			if (event.clientX < 0 || event.clientY < 0 || event.clientX > window.innerWidth || event.clientY > window.innerHeight) return mouseup();

			// If the mouse is not held, return
			if (!held) return;

			// Modify the motion
			motion += event.movementX;

			// Translate the element & adjust the opacity
			element.style.transform = `translateX(${ motion }px)`;
			element.style.opacity = `${ 1 - Math.abs(motion) / (window.innerWidth / 2) }`;

		}

		function mouseup() {
			held = false;

			// Get the motion
			if (Math.abs(motion) > Math.min(window.innerWidth / 2, 300)) {

				// Set starting height
				const parent = element.parentElement;
				if (!parent) return;

				parent.style.height = `${ parent.clientHeight }px`;
				parent.classList.add("transition-[height]");
				
				// Fade out element
				element.classList.add("transition-opacity");
				element.style.opacity = "0";

				// Wait for the transition to end
				element.addEventListener("transitionend", function() {
					element.remove();
					parent.style.height = "0";
				}, { once: true });

			} else {

				element.classList.add("transition-[transform,opacity]");

				// Reset the element
				element.style.transform = "translateX(0)";
				element.style.opacity = "1";
				motion = 0;

				// Wait for the transition to end
				element.addEventListener("transitionend", () => element.classList.remove("transition-[transform,opacity]"), { once: true });

			}

		}

		// Add event listeners
		element.addEventListener("mousedown", mousedown);
		document.addEventListener("mouseup", mouseup);
		document.addEventListener("mouseleave", mouseup);
		document.addEventListener("mousemove", mousemove);
		
		// Cleanup
		return () => {
			element.removeEventListener("mousedown", mousedown);
			document.removeEventListener("mouseup", mouseup);
			document.removeEventListener("mouseleave", mouseup);
			document.removeEventListener("mousemove", mousemove);
		};

	}, []);

	return (
		<div className="relative [&_*]:select-none">
			<div ref={ref}>{children}</div>
		</div>
	);
}