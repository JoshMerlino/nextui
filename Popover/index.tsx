"use client";

import { ClassValue } from "clsx";
import { HTMLAttributes, PropsWithChildren, ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "../util";

interface Props {

	/**
	 * The popover content
	 */
	popover: ReactNode;

	/**
	 * The anchor position of the popover
	 * (this is the side of the popover that is attached to the target)
	 * @default "top"
	 */
	anchor?: ("top" | "bottom" | "left" | "right") | `${ "top" | "bottom" } ${ "left" | "right" }`;

	/**
	 * Custom classnames to apply to the popover
	 */
	className?: ClassValue;

	/**
	 * The current state of the popover
	 */
	state: [boolean, (open: boolean) => void];

	/**
	 * If true, the popover will be inset from the anchor
	 * @default false
	 */
	inset?: boolean;
	
}

export function Popover({ children, anchor = "top", popover, inset, state: [ state ], ...props }: PropsWithChildren<Props> & HTMLAttributes<HTMLElement>) {

	// Get a reference to the dialog element
	const ref = useRef<HTMLDialogElement>(null);

	// Hook into open prop
	const [ isOpen, setIsOpen ] = useState(state === true);
	useEffect(() => setIsOpen(state === true), [ state ]);
	
	// Open dialog using the new dialog element in accordance with the state
	useEffect(function() {
		if (!ref.current) return;
		if (state) ref.current.show();
		else setTimeout(() => ref.current?.close(), 100);
	}, [ ref, state ]);

	const popoverClass: ClassValue[] = [

		// Base class
		"absolute p-0 bg-transparent overflow-visible focus:outline-0 transition-[opacity,transform] duration-100 ease-in-out transform-gpu",

		isOpen ? "opacity-100 scale-100" : "opacity-0 scale-75",

		// Anchor
		{
			[inset ? "top-0" : "top-full"]: anchor.includes("top"),
			[inset ? "bottom-0" : "bottom-full"]: anchor.includes("bottom"),
			[inset ? "left-0" : "left-full"]: anchor.includes("left"),
			[inset ? "right-0 left-auto" : "right-full left-auto"]: anchor.includes("right"),
			
			"left-1/2 -translate-x-1/2": anchor === "top" || anchor === "bottom",
			"top-1/2 -translate-y-1/2": anchor === "left" || anchor === "right",

			// Transform origin
			"origin-top": anchor === "top",
			"origin-bottom": anchor === "bottom",
			"origin-left": anchor === "left",
			"origin-right": anchor === "right",
			"origin-top-left": anchor === "top left",
			"origin-top-right": anchor === "top right",
			"origin-bottom-left": anchor === "bottom left",
			"origin-bottom-right": anchor === "bottom right",
		}

	];

	return (
		<div className={ cn("group/popover relative isolate z-[10] overflow-visible") } { ...props }>
			{children}
			<dialog className={ cn(popoverClass) } ref={ ref }>{popover}</dialog>
		</div>
	);

}