"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { useConvergedRef, useEventMap, useFocusLost } from "nextui/hooks";
import { cn } from "nextui/util";
import { Children, createContext, type Dispatch, forwardRef, type HTMLAttributes, type InputHTMLAttributes, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Ripple } from "./Ripple";

export const classes = {
	tabs: cva("flex items-center group/tabs relative isolate", {
		defaultVariants: {
			variant: "vercel"
		},
		variants: {
			variant: {
				vercel: "gap-2 h-[46px]"
			}
		}
	}),

	tab: cva("text-sm rounded font-medium overflow-hidden relative not-motion-reduce:transition-colors outline-none truncate select-none", {
		defaultVariants: {
			variant: "vercel",
			color: "primary",
			disabled: false
		},
		variants: {
			disabled: {
				true: "cursor-not-allowed text-gray-600 dark:text-gray-400 pointer-events-none "
			},
			variant: {
				vercel: "px-3 h-8"
			},
			color: {
				primary: "[&.selected]:text-primary [&.hovered]:text-primary",
				"primary:pastel": "[&.selected]:text-primary dark:[&.selected]:text-primary-300 [&.hovered]:text-primary dark:[&.hovered]:text-primary-300",
				error: "[&.selected]:text-error [&.hovered]:text-error",
				"error:pastel": "[&.selected]:text-error dark:[&.selected]:text-error-300 [&.hovered]:text-error dark:[&.hovered]:text-error-300",
				success: "[&.selected]:text-success [&.hovered]:text-success",
				"success:pastel": "[&.selected]:text-success dark:[&.selected]:text-success-300 [&.hovered]:text-success dark:[&.hovered]:text-success-300",
				warning: "[&.selected]:text-warning [&.hovered]:text-warning",
				"warning:pastel": "[&.selected]:text-warning dark:[&.selected]:text-warning-300 [&.hovered]:text-warning dark:[&.hovered]:text-warning-300",
				neutral: "[&.selected]:text-gray-800 dark:[&.selected]:text-gray-200 [&.hovered]:text-gray-800 dark:[&.hovered]:text-gray-200"
			}
		}
	}),

	indicator: cva("absolute not-motion-reduce:transition-[left,width] z-10 pointer-events-none", {
		defaultVariants: {
			variant: "vercel",
			color: "primary"
		},
		variants: {
			variant: {
				vercel: "h-0.5 bottom-0 translate-y-px mx-3"
			},
			color: {
				primary: "bg-primary",
				"primary:pastel": "bg-primary dark:bg-primary-300",
				error: "bg-error",
				"error:pastel": "bg-error dark:bg-error-300",
				success: "bg-success",
				"success:pastel": "bg-success dark:bg-success-300",
				warning: "bg-warning",
				"warning:pastel": "bg-warning dark:bg-warning-300",
				neutral: "bg-gray-800 dark:bg-gray-200"
			}
		}
	}),

	background: cva("absolute -z-10 opacity-0", {
		defaultVariants: {
			variant: "vercel",
			color: "primary"
		},
		variants: {
			variant: {
				vercel: "h-8 rounded top-[7px] not-motion-reduce:transition-all"
			},
			color: {
				primary: "bg-primary/20",
				"primary:pastel": "bg-primary/20 dark:bg-primary-300/20",
				error: "bg-error/20",
				"error:pastel": "bg-error/20 dark:bg-error-300/20",
				success: "bg-success/20",
				"success:pastel": "bg-success/20 dark:bg-success-300/20",
				warning: "bg-warning/20",
				"warning:pastel": "bg-warning/20 dark:bg-warning-300/20",
				neutral: "bg-gray-800/20 dark:bg-gray-200/20"
			}
		}
	})
};
const TabContext = createContext({
	isSelected: false,
	isHovered: false,
	color: "primary" as "primary" | "primary:pastel" | "error" | "error:pastel" | "warning" | "warning:pastel" | "success" | "success:pastel" | "neutral",
	setSelected: (() => { }) as Dispatch<void>,
	setHovered: (() => { }) as Dispatch<void>
});

