"use client";

import { cn } from "@util/cn";
import { HTMLAttributes, ReactNode, useEffect, useRef } from "react";

interface Props {

	/**
	 * The toolbar to render
	 */
	toolbar: ReactNode;

	/**
	 * The current state of the drawer
	 * @default false
	 */
	state: [boolean, (open: boolean) => void];

}

export function ToolbarShell({ children, className, toolbar, state: [ raised, setRaised ] }: Props & HTMLAttributes<HTMLElement>) {

	// Get a ref to the content
	const ref = useRef<HTMLDivElement>(null);

	useEffect(function() {
		if (!ref.current) return;

		// See if the element is scrolled
		function onScroll() {
			console.log("scro");
			if (!ref.current) return;

			// If the element is scrolled, raise the toolbar
			if (ref.current.scrollTop > 0) setRaised(true);

			// If the element is not scrolled, lower the toolbar
			else if (raised) setRaised(false);
			
		};

		// Add the event listener
		ref.current.addEventListener("scroll", onScroll);
		() => ref.current?.removeEventListener("scroll", onScroll);

	}, [ raised, setRaised ]);

	return (
		<div className="absolute inset-0 flex flex-col overflow-auto bg-inherit isolate" ref={ref}>
			<div className="sticky top-0 z-[10]">{toolbar}</div>
			<div className={cn("grow overflow-visible bg-inherit", className)}>{children}</div>
		</div>
	);
}