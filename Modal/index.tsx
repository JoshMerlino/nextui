"use client";

import { cn } from "@util/cn";
import { HTMLAttributes, useEffect, useRef, useState } from "react";

interface Props {

	/**
	 * If true, the modal will render as a traditional block element.
	 * @default false
	 */
	inline?: boolean;

	/**
	 * The current state of the modal
	 * @default false
	 */
	state: [ boolean, (open: boolean) => void ];

	/**
	 * Close on blur & escape key
	 * @default true
	 */
	closeOnBlur?: boolean;

}

export function Modal({ children, closeOnBlur = true, state, className }: Props & HTMLAttributes<HTMLDivElement>) {

	// Is bouncing state
	const [ isBouncing, setIsBouncing ] = useState(false);

	// Get a reference to the dialog element
	const ref = useRef<HTMLDialogElement>(null);

	// Hook into open prop
	const [ isOpen, setIsOpen ] = useState(state[0] === true);
	useEffect(() => setIsOpen(state[0] === true), [ state ]);
	
	// Open dialog using the new dialog element in accordance with the state
	useEffect(function() {
		if (!ref.current) return;
		if (state[0]) ref.current.showModal();
		else setTimeout(() => ref.current?.close(), 250);
	}, [ ref, state ]);
	
	// Close on blur
	useEffect(function() {
		if (!ref.current) return;

		function onClick(event: MouseEvent) {
			if (!ref.current || !ref.current.open) return;

			// Get dialog bounds
			const { top, left, width, height } = ref.current.getBoundingClientRect();

			// If click is inside of dialog
			if (event.clientX >= left && event.clientX <= left + width && event.clientY >= top && event.clientY <= top + height) return;

			// If close on blur is disabled, just bounce the dialog
			if (!closeOnBlur) {

				// Bounce dialog
				setIsBouncing(true);
				setTimeout(() => setIsBouncing(false), 100);

				return;
				
			}

			// Close dialog
			state[1](false);

		}

		ref.current.addEventListener("click", onClick);
		return () => ref.current?.removeEventListener("click", onClick);
		
	}, [ ref, closeOnBlur, isOpen, state ]);

	return (
		<dialog ref={ref} className={cn("p-0 bg-transparent overflow-visible focus:outline-0 transition-opacity backdrop:transition-[backdrop-filter,background-color]", isOpen ? "backdrop:bg-black/25 opacity-100 backdrop:backdrop-blur-xl" : "opacity-0 backdrop:backdrop-blur-0 backdrop:bg-transparent")}>
			<div className={cn("flex flex-col gap-4 p-4 overflow-hidden text-gray-600 bg-white rounded-lg shadow-2xl dark:shadow-black/20 dark:bg-gray-800 dark:text-gray-400 drop-shadow-xl transition-transform", isOpen ? (isBouncing ? "scale-105" : "scale-100") : "scale-75", className)}>
				{children}
			</div>
		</dialog>
	);
}