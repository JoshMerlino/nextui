import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

export function useFocusLost<T extends HTMLElement>(ref: RefObject<T | null>, callback: (event: MouseEvent | TouchEvent | FocusEvent) => unknown) {

	const handleClickOutside = useCallback(function(event: MouseEvent | TouchEvent) {
		if (ref.current && !ref.current.contains(event.target as Node)) callback(event);
	}, [ ref, callback ]);
	
	const handleFocusShift = useCallback(function(event: FocusEvent) {
		if ((event.target as HTMLButtonElement).disabled) return;
		if (!ref.current) return;
		if (ref.current.contains(event.relatedTarget as Node)) return;
		if (ref.current === event.relatedTarget) return;
		if (ref.current.contains(event.target as Node)) return;
		if (ref.current === event.target) return;
		callback(event);
	}, [ ref, callback ]);

	useEffect(function() {
		const element = ref.current;
		if (!element) return;
		const controller = new AbortController();
		document.addEventListener("mousedown", handleClickOutside, { signal: controller.signal });
		document.addEventListener("touchstart", handleClickOutside, { signal: controller.signal });
		element.addEventListener("focusout", handleFocusShift, { signal: controller.signal });
		window.addEventListener("blur", callback, { signal: controller.signal });
		return () => controller.abort();
	}, [ ref, callback, handleClickOutside, handleFocusShift ]);
}

type Keybind = string | { key: string, ctrl?: boolean, shift?: boolean, alt?: boolean, meta?: boolean };

export function useKeybind(bind: Keybind, callback: (event: KeyboardEvent) => unknown) {

	const handleKeyPress = useCallback(function(event: KeyboardEvent) {
		if (typeof bind === "string") {
			if (event.key === bind) callback(event);
		} else {
			const { key, ctrl, shift, alt, meta } = bind;
			if (event.key === key && event.ctrlKey === ctrl && event.shiftKey === shift && event.altKey === alt && event.metaKey === meta) callback(event);
		}
	}, [ bind, callback ]);

	useEffect(function() {
		document.addEventListener("keydown", handleKeyPress);
		return () => document.removeEventListener("keydown", handleKeyPress);
	}, [ handleKeyPress ]);

}

export function useEvent<T extends keyof WindowEventMap>(event: T, callback: (event: WindowEventMap[T]) => unknown) {
	const handleEvent = useCallback((event: WindowEventMap[T]) => callback(event), [ callback ]);
	useEffect(function() {
		const controller = new AbortController();
		window.addEventListener(event, handleEvent, { signal: controller.signal });
		return () => controller.abort();
	}, [ event, handleEvent ]);
}

export function useConvergedRef<T>(ref?: React.Ref<T>) {
	const internalRef = useRef<T>(null);
	useEffect(() => {
		const currentRef = internalRef.current;
		if (ref && typeof ref === "function") ref(currentRef);
		else if (ref) ref.current = currentRef;
	}, [ internalRef, ref ]);
	return internalRef;
}

export function useEventMap<T extends HTMLElement | null>(ref: RefObject<T>, customEvents: Partial<{
    [K in keyof HTMLElementEventMap]: (this: Exclude<T, null>, event: HTMLElementEventMap[K] & { target: T; }) => void;
}> = {}) {
	useEffect(function() {
		const controller = new AbortController();
		const current = ref.current;
		if (!current) return;
		for (const [ event, handler ] of Object.entries(customEvents)) current.addEventListener(event as keyof HTMLElementEventMap, handler as EventListener, { signal: controller.signal });
		return () => controller.abort();
	}, [ ref, customEvents ]);
}

export function useCursor<T extends HTMLElement>(ref?: RefObject<T | null>) {
	const [ position, setPosition ] = useState({ x: 0, y: 0 });
	const handleMouseMove = useCallback((event: MouseEvent) => {
		if (ref?.current) {
			const rect = ref.current.getBoundingClientRect();
			setPosition({ x: event.clientX - rect.left - rect.width / 2, y: event.clientY - rect.top - rect.height / 2 });
		} else {
			setPosition({ x: event.clientX, y: event.clientY });
		}
	}, [ ref ]);
	useEffect(() => {
		document.addEventListener("mousemove", handleMouseMove);
		return () => document.removeEventListener("mousemove", handleMouseMove);
	}, [ handleMouseMove ]);
	return position;
}

type Options = {
  blockVertical?: boolean; // also block top/bottom overscroll (default: false)
};

export function usePreventMacSwipe<T extends HTMLElement>(options: Options = {}): RefObject<T | null> {
	const { blockVertical = false } = options;
	const ref = useRef<T>(null);

	useEffect(() => {

		// Only apply on macOS desktop browsers where swipe-nav is a thing
		const ua = navigator.userAgent;
		if (!ua.includes("Macintosh")) return;

		const isSafari = ua.includes("Safari") && !ua.includes("Chrome");
		const isChrome = ua.includes("Chrome");
		const isFirefox = ua.includes("Firefox");
		if (!isSafari && !isChrome && !isFirefox) return;

		function canScroll(node: HTMLElement, dir: "left" | "right" | "up" | "down") {
			if (dir === "left") return node.scrollLeft > 0;
			if (dir === "right") return node.scrollLeft + node.clientWidth < node.scrollWidth;
			if (dir === "up") return node.scrollTop > 0;
			return node.scrollTop + node.clientHeight < node.scrollHeight; // down
		}

		function shouldPrevent(e: WheelEvent, root: HTMLElement): boolean {
			const target = e.target as HTMLElement | null;
			if (!target || !root.contains(target)) return false;

			// Determine which directions the event is attempting
			const wantsLeft = e.deltaX < 0;
			const wantsRight = e.deltaX > 0;
			const wantsUp = blockVertical && e.deltaY > 0;
			const wantsDown = blockVertical && e.deltaY < 0;

			// Walk up the DOM and check if ANY ancestor can scroll in that direction
			let node: HTMLElement | null = target;
			let canL = false, canR = false, canU = false, canD = false;

			while (node && node !== document.body && node !== document.documentElement) {

				// Only consider scrollable containers
				const style = getComputedStyle(node);
				const overflowX = style.overflowX;
				const overflowY = style.overflowY;

				if (wantsLeft || wantsRight) {
					if (overflowX !== "visible") {
						if (!canL && wantsLeft) canL = canScroll(node, "left");
						if (!canR && wantsRight) canR = canScroll(node, "right");
					}
				}
				if (wantsUp || wantsDown) {
					if (overflowY !== "visible") {
						if (!canU && wantsUp) canU = canScroll(node, "up");
						if (!canD && wantsDown) canD = canScroll(node, "down");
					}
				}

				// Early exit if any scroll is possible
				if ((wantsLeft && canL) || (wantsRight && canR) || (wantsUp && canU) || (wantsDown && canD)) {
					return false;
				}

				node = node.parentElement;
			}

			// If we got here, no ancestor can scroll in the attempted direction(s)
			return (wantsLeft && !canL) || (wantsRight && !canR) || (wantsUp && !canU) || (wantsDown && !canD);
		}

		function onWheel(e: WheelEvent) {
			const root = ref.current;
			if (!root) return;
			if (shouldPrevent(e, root)) {

				// MUST be passive: false to allow preventDefault
				e.preventDefault();

				// Avoid inertial carry-over sometimes triggering UI chrome
				e.stopPropagation();
			}
		}

		// Attach to window so we beat the browser’s history gesture
		window.addEventListener("wheel", onWheel, { passive: false, capture: true });

		return () => {
			window.removeEventListener("wheel", onWheel, { capture: true });
		};
	}, [ blockVertical ]);

	return ref;
}
