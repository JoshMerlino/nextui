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
	 * When true, limit popover height to the viewport and enable internal scrolling.
	 * Useful for dropdowns rendered inside constrained containers.
	 */
	contained: boolean;

}>>>(function({
	children,
	closeOnBlur = true,
	closeOnEscape = true,
	duration = 200,
	position,
	screenMargin = 8,
	contained = false,
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
		const activeAnchor = (document.activeElement instanceof HTMLElement
			? document.activeElement.closest(".group\\/popover-constraint")
			: null) as HTMLElement | null;
		const wrapper = (el.parentElement?.closest(".group\\/popover-constraint")
			|| el.parentElement
			|| activeAnchor
			|| document.body) as HTMLElement;
		if (!isOpen) return;

		// Width first — it decides where a centred popover's left edge lands.
		// A popover in a limit group spans the full width of that group.
		if (wrapper.classList.contains("group/popover-constraint")) {
			el.style.width = `${ wrapper.getBoundingClientRect().width }px`;
		}

		if (contained) {
			const availableHeight = Math.max(window.innerHeight - (screenMargin * 2), 0);
			if (availableHeight > 0) el.style.setProperty("--popover-max-height", `${ availableHeight }px`);
			else el.style.removeProperty("--popover-max-height");
		} else {
			el.style.removeProperty("--popover-max-height");
		}

		// Where the popover's box should end up, in VIEWPORT coordinates.
		const anchor = wrapper.getBoundingClientRect();
		const target = (function() {
			switch (position) {
				default:
				case "bottom": return { left: anchor.left + anchor.width / 2 - el.offsetWidth / 2, top: anchor.bottom };
				case "top": return { left: anchor.left + anchor.width / 2 - el.offsetWidth / 2, top: anchor.top - el.offsetHeight };
				case "left": return { left: anchor.left - el.offsetWidth, top: anchor.top + anchor.height / 2 - el.offsetHeight / 2 };
				case "right": return { left: anchor.right, top: anchor.top + anchor.height / 2 - el.offsetHeight / 2 };
			}
		}());

		// Write the target, then measure and correct by the error.
		//
		// `position: fixed` resolves against the viewport ONLY while nothing above
		// establishes a containing block — but a transform, filter or
		// backdrop-filter on any ancestor (a blurred panel, say) creates one, and
		// then these viewport coordinates land offset by that ancestor's own
		// position. Since the offset is a constant, one measured round trip
		// recovers it without having to hunt for the culprit — and it folds in the
		// class-level translate at the same time.
		el.style.left = `${ target.left }px`;
		el.style.top = `${ target.top }px`;
		const placed = el.getBoundingClientRect();
		el.style.left = `${ target.left + (target.left - placed.left) }px`;
		el.style.top = `${ target.top + (target.top - placed.top) }px`;

		// Ensure popover stays on screen
		const rect = el.getBoundingClientRect();
		if (rect.left < screenMargin) el.style.left = `${ parseFloat(el.style.left) + (screenMargin - rect.left) }px`;
		else if (rect.right > window.innerWidth - screenMargin) el.style.left = `${ parseFloat(el.style.left) - (rect.right - (window.innerWidth - screenMargin)) }px`;
		if (rect.top < screenMargin) el.style.top = `${ parseFloat(el.style.top) + (screenMargin - rect.top) }px`;
		else if (rect.bottom > window.innerHeight - screenMargin) el.style.top = `${ parseFloat(el.style.top) - (rect.bottom - (window.innerHeight - screenMargin)) }px`;

	}, [ contained, ref, isOpen, position, screenMargin ]);

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
		requestAnimationFrame(() => reposition());
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
					"not-motion-reduce:transition-all",
					isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0",
					classes.animation({ position })
				]) }
				style={{
					...(contained ? {
						maxHeight: "var(--popover-max-height, calc(100vh - 16px))",
						overflowX: "hidden",
						overflowY: "auto"
					} : {}),
					transitionDuration: `${ duration }ms`
				}}>
				{ children }
			</div>
		</dialog>
	);
});
