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

}

export function DrawerScrim({ drawer, children, className, state: [ open, setOpen ], ...props }: Props & HTMLAttributes<HTMLElement>) {
	
	const ref = useRef<HTMLDivElement>(null);
	const [ touchSupported, setTouchSupported ] = useState(false);
	const down = useRef(0);
	
	// Detect touch support, this can happen at any time
	useEffect(() => setTouchSupported(typeof window !== "undefined" && "ontouchstart" in window), []);

	// When touch starts, record the X position
	const onTouchStart = useCallback(function(event: TouchEvent) {
		if (event.touches.length > 1) return;
		const touch = event.touches[0];
		const target = event.target as HTMLDivElement | null;
		down.current = touch.clientX - (target?.getBoundingClientRect().left ?? 0);
	}, []);

	// When touch ends, determine if the drawer should open or close
	const onTouchEnd = useCallback(function(event: TouchEvent) {
		if (event.changedTouches.length > 1) return;
		const touch = event.changedTouches[0];
		const $handle = ref.current;
		const $drawer = $handle?.parentElement?.querySelector(".group\\/drawer") as HTMLDivElement | null;
		const $scrim = $handle?.parentElement?.querySelector(".group\\/scrim") as HTMLDivElement | null;
		if (!$drawer || !$handle || !$scrim) return;
		const width = $drawer.getBoundingClientRect().width;
		const distance = touch.clientX - down.current;
		// eslint-disable-next-line react-hooks/exhaustive-deps
		if (distance > width / 2) open = true;
		else if (distance < -width / 2) open = false;
		setOpen(open);

		// Reset handle position
		$handle.style.transform = open ? `translateX(${ width }px)` : "translateX(0)";
		$handle.style.transition = "transform 200ms ease-in-out";
		$drawer.style.transition = "opacity 200ms ease-in-out, transform 200ms ease-in-out";
		$drawer.style.setProperty("--tw-translate-x", open ? "0" : "-100%");
		$drawer.style.setProperty("opacity", open ? "1" : "0");

		// Reset scrim
		$scrim.style.transition = "opacity 200ms ease-in-out, backdrop-filter 200ms ease-in-out";
		$scrim.style.setProperty("--tw-backdrop-blur", open ? "blur(24px)" : "blur(0)");
		$scrim.style.opacity = open ? "1" : "0";

	}, [ open, setOpen ]);
	
	// Have drawer track touch events
	const onTouchMove = useCallback(function(event: TouchEvent) {
		
		// Prevent navigation
		event.preventDefault();
		event.stopPropagation();

		const $handle = ref.current;
		const $drawer = $handle?.parentElement?.querySelector(".group\\/drawer") as HTMLDivElement | null;
		const $scrim = $handle?.parentElement?.querySelector(".group\\/scrim") as HTMLDivElement | null;
		if (!$drawer || !$handle || !$scrim) return;
		
		const { width } = $drawer.getBoundingClientRect();
		const deltaX = Math.min(Math.max(event.touches[0].clientX - down.current, 0), width);
		$handle.style.transform = `translateX(${ deltaX }px)`;
		
		const percentage = deltaX / width;

		// Disable transition
		$drawer.style.transition = "none";
		$handle.style.transition = "none";

		// Translate drawer by modifying tw variable
		$drawer.style.setProperty("--tw-translate-x", `${ -width + deltaX }px`);
		$drawer.style.setProperty("opacity", `${ percentage }`);
		
		// Preemptively set state as it happens
		setOpen(deltaX > width / 2);

		// Disable scrim transition
		$scrim.style.transition = "none";

		// Sync blur and opacity
		$scrim.style.setProperty("--tw-backdrop-blur", `blur(${ 24 * percentage }px)`);
		$scrim.style.opacity = `${ Math.min(percentage * 5, 1) }`;

	}, [ setOpen ]);

	// Sync handle with drawer state
	useEffect(function() {
		const $handle = ref.current;
		const $drawer = $handle?.parentElement?.querySelector(".group\\/drawer") as HTMLDivElement | null;
		const $scrim = $handle?.parentElement?.querySelector(".group\\/scrim") as HTMLDivElement | null;
		if (!$drawer || !$handle || !$scrim) return;
		$handle.style.transform = open ? `translateX(${ $drawer.getBoundingClientRect().width }px)` : "translateX(0)";
		$drawer.style.transition = "opacity 200ms ease-in-out, transform 200ms ease-in-out";
		$drawer.style.setProperty("--tw-translate-x", open ? "0" : "-100%");
		$drawer.style.setProperty("opacity", open ? "1" : "0");

		// Sync blur and opacity
		$scrim.style.setProperty("--tw-backdrop-blur", open ? "blur(24px)" : "blur(0)");
		$scrim.style.opacity = open ? "1" : "0";

	}, [ open ]);
	
	useEffect(function() {
		const $handle = ref.current;
		const $drawer = ref.current?.parentElement?.querySelector(".group\\/drawer");
		if (!$handle || !$drawer) return;

		// Add event listeners
		$handle.addEventListener("touchstart", onTouchStart);
		$handle.addEventListener("touchend", onTouchEnd);
		$handle.addEventListener("touchmove", onTouchMove);

		// Remove event listeners
		return function() {
			$handle.removeEventListener("touchstart", onTouchStart);
			$handle.removeEventListener("touchend", onTouchEnd);
			$handle.removeEventListener("touchmove", onTouchMove);
		};

	}, [ onTouchEnd, onTouchMove, onTouchStart ]);

	return (
		<div className="absolute inset-0 flex isolate bg-inherit">
			{drawer}
			<div
				className={ cn("h-full w-4 absolute z-10 flex items-center justify-center xl:hidden", !touchSupported && "pointer-events-none hidden") }
				ref={ ref }
				style={{ touchAction: "none" }}>
				<div className="rounded-full grow bg-gray-500/10 h-12 m-[5px]" />
			</div>
			<div className={ cn("grow relative bg-inherit", className) }>{children}</div>
			<div className={ cn("absolute inset-0 bg-black/25 backdrop-blur-xl transition-[opacity,backdrop-filter] xl:hidden group/scrim", open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0") } onClick={ () => setOpen(false) } { ...props } />
		</div>
	);
}