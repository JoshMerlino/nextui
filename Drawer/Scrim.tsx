"use client";

import { HTMLAttributes, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../util";

interface Props {

	/**
	 * The current state of the drawer
	 * @default false
	 */
	state: [boolean, (open: boolean) => void];
	
	/**
	 * The drawer to render
	 */
	drawer: ReactNode;

	/**
	 * The amount to darken the backdrop when the drawer is open
	 */
	darken?: number;

	/**
	 * The amount to blur the backdrop when the drawer is open
	 */
	blur?: number;

}

export function DrawerScrim({ drawer, children, className, state: [ open, setOpen ], darken = 0.25, blur = 8, ...props }: Props & HTMLAttributes<HTMLElement>) {
	
	const [ touchSupported, setTouchSupported ] = useState(false);
	
	const touchOffset = useRef(0);
	const isDragging = useRef(false);
	const ref = useRef<HTMLDivElement>(null);
	
	// Detect touch support, this can happen at any time
	useEffect(() => setTouchSupported(typeof window !== "undefined" && "ontouchstart" in window), []);

	// When touch starts, record the X position
	const onTouchStart = useCallback(function(event: TouchEvent) {
		if (event.touches.length > 1) return;
		const touch = event.touches[0];
		const target = event.target as HTMLDivElement | null;
		touchOffset.current = touch.clientX - (target?.getBoundingClientRect().left ?? 0);
		isDragging.current = true;
	}, []);

	// When touch ends, determine if the drawer should open or close
	const onTouchEnd = useCallback(function(event: TouchEvent) {
		if (event.changedTouches.length > 1) return;
		const touch = event.changedTouches[0];
		const $handle = ref.current;
		const $drawer = $handle?.parentElement?.querySelector(".group\\/drawer") as HTMLDivElement | null;
		const $scrim = $handle?.parentElement?.querySelector(".group\\/scrim") as HTMLDivElement | null;
		if (!$drawer || !$handle || !$scrim) return;

		// Determine the width, and the distance the handle has moved
		const width = $drawer.getBoundingClientRect().width;
		const distance = touch.clientX - touchOffset.current;

		$handle.style.transform = `translateX(${ open ? width : 0 }px)`;
		$handle.style.transition = "transform 200ms ease-in-out";
		
		$drawer.style.transition = "transform 200ms ease-in-out";
		$drawer.style.setProperty("--tw-translate-x", open ? "0" : "-100%");
		if (!open) $drawer.addEventListener("transitionend", () => $drawer.style.opacity = "0", { once: true });
		
		$scrim.style.transition = "opacity 200ms ease-in-out, backdrop-filter 200ms ease-in-out";
		$scrim.style.setProperty("--tw-backdrop-brightness", `brightness(${ open ? 1 - darken : 1 })`);
		$scrim.style.setProperty("--tw-backdrop-blur", `blur(${ open ? blur : 0 }px)`);

		// Determine if the drawer should open or close
		if (distance > width / 2) setOpen(true);
		else if (distance < -width / 2) setOpen(false);

		// Reset isDragging
		isDragging.current = false;

	}, [ blur, darken, open, setOpen ]);
	
	// Have drawer track touch events
	const onTouchMove = useCallback(function(event: TouchEvent) {
		event.preventDefault();
		event.stopPropagation();
		const $handle = ref.current;
		const $drawer = $handle?.parentElement?.querySelector(".group\\/drawer") as HTMLDivElement | null;
		const $scrim = $handle?.parentElement?.querySelector(".group\\/scrim") as HTMLDivElement | null;
		if (!$drawer || !$handle || !$scrim) return;

		// Determine the width, and the distance the handle has moved
		const { width } = $drawer.getBoundingClientRect();
		const deltaX = Math.min(Math.max(event.touches[0].clientX - touchOffset.current, 0), width);
		const percentage = deltaX / width;
		
		$handle.style.transition = "none";
		$handle.style.transform = `translateX(${ deltaX }px)`;
		
		$drawer.style.transition = "none";
		$drawer.style.opacity = deltaX > 0 ? "1" : "0";
		$drawer.style.setProperty("--tw-translate-x", `${ -width + deltaX }px`);
		
		$scrim.style.transition = "none";
		$scrim.style.setProperty("--tw-backdrop-brightness", `brightness(${ 1 - darken * percentage })`);
		$scrim.style.setProperty("--tw-backdrop-blur", `blur(${ blur * percentage }px)`);
		
		setOpen(deltaX > width / 2);
	}, [ blur, darken, setOpen ]);
	
	// Add event listeners to handle
	useEffect(function() {
		const $handle = ref.current;
		if (!$handle) return;
		$handle.addEventListener("touchstart", onTouchStart);
		$handle.addEventListener("touchend", onTouchEnd);
		$handle.addEventListener("touchmove", onTouchMove);
		return function() {
			$handle.removeEventListener("touchstart", onTouchStart);
			$handle.removeEventListener("touchend", onTouchEnd);
			$handle.removeEventListener("touchmove", onTouchMove);
		};
	}, [ onTouchEnd, onTouchMove, onTouchStart ]);
	
	// Sync handle with drawer state
	useEffect(function() {
		const $handle = ref.current;
		const $drawer = $handle?.parentElement?.querySelector(".group\\/drawer") as HTMLDivElement | null;
		const $scrim = $handle?.parentElement?.querySelector(".group\\/scrim") as HTMLDivElement | null;
		if (!$drawer || !$handle || !$scrim) return;

		$drawer.style.transition = "transform 200ms ease-in-out";
		$drawer.style.setProperty("--tw-translate-x", open ? "0" : "-100%");
		if (open) $drawer.style.opacity = "1";
		else $drawer.addEventListener("transitionend", () => $drawer.style.opacity = "0", { once: true });

		// Set scrim properties if not dragging
		if (!isDragging.current) {
			$scrim.style.setProperty("--tw-backdrop-brightness", `brightness(${ open ? 1 - darken : 1 })`);
			$scrim.style.setProperty("--tw-backdrop-blur", `blur(${ open ? blur : 0 }px)`);
		}

		// Move handle
		$handle.style.transition = "transform 200ms ease-in-out";
		$handle.style.transform = open ? `translateX(${ $drawer.getBoundingClientRect().width }px)` : "translateX(0)";
		
	}, [ blur, darken, open ]);
	
	// On first render, remove hidden class from scrim
	useEffect(() => ref.current?.parentElement?.querySelector(".group\\/scrim")?.classList.remove("hidden"), [ open ]);

	return (
		<div className="absolute inset-0 flex isolate bg-inherit overflow-hidden">
			{drawer}
			<div
				className={ cn("h-full w-4 absolute z-10 flex items-center justify-center xl:hidden", !touchSupported && "pointer-events-none hidden", open && "w-full") }
				onClick={ () => open && setOpen(false) }
				ref={ ref }
				style={{ touchAction: "none" }}>
				<div className="rounded-full grow bg-gray-500/10 h-12 m-[5px] backdrop-blur-2xl shrink-0 max-w-1.5 mr-auto" />
			</div>
			<div className={ cn("grow relative bg-inherit", className) }>{children}</div>
			<div className={ cn("absolute inset-0 transition-[backdrop-filter] xl:hidden group/scrim backdrop-blur-0", open ? "pointer-events-auto" : "pointer-events-none") } onClick={ () => setOpen(false) } { ...props } />
		</div>
	);
}