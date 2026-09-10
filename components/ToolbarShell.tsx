"use client";

import { createContext, HTMLAttributes, ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "../util";

export const ToolbarShellContext = createContext(false);

export function ToolbarShell({ children, className, toolbar, wrapperProps, wrapperRef, ...props }: {

	/**
	 * The toolbar to render
	 */
	toolbar: ReactNode;

	/**
	 * The scrolling wrapper to use
	 */
	wrapperRef?: React.RefObject<HTMLDivElement>;

} & HTMLAttributes<HTMLDivElement> & { wrapperProps?: HTMLAttributes<HTMLDivElement> }) {

	// Get a ref to the content
	const ref = useRef<HTMLDivElement>(null);
	const toolbarRef = useRef<HTMLDivElement>(null);
	const [ raised, setRaised ] = useState(false);

	useEffect(function() {
		const wrapper = wrapperRef?.current || ref.current;
		if (!wrapper) return;

		// Get the controller
		const controller = new AbortController();

		// Add the event listener
		wrapper.addEventListener("scroll", function() {
			if (!wrapper) return;
			if (wrapper.scrollTop > 0) setRaised(true);
			else if (raised) setRaised(false);
		}, { signal: controller.signal });
		return () => controller.abort();

	}, [ raised, setRaised ]);

	// The measured clearance, over the static one below. The classes guess at
	// the header's height (a bar with tabs, a banner or not) and a bar WITHOUT
	// tabs is two rem shorter than the guess, which parked every rail on an
	// untabbed page a heading's height below the content it was indexing.
	// Measuring the sticky header itself is right for every combination the
	// header can be in, and the observer keeps it right when a banner mounts
	// or the tabs wrap. 1.5rem on top is the page's own rhythm above its
	// first panel (`xl:my-6`), so the rail's first line sits level with it.
	useEffect(function() {
		const wrapper = wrapperRef?.current || ref.current;
		const header = toolbarRef.current;
		if (!wrapper || !header) return;
		const publish = () => wrapper.style.setProperty("--rail-top", `calc(${ header.getBoundingClientRect().height }px + 1.5rem)`);
		publish();
		const observer = new ResizeObserver(publish);
		observer.observe(header);
		return () => observer.disconnect();
	}, [ wrapperRef ]);

	return (

		// `--rail-top` is how far down a sticky contents rail has to start to
		// clear the header. The toolbar alone is 8rem of clearance; a banner
		// attached under it adds its own 54px, and a rail that did not know
		// would tuck under one. Published from here because this is the only
		// element that contains both the header and the page, and read with a
		// fallback so a rail outside a shell still lands somewhere sane.
		<div
			className={ cn("absolute inset-0 flex flex-col min-h-full overflow-hidden overflow-y-auto bg-inherit isolate", "[--rail-top:8rem] has-[[data-banner]]:[--rail-top:11.375rem]", wrapperProps?.className) }
			ref={ ref }
			{ ...wrapperProps }>
			<ToolbarShellContext value={ raised }>
				{ /* Banners are later siblings, so by document order they paint over
				     the toolbar, which is what they should do: the strip belongs on
				     top of the bar it hangs from. The exception is a popover hanging
				     DOWN out of the toolbar, which the banner would then cover — so
				     the header is raised only while one is open, and drops back the
				     moment it closes.

				     A banner attached under the toolbar supplies the rule between
				     itself and the page, so the toolbar drops its own: the two
				     stacked read as one thick line rather than a border. The same
				     for the raised shadow — the banner casts its own onto the page,
				     and the toolbar's would only fall onto the banner. Keyed off
				     `data-banner` on the strip itself, so a toolbar that mounts one
				     conditionally is right in both states without being told.

				     Here rather than in each toolbar because this is the element
				     that actually holds both of them, and a wrapper added upstream
				     to reach the same selector would be a nesting level that exists
				     only to carry a class. */ }
				{ /* `data-popover-open` is the same contract for every other popover
				     hanging out of the toolbar — the org tray, say — set while open
				     for exactly the reason data-search-open is. */ }
				<div
					className="sticky isolate left-0 right-0 top-0 z-30 has-[[data-search-open]]:[&>header]:relative has-[[data-search-open]]:[&>header]:z-10 has-[[data-popover-open]]:[&>header]:relative has-[[data-popover-open]]:[&>header]:z-10 has-[[data-banner]]:[&>header]:border-b-transparent has-[[data-banner]]:[&>header]:shadow-none"
					ref={ toolbarRef }>{ toolbar }</div>
			</ToolbarShellContext>
			<div className={ cn("grow overflow-visible bg-inherit flex flex-col relative", className) } { ...props }>{ children }</div>
		</div>
	);
}