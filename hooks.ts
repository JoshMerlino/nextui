"use client";

import { useEffect } from "react";

export function useEvent<K extends keyof WindowEventMap>(event: K, handler: (this: Window, ev: WindowEventMap[K]) => any) {
	useEffect(function() {
		window.addEventListener(event, handler);
		return () => window.removeEventListener(event, handler);
	}, [ event, handler ]);
}