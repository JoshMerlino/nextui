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
		let _open = open;
		if (distance > width / 2) _open = true;
		else if (distance < -width / 2) _open = false;
		setOpen(_open);
		$handle.style.transform = open ? `translateX(${ width }px)` : "translateX(0)";
		$handle.style.transition = "transform 200ms ease-in-out";
		$drawer.style.transition = "opacity 200ms ease-in-out, transform 200ms ease-in-out";
		$drawer.style.opacity = open ? "1" : "0";
		$scrim.style.transition = "opacity 200ms ease-in-out, backdrop-filter 200ms ease-in-out";
		$scrim.style.opacity = open ? "1" : "0";
		$drawer.style.setProperty("--tw-translate-x", open ? "0" : "-100%");
		$scrim.style.setProperty("--tw-backdrop-blur", open ? "blur(24px)" : "blur(0)");
	}, [ open, setOpen ]);
	
	// Have drawer track touch events
	const onTouchMove = useCallback(function(event: TouchEvent) {
		event.preventDefault();
		event.stopPropagation();
		const $handle = ref.current;
		const $drawer = $handle?.parentElement?.querySelector(".group\\/drawer") as HTMLDivElement | null;
		const $scrim = $handle?.parentElement?.querySelector(".group\\/scrim") as HTMLDivElement | null;
		if (!$drawer || !$handle || !$scrim) return;
		const { width } = $drawer.getBoundingClientRect();
		const deltaX = Math.min(Math.max(event.touches[0].clientX - down.current, 0), width);
		const percentage = deltaX / width;
		setOpen(deltaX > width / 2);
		$handle.style.transform = `translateX(${ deltaX }px)`;
		$drawer.style.transition = "none";
		$handle.style.transition = "none";
		$drawer.style.opacity = `${ Math.min(percentage * 5, 1) }`;
		$scrim.style.opacity = `${ Math.min(percentage * 5, 1) }`;
		$scrim.style.transition = "none";
		$drawer.style.setProperty("--tw-translate-x", `${ -width + deltaX }px`);
		$scrim.style.setProperty("--tw-backdrop-blur", `blur(${ 24 * percentage }px)`);
	}, [ setOpen ]);

	// Sync handle with drawer state
	useEffect(function() {
		const $handle = ref.current;
		const $drawer = $handle?.parentElement?.querySelector(".group\\/drawer") as HTMLDivElement | null;
		const $scrim = $handle?.parentElement?.querySelector(".group\\/scrim") as HTMLDivElement | null;
		if (!$drawer || !$handle || !$scrim) return;
		$drawer.style.opacity = open ? "1" : "0";
		$scrim.style.opacity = open ? "1" : "0";
		$drawer.style.transition = "opacity 200ms ease-in-out, transform 200ms ease-in-out";
		$handle.style.transform = open ? `translateX(${ $drawer.getBoundingClientRect().width }px)` : "translateX(0)";
		$drawer.style.setProperty("--tw-translate-x", open ? "0" : "-100%");
		$scrim.style.setProperty("--tw-backdrop-blur", open ? "blur(24px)" : "blur(0)");
	}, [ open ]);
	
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
			<div className={ cn("absolute inset-0 bg-black/25 backdrop-blur-xl transition-[opacity,backdrop-filter] xl:hidden group/scrim", open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0") } onClick={ () => setOpen(false) } { ...props } />
		</div>
	);
}