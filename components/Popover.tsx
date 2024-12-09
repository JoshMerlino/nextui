"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { merge } from "lodash";
import { useConvergedRef, useEvent, useFocusLost, useKeybind } from "nextui/hooks";
import { cn } from "nextui/util";
import { forwardRef, useCallback, useEffect, useState, type HTMLAttributes, type PropsWithChildren } from "react";

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
	 * @default true
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
}, forwarded) {

	// Open animation state
	const [ isVisible, setIsVisible ] = useState(false);
	const [ isStable, setIsStable ] = useState(false);

	// Combine forwarded ref with internal ref
	const ref = useConvergedRef(forwarded);

	// Reposition the dialog
	const reposition = useCallback(function() {
		const el = ref.current;
		if (!el) return;
		const wrapper = (el.closest(".group\\/popover-limit") || el?.parentNode) as HTMLElement;
		if (!isOpen) return;

		switch (position) {
			default:
			case "bottom": {
				el.style.left = `${ wrapper.getBoundingClientRect().left + wrapper.offsetWidth / 2 }px`;
				el.style.top = `${ wrapper.getBoundingClientRect().bottom }px`;
				break;
			}

			case "top": {
				el.style.left = `${ wrapper.getBoundingClientRect().left + wrapper.offsetWidth / 2 }px`;
				el.style.top = `${ wrapper.getBoundingClientRect().top - el.offsetHeight }px`;
				break;
			}

			case "left": {
				el.style.left = `${ wrapper.getBoundingClientRect().left - el.offsetWidth }px`;
				el.style.top = `${ wrapper.getBoundingClientRect().top + wrapper.offsetHeight / 2 }px`;
				break;
			}

			case "right": {
				el.style.left = `${ wrapper.getBoundingClientRect().right }px`;
				el.style.top = `${ wrapper.getBoundingClientRect().top + wrapper.offsetHeight / 2 }px`;
				break;
			}
		}

		// If the popover is in a limit group, ensure it stays within the group, it should alsso take up the full width of the group
		if (wrapper.classList.contains("group/popover-limit")) {
			const limit = wrapper.getBoundingClientRect();
			el.style.width = `${ limit.width + screenMargin * 2 }px`;
		}

		// Ensure popover stays on screen
		const rect = el.getBoundingClientRect();
		el.style.maxHeight = `${ window.innerHeight - (screenMargin * 2) }px`;
		if (rect.left < screenMargin) el.style.left = `${ parseFloat(el.style.left) - rect.left + screenMargin }px`;
		if (rect.right > window.innerWidth - screenMargin) el.style.left = `${ parseFloat(el.style.left) - (rect.right - window.innerWidth) - screenMargin }px`;
		if (rect.top < screenMargin) el.style.top = `${ parseFloat(el.style.top) - rect.top + screenMargin }px`;
		if (rect.bottom > window.innerHeight - screenMargin) el.style.top = `${ parseFloat(el.style.top) - (rect.bottom - window.innerHeight) - screenMargin }px`;

	}, [ ref, isOpen, position, screenMargin ]);

	// Close the dialog with animation
	const close = useCallback(function() {
		setIsVisible(false);
		setIsStable(false);
		setTimeout(() => {
			setOpen(false);
			ref.current?.close();
		}, duration);
	}, [ duration, ref, setOpen ]);

	// Open the dialog with animation
	const open = useCallback(function() {
		setIsStable(false);
		if (useModal) ref.current?.showModal();
		else ref.current?.show();
		reposition();
		setIsVisible(true);
		setTimeout(() => setIsStable(true), duration);
	}, [ duration, ref, reposition, useModal ]);

	// Close on blur and escape
	useKeybind("Escape", () => closeOnEscape && isOpen && close());

	useFocusLost(ref, () => closeOnBlur && isOpen && close());

	// On resize, reposition the dialog
	useEvent("resize", () => reposition());

	// Bind modal state to open prop
	useEffect(function() {
		if (isOpen && !ref.current?.open) open();
		else if (!isOpen && ref.current?.open) close();
	}, [ close, isOpen, open, ref ]);
	
	return (
		<dialog
			{ ...props }
			className={ cn(classes.popover(merge(props, { open: isOpen, position }) as VariantProps<typeof classes.popover>), isStable || "pointer-events-none") }
			ref={ ref }>
			<div
				className={ cn([
					"transition-[opacity,transform]",
					isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0",
					classes.animation({ position })
				]) }
				style={{ transitionDuration: `${ duration }ms` }}>
				{ children }
			</div>
		</dialog>
	);
});
