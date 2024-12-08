"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { merge } from "lodash";
import { useEvent, useFocusLost, useKeybind } from "nextui/hooks";
import { cn } from "nextui/util";
import { forwardRef, useCallback, useEffect, useRef, useState, type HTMLAttributes, type MutableRefObject, type PropsWithChildren } from "react";

export const classes = {

	popover: cva([
		"fixed bg-transparent overflow-visible focus:outline-0 m-0 z-50",
		"backdrop:bg-transparent backdrop:hidden backdrop:pointer-events-none"
	], {
		defaultVariants: {
			position: "bottom",
		},
		variants: {
			position: {
				bottom: "-translate-x-1/2 -left-1/2 origin-top",
				top: "-translate-x-1/2 -left-1/2 origin-bottom",
				left: "-translate-y-1/2 -top-1/2 origin-right",
				right: "-translate-y-1/2 -top-1/2 origin-left",
			}
		}
	}),

	animation: cva(null, {
		defaultVariants: {
			position: "bottom",
		},
		variants: {
			position: {
				bottom: "origin-top",
				top: "origin-bottom",
				left: "origin-right",
				right: "origin-left",
			}
		}
	})

};

export const Popover = forwardRef<HTMLDialogElement, PropsWithChildren<Pick<HTMLAttributes<HTMLDivElement>, "className" | "style"> & {

    /**
     * The open state of the dialog.
     */
	state: Stateable<boolean>;

} & Partial<{

    /**
     * The side of the target to position the popover to.
     * @default "bottom"
     */
    position: "bottom" | "top" | "left" | "right";

    /**
     * Whether the popover should close when the target loses focus.
     * @default true
     */
    closeOnBlur: boolean;

    /**
     * Whether the popover should close when the escape key is pressed.
     * @default true
     */
    closeOnEscape: boolean;

    /**
     * The margin to keep the popover from the edge of the screen.
     * @default 8
     */
	screenMargin: number;
	
	/**
	 * Whether the popover should be a modal dialog.
	 * @default false
	 */
	useModal: boolean;

	/**
	 * The animation duration of the popover.
	 * @default 200
	 */
	duration: number;

}>>>(function({
	children,
	closeOnBlur = true,
	closeOnEscape = true,
	duration = 200,
	position,
	screenMargin = 8,
	state: [ isOpen, setOpen ],
	useModal = true,
	...props
}, ref) {

	// Open animation state
	const [ isVisible, setIsVisible ] = useState(false);
	const [ isStable, setIsStable ] = useState(false);

	// Combine forwarded ref with internal ref
	const internalRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const currentRef = internalRef.current;
		if (ref && typeof ref === "function") ref(currentRef);
		else if (ref) (ref as MutableRefObject<HTMLDialogElement | null>).current = currentRef;
	}, [ internalRef, ref ]);

	// Reposition the dialog
	const reposition = useCallback(function() {
		const ref = internalRef.current;
		if (!ref) return;
		const wrapper = (ref.closest(".group\\/popover-limit") || ref?.parentNode) as HTMLElement;
		if (!isOpen) return;

		switch (position) {
			default:
			case "bottom": {
				ref.style.left = `${ wrapper.getBoundingClientRect().left + wrapper.offsetWidth / 2 }px`;
				ref.style.top = `${ wrapper.getBoundingClientRect().bottom }px`;
				break;
			}

			case "top": {
				ref.style.left = `${ wrapper.getBoundingClientRect().left + wrapper.offsetWidth / 2 }px`;
				ref.style.top = `${ wrapper.getBoundingClientRect().top - ref.offsetHeight }px`;
				break;
			}

			case "left": {
				ref.style.left = `${ wrapper.getBoundingClientRect().left - ref.offsetWidth }px`;
				ref.style.top = `${ wrapper.getBoundingClientRect().top + wrapper.offsetHeight / 2 }px`;
				break;
			}

			case "right": {
				ref.style.left = `${ wrapper.getBoundingClientRect().right }px`;
				ref.style.top = `${ wrapper.getBoundingClientRect().top + wrapper.offsetHeight / 2 }px`;
				break;
			}
		}

		// If the popover is in a limit group, ensure it stays within the group, it should alsso take up the full width of the group
		if (wrapper.classList.contains("group/popover-limit")) {
			const limit = wrapper.getBoundingClientRect();
			ref.style.width = `${ limit.width + screenMargin * 2 }px`;
		}

		// Ensure popover stays on screen
		const rect = ref.getBoundingClientRect();
		ref.style.maxHeight = `${ window.innerHeight - (screenMargin * 2) }px`;
		if (rect.left < screenMargin) ref.style.left = `${ parseFloat(ref.style.left) - rect.left + screenMargin }px`;
		if (rect.right > window.innerWidth - screenMargin) ref.style.left = `${ parseFloat(ref.style.left) - (rect.right - window.innerWidth) - screenMargin }px`;
		if (rect.top < screenMargin) ref.style.top = `${ parseFloat(ref.style.top) - rect.top + screenMargin }px`;
		if (rect.bottom > window.innerHeight - screenMargin) ref.style.top = `${ parseFloat(ref.style.top) - (rect.bottom - window.innerHeight) - screenMargin }px`;

	}, [ position, isOpen, screenMargin ]);

	// Close the dialog with animation
	const close = useCallback(function() {
		setIsVisible(false);
		setIsStable(false);
		setTimeout(() => {
			setOpen(false);
			internalRef.current?.close();
		}, duration);
	}, [ duration, setOpen ]);

	// Open the dialog with animation
	const open = useCallback(function() {
		setIsStable(false);
		if (useModal) internalRef.current?.showModal();
		else internalRef.current?.show();
		reposition();
		setIsVisible(true);
		setTimeout(() => setIsStable(true), duration);
	}, [ duration, reposition, useModal ]);

	// Close on blur and escape
	useFocusLost(internalRef, () => closeOnBlur && isOpen && close());
	useKeybind("Escape", () => closeOnEscape && isOpen && close());

	// On resize, reposition the dialog
	useEvent("resize", () => reposition());

	// Bind modal state to open prop
	useEffect(function() {
		if (isOpen && !internalRef.current?.open) open();
		else if (!isOpen && internalRef.current?.open) close();
	}, [ close, isOpen, open ]);
	
	return (
		<dialog
			{ ...props }
			className={ cn(classes.popover(merge(props, { open: isOpen, position }) as VariantProps<typeof classes.popover>), isStable || "pointer-events-none") }
			ref={ internalRef }>
			<div
				className={ cn(
					"transition-[opacity,transform]",
					isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0",
					classes.animation({ position })
				) }
				style={{ transitionDuration: `${ duration }ms` }}>
				{ children }
			</div>
		</dialog>
	);
});
