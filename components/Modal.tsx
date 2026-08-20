"use client";

import { Card } from "nextui/Card";
import { cn } from "nextui/util";
import { HTMLAttributes, useEffect, useRef, useState } from "react";

export function Modal({ children, closeOnBlur = true, bindEscKey = true, onSubmitShortcut, state: [ state, setState ], className, variant, alwaysRender, ...props }: {

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
	 * Wether to always render the modal content in the dom, even when closed
	 * @default false
	 */
	alwaysRender?: boolean;

	/**
	 * Called on Ctrl+Enter (or Cmd+Enter) while the modal is open — the save
	 * chord for a dialog that ends in a primary action, the counterpart of the
	 * Escape binding above it. The modal owns only the binding: whether the
	 * action is currently allowed (validation, an in-flight save) is the
	 * handler's own question, exactly as it is for the button it mirrors.
	 * @default undefined — the chord does nothing
	 */
	onSubmitShortcut?: () => void;

} & Pick<ExtractProps<typeof Card>, "variant"> & HTMLAttributes<HTMLDialogElement>) {

	// Is bouncing state
	const [ isBouncing, setIsBouncing ] = useState(false);

	// Get a reference to the dialog element
	const ref = useRef<HTMLDialogElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	// Hook into open prop
	const [ isOpen, setIsOpen ] = useState(state === true);
	useEffect(() => setIsOpen(state === true), [ state ]);
	
	// Open dialog using the new dialog element in accordance with the state
	useEffect(function() {
		if (!ref.current) return;
		if (state) ref.current.showModal();
		else if (isOpen !== false) ref.current.addEventListener("transitionend", () => requestAnimationFrame(() => ref.current?.close()), { once: true });
	}, [ isOpen, ref, state ]);
	
	// Close on blur
	useEffect(function() {
		const element = ref.current;
		if (!element) return;

		function onClick(event: MouseEvent) {
			if (!element || !element.open || !contentRef.current) return;

			// Get dialog bounds
			const { top, left, width, height } = contentRef.current.getBoundingClientRect();

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

	// On Ctrl/Cmd+Enter, hand the dialog to its primary action. A window
	// listener like the Escape one above, and for the same reason: the chord
	// must work from wherever focus happens to be — a text field, a checkbox,
	// nothing at all — not only when the dialog itself holds it.
	useEffect(function() {
		if (!onSubmitShortcut) return;

		function onKeydown(event: KeyboardEvent) {
			if (event.key !== "Enter" || !(event.ctrlKey || event.metaKey)) return;
			if (!ref.current || !ref.current.open) return;
			event.preventDefault();
			onSubmitShortcut?.();
		}

		window.addEventListener("keydown", onKeydown);
		return () => window.removeEventListener("keydown", onKeydown);

	}, [ ref, isOpen, onSubmitShortcut ]);

	return (
		<dialog
			className={ cn([
				// `max-h-full max-w-full` undoes the UA stylesheet, which caps a
				// modal dialog at `calc(100% - 6px - 2em)` — 38px short of the
				// viewport at a 16px root. The element is the flex box its card
				// centres in, so those 38px were centring the card in a box
				// shorter than the screen and parking it ~19px high; on a tall
				// phone that reads as a dialog visibly above centre.
				"p-0 bg-transparent overflow-visible focus:outline-0 transition-opacity transform-gpu backdrop:transform-gpu backdrop:transition-[backdrop-filter,background-color] w-full max-w-full justify-center open:flex h-full max-h-full fixed",
				isOpen ? "backdrop:bg-black/25 dark:backdrop:bg-black/50 opacity-100 backdrop:backdrop-blur" : "opacity-0 backdrop:backdrop-blur-0 backdrop:bg-transparent pointer-events-none",
				"items-center"
			]) }
			ref={ ref }
			{ ...props }>
			<Card
				className={ cn("shadow-2xl dark:shadow-black/20 drop-shadow-xl transition-transform transform-gpu overflow-visible", isOpen ? (isBouncing ? "scale-105" : "scale-100") : "scale-75", className) }
				ref={ contentRef }
				variant={ variant }>
				{ alwaysRender ? children : isOpen ? children : null }
			</Card>
		</dialog>
	);
}