"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { merge } from "lodash";
import { useConvergedRef, useEvent, useFocusLost, useKeybind } from "nextui/hooks";
import { cn } from "nextui/util";
import { forwardRef, useCallback, useEffect, useState, type HTMLAttributes, type PropsWithChildren } from "react";

export const classes = {

	popover: cva([
		"absolute bg-transparent overflow-visible focus:outline-0 m-0 z-50",
		"backdrop:bg-transparent backdrop:hidden backdrop:pointer-events-none"
	], {
		defaultVariants: {
			position: "bottom"
		},
		variants: {
			position: {
				bottom: "-translate-x-1/2 -left-1/2 origin-top",
				top: "-translate-x-1/2 -left-1/2 origin-bottom",
				left: "-translate-y-1/2 -top-1/2 origin-right",
				right: "-translate-y-1/2 -top-1/2 origin-left",
				"bottom-left": "-translate-x-1/2 -left-1/2 origin-top-right",
				"bottom-right": "-translate-x-1/2 -left-1/2 origin-top-left",
				"top-left": "-translate-x-1/2 -left-1/2 origin-bottom-right",
				"top-right": "-translate-x-1/2 -left-1/2 origin-bottom-left"
			}
		}
	}),

	animation: cva(null, {
		defaultVariants: {
			position: "bottom"
		},
		variants: {
			position: {
				bottom: "origin-top",
				top: "origin-bottom",
				left: "origin-right",
				right: "origin-left",
				"bottom-left": "origin-top-right",
				"bottom-right": "origin-top-left",
				"top-left": "origin-bottom-right",
				"top-right": "origin-bottom-left"
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
    position: "bottom" | "top" | "left" | "right" | `${ "bottom" | "top" }-${ "left" | "right" }`;

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

	/**
	 * Props for the animation wrapper div.
	 * This can be used to customize the animation further.
	 */
	animationProps: HTMLAttributes<HTMLDivElement>;

	/**
	 * Prevent the popover from repositioning vertically when it would overflow the viewport.
	 * Useful for dropdown menus that should only render beneath their trigger.
	 */
	lockVertical: boolean;

}>>>(function({
	children,
	closeOnBlur = true,
	closeOnEscape = true,
	duration = 200,
	position,
	animationProps,
	screenMargin = 8,
	lockVertical = false,
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
		const wrapper = (el.closest(".group\\/popover-constraint") || el?.parentNode) as HTMLElement;
		if (!isOpen) return;
		const resolvedPosition = position || "bottom";

		switch (position) {
			default:
			case "bottom": {
				el.style.left = `${ wrapper.getBoundingClientRect().width / 2 }px`;
				el.style.top = `${ wrapper.getBoundingClientRect().height }px`;
				break;
			}

			case "top": {
				el.style.left = `${ wrapper.getBoundingClientRect().width / 2 }px`;
				el.style.top = "0px";
				break;
			}

			case "left": {
				el.style.left = "0px";
				el.style.top = `${ wrapper.getBoundingClientRect().height / 2 }px`;
				break;
			}

			case "right": {
				el.style.left = `${ wrapper.getBoundingClientRect().width }px`;
				el.style.top = `${ wrapper.getBoundingClientRect().height / 2 }px`;
				break;
			}
		}

		// If the popover is in a limit group, ensure it stays within the group, it should alsso take up the full width of the group
		if (wrapper.classList.contains("group/popover-constraint")) {
			const limit = wrapper.getBoundingClientRect();
			el.style.width = `${ limit.width }px`;
		}

		// Ensure popover stays on screen
		const rect = el.getBoundingClientRect();
		const isBottomAligned = resolvedPosition.startsWith("bottom");
		const baseMaxHeight = lockVertical && isBottomAligned
			? Math.max(window.innerHeight - rect.top - screenMargin, 0)
			: Math.max(window.innerHeight - (screenMargin * 2), 0);
		if (baseMaxHeight > 0) el.style.setProperty("--popover-max-height", `${ baseMaxHeight }px`);
		else el.style.removeProperty("--popover-max-height");
		const adjustedRect = el.getBoundingClientRect();
		if (adjustedRect.left < screenMargin) el.style.left = `${ parseFloat(el.style.left) - adjustedRect.left + screenMargin }px`;
		if (adjustedRect.right > window.innerWidth - screenMargin) el.style.left = `${ parseFloat(el.style.left) - (adjustedRect.right - window.innerWidth) - screenMargin }px`;
		if (!lockVertical) {
			if (adjustedRect.top < screenMargin) el.style.top = `${ parseFloat(el.style.top) - adjustedRect.top + screenMargin }px`;
			if (adjustedRect.bottom > window.innerHeight - screenMargin) el.style.top = `${ parseFloat(el.style.top) - (adjustedRect.bottom - window.innerHeight) - screenMargin }px`;
		}

	}, [ ref, isOpen, lockVertical, position, screenMargin ]);

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
				{ ...animationProps }
				className={ cn([
					"not-motion-reduce:transition-all",
					isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0",
					classes.animation({ position })
				], animationProps?.className) }
				style={{
					...animationProps?.style,
					maxHeight: "var(--popover-max-height, calc(100vh - 16px))",
					overflowX: "hidden",
					overflowY: "auto",
					transitionDuration: `${ duration }ms`
				}}>
				{ children }
			</div>
		</dialog>
	);
});
