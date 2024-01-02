"use client";

import { DependencyList, PropsWithChildren, useEffect, useRef } from "react";

export function AdjustableHeight({ children, deps = []}: PropsWithChildren<{ deps?: DependencyList; }>) {
	const wrapperRef = useRef<HTMLDivElement>(null);

	useEffect(function() {
		const wrapper = wrapperRef.current;

		function resize() {
			if (!wrapper) return;

			// Get the height of all the contents
			const height = Array.from(wrapper.children).reduce((height, child) => height + child.getBoundingClientRect().height, 0);

			// Set the height of the wrapper
			wrapper.style.height = `${ height }px`;

		}

		requestAnimationFrame(resize);
		setTimeout(resize, 100);
		window.addEventListener("resize", resize);
		return () => window.removeEventListener("resize", resize);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);

	return <div className="transition-[height] bg-inherit" ref={ wrapperRef }>{ children }</div>;
}
