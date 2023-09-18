"use client";

import { HTMLAttributes, ReactNode, useEffect, useRef } from "react";
import { cn } from "../util";

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

	/**
	 * The content to render before the toolbar.
	 */
	before?: ReactNode;

	/**
	 * The content to render after the toolbar.
	 */
	after?: ReactNode;

}

export function ToolbarShell({ children, className, before, after, toolbar, state: [ raised, setRaised ], id }: Props & HTMLAttributes<HTMLElement>) {

	// Get a ref to the content
	const ref = useRef<HTMLDivElement>(null);

	useEffect(function() {
		if (!ref.current) return;

		// See if the element is scrolled
		function onScroll() {
			if (!ref.current) return;
			if (ref.current.scrollTop > 0) setRaised(true);
			else if (raised) setRaised(false);
		}

		// Add the event listener
		ref.current.addEventListener("scroll", onScroll);
		() => ref.current?.removeEventListener("scroll", onScroll);

	}, [ raised, setRaised ]);

	return (
		<div className="absolute inset-0 flex flex-col bg-inherit isolate overflow-y-auto overflow-x-hidden min-h-full" id={ id } ref={ ref }>
			{ before }
			<div className="sticky top-0 z-[10]">{toolbar}</div>
			<div className={ cn("grow overflow-visible bg-inherit flex flex-col", className) }>{children}</div>
			{after}
		</div>
	);
}