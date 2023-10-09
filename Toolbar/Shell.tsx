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

	/**
	 * The content to render as a backdrop.
	 */
	backdrop?: ReactNode;

}

export function ToolbarShell({ children, className, before, after, toolbar, state: [ raised, setRaised ], id, backdrop }: Props & HTMLAttributes<HTMLElement>) {

	// Get a ref to the content
	const ref = useRef<HTMLDivElement>(null);
	const backdropRef = useRef<HTMLDivElement>(null);
	const toolbarRef = useRef<HTMLDivElement>(null);

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
	
	useEffect(function() {
		
		function resize() {
			const toolbar = toolbarRef.current;
			if (!toolbar || !backdrop || !backdropRef.current) return;
		
			const height = backdropRef.current.clientHeight - toolbar.clientHeight;
			backdropRef.current.style.top = `-${ height }px`;
		}

		resize();
		window.addEventListener("resize", resize);
		return () => window.removeEventListener("resize", resize);

	}, [ backdrop, backdropRef, toolbarRef ]);

	return (
		<div className="absolute inset-0 flex flex-col bg-inherit isolate overflow-y-auto overflow-x-hidden min-h-full" id={ id } ref={ ref }>
			{backdrop ? (
				<div className="sticky z-10 isolate" ref={ backdropRef }>
					{backdrop}
					<div className="relative">
						{ before }
					</div>
					<div className="sticky top-0 z-30" ref={ toolbarRef }>{toolbar}</div>
				</div>
			) : (
				<div>
					{ before }
					<div className="sticky top-0 z-50">{toolbar}</div>
				</div>
			)}
			<div className={ cn("grow overflow-visible bg-inherit flex flex-col relative", className) }>{children}</div>
			{after}
		</div>
	);
}