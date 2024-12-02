"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { merge, omit } from "lodash";
import { useEvent, useFocusLost, useKeybind } from "nextui/hooks";
import { cn } from "nextui/util";
import { forwardRef, useCallback, useEffect, useRef, useState, type HTMLAttributes, type MutableRefObject, type PropsWithChildren } from "react";

export const classes = {

	popover: cva([
		"absolute bg-transparent overflow-visible focus:outline-0 m-0",
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

}>>>(function({ children, screenMargin = 8, position, state: [ open, setOpen ], closeOnBlur = true, closeOnEscape = true, ...props }, ref) {

	// Open animation state
	const [ isOpening, setIsOpening ] = useState(false);

	// Combine forwarded ref with internal ref
	const internalRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const currentRef = internalRef.current;
		if (ref && typeof ref === "function") ref(currentRef);
		else if (ref) (ref as MutableRefObject<HTMLDialogElement | null>).current = currentRef;
	}, [ internalRef, ref ]);
    
	// Close the dialog
	const close = useCallback(function() {
		setIsOpening(false);
		internalRef.current?.childNodes[0].addEventListener("transitionend", function() {
			if (open) setOpen(false);
		}, { once: true });
	}, [ open, setOpen ]);

	// Close on blur and escape
	useFocusLost(internalRef, () => closeOnBlur && open && close());
	useKeybind("Escape", () => closeOnEscape && open && close());

	// On resize, reposition the dialog
	useEvent("resize", () => reposition());

	// Reposition the dialog
	const reposition = useCallback(function() {
		const ref = internalRef.current;
		if (!ref) return;
		const wrapper = ref?.parentNode as HTMLElement;
		if (!open) return;

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
        
		// Now determine if the popover is offscreen and translate it back onscreen
		const rect = ref.getBoundingClientRect();
		if (rect.left < screenMargin) ref.style.left = `${ parseFloat(ref.style.left) - rect.left + screenMargin }px`;
		if (rect.right > window.innerWidth - screenMargin) ref.style.left = `${ parseFloat(ref.style.left) - (rect.right - window.innerWidth) - screenMargin }px`;
		if (rect.top < screenMargin) ref.style.top = `${ parseFloat(ref.style.top) - rect.top + screenMargin }px`;
		if (rect.bottom > window.innerHeight - screenMargin) ref.style.top = `${ parseFloat(ref.style.top) - (rect.bottom - window.innerHeight) - screenMargin }px`;

	}, [ position, open, screenMargin ]);
    
	// Bind modal state to open prop
	useEffect(function() {
		const ref = internalRef.current;
		if (!ref) return;
		if (!open) return ref.close();
		ref.showModal();
		reposition();
		setIsOpening(true);
	}, [ position, open, ref, reposition, screenMargin ]);

	return (
		<dialog
			{ ...omit(props, "open") }
			className={ cn(classes.popover(merge(props, { open, position }) as VariantProps<typeof classes.popover>)) }
			ref={ internalRef }>
			<div className={ cn(isOpening ? "opacity-100 scale-100" : "opacity-0 scale-90", "transition-[opacity,transform]", classes.animation({ position })) }>
				{ children }
			</div>
		</dialog>
	);
});