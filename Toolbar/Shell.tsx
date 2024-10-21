"use client";

import { useResize } from "nextui/hooks";
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
	const beforeWrapperRef = useRef<HTMLDivElement>(null);

	useEffect(function() {
		const toolbar = ref.current;
		if (!toolbar) return;

		// See if the element is scrolled
		function onScroll() {
			if (!toolbar) return;
			if (toolbar.scrollTop > (beforeWrapperRef.current?.clientHeight ?? 0)) setRaised(true);
			else if (raised) setRaised(false);
		}

		// Add the event listener
		toolbar.addEventListener("scroll", onScroll);
		return () => toolbar.removeEventListener("scroll", onScroll);

	}, [ raised, setRaised ]);
	
	useResize(function() {
		const toolbar = toolbarRef.current;
		if (!toolbar || !backdropRef.current) return;
		
		const height = backdropRef.current.clientHeight - toolbar.clientHeight;
		backdropRef.current.style.top = `-${ height }px`;
	}, [ backdrop, backdropRef, toolbarRef ]);

	return (
		<div className="absolute inset-0 flex flex-col min-h-full overflow-y-auto bg-inherit isolate" id={ id } ref={ ref }>
			<div className="sticky z-10 isolate left-0 right-0" ref={ backdropRef }>
				{ backdrop }
				<div className="relative" ref={ beforeWrapperRef }>
					{ before }
				</div>
				<div className="sticky top-0 z-30" ref={ toolbarRef }>{ toolbar }</div>
			</div>
			<div className={ cn("grow overflow-visible bg-inherit flex flex-col relative", className) }>{ children }</div>
			<div className="sticky left-0 right-0 -z-10">
				{ after }
			</div>
		</div>
	);
}