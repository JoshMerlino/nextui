"use client";

import { HTMLAttributes, useEffect, useRef, useState } from "react";
import { Card } from "../Card";
import { cn } from "../util";

export function useDialogContent(open: boolean) {
	const [ render, setRender ] = useState(false);
	useEffect(function() {
		if (open) setRender(true);
		else setTimeout(() => setRender(false), 150);
	}, [ open ]);
	return render;
}

interface Props {

	/**
	 * If true, the modal will render as a traditional block element.
	 * @default false
	 */
	inline?: boolean;

	/**
	 * The current state of the modal
	 */
	state: [ boolean, (open: boolean) => void ];

	/**
	 * Close on click away
	 * @default true
	 */
	closeOnBlur?: boolean;

	/**
	 * Close on escape key
	 * @default true
	 */
	bindEscKey?: boolean;

	/**
	 * If the children should always be mounted in the modal or only when the modal is open
	 * @default false
	 */
	renderContents?: boolean;

}

export function Modal({ children, renderContents = false, closeOnBlur = true, bindEscKey = true, state: [ state, setState ], className, ...props }: Props & HTMLAttributes<HTMLDialogElement>) {

	// Is bouncing state
	const [ isBouncing, setIsBouncing ] = useState(false);

	// Get a reference to the dialog element
	const ref = useRef<HTMLDialogElement>(null);

	// Hook into open prop
	const [ isOpen, setIsOpen ] = useState(state === true);
	useEffect(() => setIsOpen(state === true), [ state ]);
	
	// Open dialog using the new dialog element in accordance with the state
	useEffect(function() {
		if (!ref.current) return;
		if (state) ref.current.showModal();
		else setTimeout(() => ref.current?.close(), 150);
	}, [ ref, state ]);
	
	// Close on blur
	useEffect(function() {
		const element = ref.current;
		if (!element) return;

		function onClick(event: MouseEvent) {
			if (!element || !element.open) return;

			// Get dialog bounds
			const { top, left, width, height } = element.getBoundingClientRect();

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
			setState(false);

		}

		element.addEventListener("click", onClick);
		return () => element.removeEventListener("click", onClick);
		
	}, [ ref, closeOnBlur, isOpen, state, setState ]);
	
	// On escape key, gracefully close the dialog
	useEffect(function() {
		
		function onKeydown(event: KeyboardEvent) {

			// If the key is not escape, return
			if (event.key !== "Escape") return;

			// If the dialog is not open, return
			if (!ref.current || !ref.current.open) return;

			// Close the dialog
			event.preventDefault();
			if (bindEscKey) setState(false);
			else {
				setIsBouncing(true);
				setTimeout(() => setIsBouncing(false), 100);
			}

		}

		window.addEventListener("keydown", onKeydown);
		return () => window.removeEventListener("keydown", onKeydown);

	}, [ ref, isOpen, state, setState, bindEscKey ]);
	
	const contentVisable = useDialogContent(isOpen);

	return (
		<dialog className={ cn("p-0 bg-transparent overflow-visible focus:outline-0 transition-opacity transform-gpu backdrop:transform-gpu backdrop:transition-[backdrop-filter,background-color] w-full justify-center flex", isOpen ? "backdrop:bg-black/25 dark:backdrop:bg-black/50 opacity-100 backdrop:backdrop-blur-xl" : "opacity-0 backdrop:backdrop-blur-0 backdrop:bg-transparent pointer-events-none") } ref={ ref } { ...props }>
			<Card className={ cn("shadow-2xl dark:shadow-black/20 drop-shadow-xl transition-transform transform-gpu overflow-visible", isOpen ? (isBouncing ? "scale-105" : "scale-100") : "scale-75", className) }>
				{ (contentVisable || renderContents) && children }
			</Card>
		</dialog>
	);
}