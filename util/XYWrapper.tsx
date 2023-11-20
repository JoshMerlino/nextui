"use client";

import { HTMLAttributes, useCallback, useEffect, useRef } from "react";

export function XYWrapper({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
	const ref = useRef<HTMLDivElement>(null);

	const mousemove = useCallback(function(event: MouseEvent) {
		const element = ref.current;
		if (!element) return;
		const rect = element.getBoundingClientRect();
		const x = Math.min(Math.max(0, event.clientX - rect.left), rect.width);
		const y = Math.min(Math.max(0, event.clientY - rect.top), rect.height);
		element.style.setProperty("--x", `${ x }px`);
		element.style.setProperty("--y", `${ y }px`);
	}, []);

	useEffect(function() {
		const element = ref.current;
		if (!element) return;
		element.addEventListener("mousemove", mousemove);
		return () => element.removeEventListener("mousemove", mousemove);
	}, [ mousemove, ref ]);

	return <div ref={ ref } { ...props }>{children}</div>;
	
};
