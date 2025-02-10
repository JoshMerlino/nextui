"use client";

import { DependencyList, PropsWithChildren, useCallback, useEffect, useRef } from "react";

export function AdjustableHeight({ children, deps = []}: PropsWithChildren<Partial<{

    /**
     * Additional dependencies to watch for changes
     * @default []
     */
    deps?: DependencyList;

}>>) {

	const wrapperRef = useRef<HTMLDivElement>(null);
    
	const resize = useCallback(function() {
		
		const wrapper = wrapperRef.current;
		if (!wrapper) return;

		// Get the height of all the contents
		const height = Array.from(wrapper.children).reduce((height, child) => height + child.getBoundingClientRect().height, 0);

		// Set the height of the wrapper
		wrapper.style.height = `${ height }px`;
        
	}, []);

	useEffect(function() {
		requestAnimationFrame(resize);
		setTimeout(resize, 100);
		window.addEventListener("resize", resize);
		return () => window.removeEventListener("resize", resize);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ resize, ...deps ]);

	return (
		<div
			className="not-motion-reduce:transition-[height] bg-inherit"
			ref={ wrapperRef }>
			{ children }
		</div>
	);
}
