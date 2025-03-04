"use client";

import { createContext, HTMLAttributes, ReactNode, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "../util";

export const ScrimProvider = createContext(false);

export function DrawerScrim({ drawer, children, className, state: [ open, setOpen ], darken = 0.25, blur = 0, ...props }: {

	/**
	 * The current state of the drawer
	 * @default false
	 */
	state: [boolean, (open: boolean) => void];
	
	/**
	 * The drawer to render
	 */
	drawer: ReactNode;

} & Partial<{

	/**
	 * The amount to darken the backdrop when the drawer is open
	 * @default 0.25
	 */
	darken: number;

	/**
	 * The amount to blur the backdrop when the drawer is open
	 * @default 0
	 */
	blur: number;

}> & HTMLAttributes<HTMLElement>) {
	
	// State for touch support
	const [ touchSupported, setTouchSupported ] = useState(false);
	
	// Convert isDragging ref to a state
	const [ isDragging, setIsDragging ] = useState(false);

	// Refs for touch events
	const touchOffset = useRef(0);

	// Refs for the handle, drawer, and scrim
	const handleRef = useRef<HTMLDivElement>(null);
	const drawerRef = useRef<HTMLDivElement>(null);
	const scrimRef = useRef<HTMLDivElement>(null);
	
	// Detect touch support, this can happen at any time
	useEffect(() => setTouchSupported(typeof window !== "undefined" && "ontouchstart" in window), []);

	// Apply the transitions to all elements
	const applyTransition = useCallback(function() {

		// Ensure we have the necessary elements
		const $drawer = drawerRef.current;
		const $handle = handleRef.current;
		const $scrim = scrimRef.current;
		if (!$drawer || !$handle || !$scrim) return;

		const { width } = $drawer.getBoundingClientRect();

		// Apply scrim transitions
		$scrim.style.setProperty("--tw-backdrop-brightness", `brightness(${ open ? 1 - darken : 1 })`);
		$scrim.style.setProperty("--tw-backdrop-blur", `blur(${ open ? blur : 0 }px)`);

		// // Apply drawer transitions
		$drawer.style.transform = `translateX(${ open ? 0 : -width }px)`;

		// // Apply handle transitions
		$handle.style.transform = `translateX(${ open ? width : 0 }px)`;
		
	}, [ blur, darken, open ]);
	
	// When touch starts, record the X position, and stop all transitions
	const onTouchStart = useCallback(function(event: TouchEvent) {
		
		// Ensure we have the necessary elements
		const $drawer = drawerRef.current;
		const $handle = handleRef.current;
		const $scrim = scrimRef.current;
		if (!$drawer || !$handle || !$scrim) return;

		// Make sure we only have one touch
		if (event.touches.length > 1) return;

		// Record the touch offset
		touchOffset.current = event.touches[0].clientX - $handle.getBoundingClientRect().left;
		setIsDragging(true);
		
	}, []);
	
	// When touch ends, determine if the drawer should open or close
	const onTouchEnd = useCallback(function(event: TouchEvent) {
		
		// Ensure we have the necessary elements
		const $drawer = drawerRef.current;
		const $handle = handleRef.current;
		const $scrim = scrimRef.current;
		if (!$drawer || !$handle || !$scrim) return;

		// Make sure we only have one touch
		if (event.touches.length > 1) return;

		// Re-enable transitions
		$handle.style.transitionProperty = "transform,translate,scale,rotate";
		$drawer.style.transitionProperty = "transform,translate,scale,rotate";
		$scrim.style.transitionProperty = "opacity,backdrop-filter";

		// Determine the width, and the distance the handle has moved
		const { width } = $drawer.getBoundingClientRect();
		const distance = event.changedTouches[0].clientX - touchOffset.current;

		// Determine if the drawer should open or close
		setOpen(distance > width / 2);

		// Apply
		applyTransition();

		// Reset isDragging
		setIsDragging(false);
		
	}, [ applyTransition, setOpen ]);
	
	// Have drawer track touch events
	const onTouchMove = useCallback(function(event: TouchEvent) {
		
		// Prevent browser back/forward gestures
		event.preventDefault();
		event.stopPropagation();

		// Ensure we have the necessary elements
		const $drawer = drawerRef.current;
		const $handle = handleRef.current;
		const $scrim = scrimRef.current;
		if (!$drawer || !$handle || !$scrim) return;

		// Determine the width, and the distance the handle has moved
		const { width } = $drawer.getBoundingClientRect();
		const deltaX = Math.min(Math.max(event.touches[0].clientX - touchOffset.current, 0), width);

		// Disable transitions
		$handle.style.transitionProperty = "none";
		$drawer.style.transitionProperty = "none";
		$scrim.style.transitionProperty = "none";

		console.log("touchmove", { deltaX });

		// Apply the translations
		$scrim.style.setProperty("--tw-backdrop-brightness", `brightness(${ 1 - darken * (deltaX / width) })`);
		$scrim.style.setProperty("--tw-backdrop-blur", `blur(${ blur * (deltaX / width) }px)`);
		$drawer.style.transform = `translateX(${ -width + deltaX }px)`;
		$handle.style.transform = `translateX(${ deltaX }px)`;
		$drawer.style.opacity = deltaX > 0 ? "1" : "0";
		
	}, [ blur, darken ]);

	// Add event listeners to handle
	useEffect(function() {
		if (!handleRef.current) return;
		const $handle = handleRef.current;
		const controller = new AbortController();

		$handle.addEventListener("touchstart", onTouchStart, { signal: controller.signal });

		$handle.addEventListener("touchend", onTouchEnd, { signal: controller.signal });

		$handle.addEventListener("touchmove", onTouchMove, { signal: controller.signal });
		
		return () => controller.abort();
	}, [ onTouchEnd, onTouchMove, onTouchStart ]);
	
	// Apply transitions on changes
	useEffect(applyTransition, [ applyTransition ]);
	
	// On first render, remove hidden class from scrim
	useEffect(() => scrimRef.current?.classList.remove("hidden"), [ open ]);

	return (
		<div className="absolute inset-0 flex isolate bg-inherit overflow-hidden">

			<ScrimProvider value={ open }>
				<div
					className={ cn([
						"xl:!rounded-none absolute xl:sticky xl:shadow-md top-0 z-[60] group/drawer h-full transition-transform",
						!isDragging && !open && "-translate-x-full",
						"xl:!translate-x-0"
					]) }
					ref={ drawerRef }
					style={{
						["--tw-shadow" as keyof CSSProperties]: "4px 0 6px -1px rgb(0 0 0 / 0.1), 2px 0 4px -2px rgb(0 0 0 / 0.1)",
						["--tw-shadow-colored" as keyof CSSProperties]: "4px 0 6px -1px var(--tw-shadow-color), 2px 0 4px -2px var(--tw-shadow-color)"
					}}>
					{ drawer }
				</div>
			</ScrimProvider>

			<div
				className={ cn("h-full w-4 absolute z-10 flex items-center justify-center xl:hidden transition-transform", !touchSupported && "pointer-events-none hidden", open && "w-full") }
				onClick={ () => open && setOpen(false) }
				ref={ handleRef }
				style={{ touchAction: "none" }}>
				<div className="rounded-full grow bg-gray-500/10 h-12 m-[5px] backdrop-blur-2xl shrink-0 max-w-1.5 mr-auto" />
			</div>

			<div className={ cn("grow relative bg-inherit", className) }>{ children }</div>
			
			<div
				className={ cn("absolute inset-0 transition-[backdrop-filter] xl:hidden backdrop-blur-0", open ? "pointer-events-auto" : "pointer-events-none") }
				onClick={ () => setOpen(false) }
				ref={ scrimRef }
				{ ...props } />
			
		</div>
	);
}