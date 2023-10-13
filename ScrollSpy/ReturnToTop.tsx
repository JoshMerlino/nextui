"use client";

import { cn } from "nextui/util";
import { HTMLAttributes, useEffect, useRef, useState } from "react";

export function ReturnToTop({ children, className, htmlFor, hideWhenUseless = true, ...props }: HTMLAttributes<HTMLDivElement> & { htmlFor?: string, hideWhenUseless?: boolean }): JSX.Element {
	const elem = (htmlFor ? document.getElementById(htmlFor)! : window) as HTMLElement;
	const [ isScrolling, setIsScrolling ] = useState(true);
	const initialHeight = useRef(-1);
	const scrollToTop = () => elem.scrollTo({ top: 0, behavior: "smooth" });
	const id = props.id || Math.random().toString(36).slice(2);

	// Bind scrolling to the for element
	useEffect(function() {
		let mounted = true;

		// Get the initial height
		if (initialHeight.current === -1) {
			initialHeight.current = document.getElementById(id)?.clientHeight ?? 0;
			setIsScrolling(elem.scrollTop > 0);
		}

		(function frameloop() {
			if (!mounted) return;
			requestAnimationFrame(frameloop);
			setIsScrolling(elem.scrollTop > 0);
		}());

		return () => {
			mounted = false;
		};
	}, [ elem, id ]);

	return <div { ...props }
		className={ cn(className, hideWhenUseless && "transition-[height,opacity]", hideWhenUseless && isScrolling ? "opacity-1" : "opacity-0") }
		id={ id }
		onClick={ props.onClick ? (...args) => props.onClick?.(...args) && scrollToTop() : scrollToTop }
		style={{ ...props.style, height: hideWhenUseless && isScrolling ? initialHeight.current : 0 }}>{children}</div>;
}