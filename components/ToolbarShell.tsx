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
				     stacked read as one thick line rather than a border. Keyed off
				     `data-banner` on the strip itself, so a toolbar that mounts one
				     conditionally is right in both states without being told.

				     Here rather than in each toolbar because this is the element
				     that actually holds both of them, and a wrapper added upstream
				     to reach the same selector would be a nesting level that exists
				     only to carry a class. */ }
				<div
					className="sticky isolate left-0 right-0 top-0 z-30 has-[[data-search-open]]:[&>header]:relative has-[[data-search-open]]:[&>header]:z-10 has-[[data-banner]]:[&>header]:border-b-transparent"
					ref={ toolbarRef }>{ toolbar }</div>
			</ToolbarShellContext>
			<div className={ cn("grow overflow-visible bg-inherit flex flex-col relative", className) } { ...props }>{ children }</div>
		</div>
	);
}