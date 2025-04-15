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
		<div className={ cn("absolute inset-0 flex flex-col min-h-full overflow-hidden overflow-y-auto bg-inherit isolate", wrapperProps?.className) } ref={ ref } { ...wrapperProps }>
			<ToolbarShellContext value={ raised }>
				<div className="sticky isolate left-0 right-0 top-0 z-30" ref={ toolbarRef }>{ toolbar }</div>
			</ToolbarShellContext>
			<div className={ cn("grow overflow-visible bg-inherit flex flex-col relative", className) } { ...props }>{ children }</div>
		</div>
	);
}