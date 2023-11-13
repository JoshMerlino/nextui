"use client";

import { DependencyList, useEffect } from "react";

export function useEvent<K extends keyof WindowEventMap>(event: K, handler: (this: Window, ev: WindowEventMap[K]) => any) {
	useEffect(function() {
		window.addEventListener(event, handler);
		return () => window.removeEventListener(event, handler);
	}, [ event, handler ]);
}

export function useResize(handler: () => any, additionalDeps?: DependencyList) {
	useEffect(function() {
		handler();
		window.addEventListener("resize", handler);
		return () => window.removeEventListener("resize", handler);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ handler, ...additionalDeps ?? [] ]);
}