"use client";

import { DependencyList, useEffect } from "react";

export { usePagination } from "./Pagination";

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
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ handler, ...additionalDeps ?? [] ]);
}
export function useInterval(cb: () => void, delay: number) {
	useEffect(function() {
		const interval = setInterval(cb, delay);
		return () => clearInterval(interval);
	}, [ cb, delay ]);
}