export const Tabs = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement> & VariantProps<(typeof classes)[keyof typeof classes]> & Partial<{

    /**
     * The color of the input
     * @default "primary"
     */
    color: "primary" | "primary:pastel" | "error" | "error:pastel" | "warning" | "warning:pastel" | "success" | "success:pastel" | "neutral";

}>>(function({ children, className, ...props }, fref) {

		// One ref holding every tab's node, filled by the callback refs below.
		// The old shape — Children.map(children, () => useRef(...)) — ran a
		// hook per child, which corrupts React's hook order the moment the
		// child count changes between renders (a conditional tab is enough).
		const tabsRef = useRef<(HTMLLIElement | null)[]>([]);
		tabsRef.current.length = Children.count(children);
		const indicator = useRef<HTMLDivElement>(null);
		const background = useRef<HTMLDivElement>(null);
		const ref = useConvergedRef(fref);

		const [ hovered, setHovered ] = useState(-1);
		const [ selected, setSelected ] = useState(0);

		useEventMap(ref, {
			mouseleave: () => setHovered(-1),
			focusout: () => setHovered(-1)
		});
		useFocusLost(ref, () => setHovered(-1));

		// Layout effects, both here and where a Tab claims `defaultChecked`:
		// the page arrives with the first tab marked and the indicator under
		// it, and the real selection lands a render later. As passive effects
		// that render came after a paint — one frame of the wrong tab lit, and
		// the indicator sliding over from it on every load. Before paint, the
		// first frame is already right.
		useLayoutEffect(function() {
			const tab = tabsRef.current[selected];
			if (!tab || !indicator.current) return;
			const { offsetLeft, clientWidth } = tab;
			const marginx = parseInt(getComputedStyle(indicator.current).marginRight);
			indicator.current.style.left = `${ offsetLeft }px`;
			indicator.current.style.width = `${ clientWidth - marginx * 2 }px`;
		}, [ selected, children ]);

		useEffect(function() {
			if (!background.current) return;

			if (hovered === -1) {
				background.current.style.transitionProperty = "opacity";
				background.current.style.opacity = "0";
				return;
			}

			const tab = tabsRef.current[hovered];
			if (!tab) return;

			const { offsetLeft, clientWidth } = tab;
			background.current.style.opacity = "1";
			background.current.style.left = `${ offsetLeft }px`;
			background.current.style.width = `${ clientWidth }px`;
			requestAnimationFrame(() => {
				if (!background.current) return;
				background.current.style.transitionProperty = "opacity, left, width";
			});
		}, [ hovered, children ]);

		return (
			<ul { ...props }
				className={ cn(classes.tabs(props), className) }
				ref={ ref }>

				<li className="absolute inset-0 pointer-events-none">

					{ /* Indicator */ }
					<div className={ cn(classes.indicator(props as VariantProps<typeof classes.indicator>)) } ref={ indicator } />

					{ /* Background */ }
					<div className={ cn(classes.background(props as VariantProps<typeof classes.background>)) } ref={ background } />

				</li>

				{ /* Tabs */ }
				{ Children.map(children, (child, key) => (
					<TabContext value={{
						isSelected: selected === key,
						isHovered: hovered === key,
						color: props.color || "primary",
						setSelected: () => setSelected(key),
						setHovered: () => setHovered(key)
					}}>
						<li
							key={ key }
							ref={ node => void (tabsRef.current[key] = node) }>
							{ child }
						</li>
					</TabContext>
				)) }
			</ul>

		);
	});

export const Tab = forwardRef<HTMLButtonElement, HTMLAttributes<HTMLButtonElement> & Pick<InputHTMLAttributes<HTMLButtonElement>, "disabled"> & Partial<{

    /**
     * The color of the input
     * @default "primary"
     */
    color: "primary" | "primary:pastel" | "error" | "error:pastel" | "warning" | "warning:pastel" | "success" | "success:pastel" | "neutral";
    
	/**
	 * Weather or not to show the ripple effect
	 * @default true
	 */
	ripple: boolean | Partial<{

		/**
		 * Weather or not to emit the ripple from the center of the element, or the props to pass to a <Ripple /> component
		 * @default false
		 */
		emitFromCenter: boolean;

		/**
		 * Custom class overrides
		 */
		className: string;

		/**
		 * Weather or not the ripple is disabled
		 * @default false
		 */
		disabled: boolean;

	}>;

}>>(function({ children, defaultChecked, className, ripple, ...props }, fref) {

	const ref = useConvergedRef(fref);
	const { isHovered, isSelected, setSelected, setHovered, color } = useContext(TabContext);
	// Only when the claim itself changes. `setSelected` is a fresh closure on
	// every render of Tabs, and as a dep it made this run on every hover —
	// re-selecting the tab the route says is current, which undid a click on
	// another tab until the navigation caught up, and in a scrolling row sent
	// it back to the old tab and out again to the new one. Read through a
	// ref, so the effect keys on `defaultChecked` alone.
	const select = useRef(setSelected);
	select.current = setSelected;
	useLayoutEffect(() => void (defaultChecked && select.current()), [ defaultChecked ]);

	props.color = color;

	useEventMap(ref, {
		mouseenter: () => props.disabled || setHovered(),
		focus: () => props.disabled || setHovered(),
		click: () => setSelected()
	});

	return (
		<button
			{ ...props }
			className={ cn(classes.tab(props as VariantProps<typeof classes.tab>), {
				"selected": isSelected,
				"hovered": isHovered
			}, className) }
			ref={ ref }
			tabIndex={ 0 }>

			{ /* Ripple */ }
			{ (props.disabled || (typeof ripple === "boolean" && !ripple)) || <Ripple className={ cn("opacity-10", typeof ripple === "object" && ripple.className) } { ...typeof ripple === "boolean" ? {} : ripple } /> }

			{ children }

		</button>
	);
});
