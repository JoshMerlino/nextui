"use client";

import { cn } from "nextui/util";
import { useCallback, useEffect, useRef, useState } from "react";

export interface ScrollSpyItem {

	/** Link label */
	title: string;

	/** Anchor href, e.g. "#requirements" */
	href: string;

	/** Nesting depth (1-4) — hierarchy is shown purely through indentation */
	depth: number;

}

/**
 * Scrollspy navigation: a thin left border with a sliding indicator segment
 * that animates to the active item as the scroll container scrolls.
 */
export function ScrollSpy({ items, htmlFor, className }: {

	/** The links to render, in document order */
	items: ScrollSpyItem[];

	/** id of the scrolling container the targets live in */
	htmlFor: string;

	/** Additional classes for the list element */
	className?: string;

}) {

	const linkRefs = useRef(new Map<string, HTMLAnchorElement>());
	const [ active, setActive ] = useState<string | null>(items[0]?.href ?? null);
	const [ indicator, setIndicator ] = useState<{ top: number; height: number } | null>(null);

	// Scrollspy: the active item is the last target at or above the reading line
	useEffect(() => {
		const shell = document.getElementById(htmlFor);
		if (!shell) return;

		let frame = 0;
		const update = () => {
			frame = 0;
			const shellTop = shell.getBoundingClientRect().top;
			let current = items[0]?.href ?? null;
			for (const item of items) {
				const target = document.getElementById(item.href.slice(1));
				if (!target) continue;
				if (target.getBoundingClientRect().top - shellTop <= 96) current = item.href;
				else break;
			}
			setActive(current);
		};

		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};

		update();
		shell.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			shell.removeEventListener("scroll", onScroll);
			if (frame) cancelAnimationFrame(frame);
		};
	}, [ htmlFor, items ]);

	// Slide the indicator to the active link
	useEffect(() => {
		const link = active ? linkRefs.current.get(active) : null;
		if (!link) return setIndicator(null);
		setIndicator({ top: link.offsetTop, height: link.offsetHeight });
	}, [ active ]);

	// Smooth scroll to the target over a fixed duration
	// (native behavior:"smooth" offers no duration control)
	const scrollFrame = useRef(0);
	const onClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
		const href = event.currentTarget.getAttribute("href");
		if (!href?.startsWith("#")) return;
		event.preventDefault();
		const shell = document.getElementById(htmlFor);
		const target = document.getElementById(href.slice(1));
		if (!shell || !target) return;

		const DURATION = 200;
		const from = shell.scrollTop;
		const to = from + target.getBoundingClientRect().top - shell.getBoundingClientRect().top - 80;
		const start = performance.now();
		const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

		cancelAnimationFrame(scrollFrame.current);
		const step = (now: number) => {
			const t = Math.min(1, (now - start) / DURATION);
			shell.scrollTop = from + (to - from) * easeOutCubic(t);
			if (t < 1) scrollFrame.current = requestAnimationFrame(step);
		};
		scrollFrame.current = requestAnimationFrame(step);
		setActive(href);
	}, [ htmlFor ]);

	return (
		<ul className={ cn("relative flex flex-col text-sm border-l border-gray-200 dark:border-gray-700/50", className) }>
			{ indicator && (
				<span
					aria-hidden
					className="absolute -left-px w-0.5 rounded-full bg-primary dark:bg-primary transition-[top,height] duration-100 ease-out"
					style={{ height: indicator.height, top: indicator.top }} />
			) }
			{ items.map(item => (
				<li key={ item.href }>
					<a
						className={ cn(
							"block py-1 truncate transition-colors duration-100",
							item.depth <= 2 ? "pl-4" : item.depth === 3 ? "pl-7" : "pl-10",
							active === item.href
								? "text-primary dark:text-primary"
								: "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
						) }
						href={ item.href }
						onClick={ onClick }
						ref={ element => {
							if (element) linkRefs.current.set(item.href, element);
							else linkRefs.current.delete(item.href);
						} }>
						{ item.title }
					</a>
				</li>
			)) }
		</ul>
	);
}
