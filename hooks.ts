"use client";

import { useCallback, useEffect, useMemo, useState, type DependencyList } from "react";

export function useScroll(container: React.RefObject<HTMLElement> | HTMLElement = document.body) {

	const element = useMemo(() => "current" in container ? container.current : container, [ container ]);

	const [ scrollX, setScrollX ] = useState(0);
	const [ scrollY, setScrollY ] = useState(0);

	const handle = useCallback(function({ target }: Event) {
		if (!(target instanceof HTMLElement)) return;
		setScrollX(target.scrollLeft);
		setScrollY(target.scrollTop);
	}, [ container ]);

	useEffect(function() {
		if (!element) return;
		element.addEventListener("scroll", handle);
		() => element.removeEventListener("scroll", handle);
	}, [ element, handle ]);

	return { scrollX, scrollY };

}

export function useEvent<K extends keyof WindowEventMap>(event: K, handler: (this: Window, ev: WindowEventMap[K]) => (void | unknown)) {
	useEffect(function() {
		window.addEventListener(event, handler);
		return () => window.removeEventListener(event, handler);
	}, [ event, handler ]);
}

export function useResize(handler: () => (void | unknown), additionalDeps?: DependencyList) {
	useEffect(function() {
		handler();
		window.addEventListener("resize", handler);
		return () => window.removeEventListener("resize", handler);
	}, [ handler, ...additionalDeps ?? [] ]);
}

export function useInterval(cb: () => void, delay: number) {
	useEffect(function() {
		const interval = setInterval(cb, delay);
		return () => clearInterval(interval);
	}, [ cb, delay ]);
}
