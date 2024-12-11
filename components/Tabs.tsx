"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { ClassValue } from "clsx";
import { useConvergedRef, useEventMap, useFocusLost } from "nextui/hooks";
import { cn } from "nextui/util";
import { Children, createContext, type Dispatch, forwardRef, type HTMLAttributes, type InputHTMLAttributes, useContext, useEffect, useRef, useState } from "react";
import { Ripple } from "./Ripple";

export const classes = {
	tabs: cva("flex items-center group/tabs relative isolate", {
		defaultVariants: {
			variant: "vercel"
		},
		variants: {
			variant: {
				vercel: "gap-2 h-[46px]",
			},
		},
	}),

	tab: cva("text-sm rounded font-medium overflow-hidden relative transition-colors", {
		defaultVariants: {
			variant: "vercel",
			color: "primary",
			disabled: false
		},
		variants: {
			disabled: {
				true: "cursor-not-allowed text-gray-600 dark:text-gray-400 pointer-events-none",
			},
			variant: {
				vercel: "px-3 h-8",
			},
			color: {
				primary: "[&.selected]:text-primary hover:text-primary",
				"primary:pastel": "[&.selected]:text-primary-pastel dark:[&.selected]:text-primary-300 hover:text-primary-pastel dark:hover:text-primary-300",
				error: "[&.selected]:text-error hover:text-error",
				"error:pastel": "[&.selected]:text-error-pastel dark:[&.selected]:text-error-300 hover:text-error-pastel dark:hover:text-error-300",
				success: "[&.selected]:text-success hover:text-success",
				"success:pastel": "[&.selected]:text-success-pastel dark:[&.selected]:text-success-300 hover:text-success-pastel dark:hover:text-success-300",
				warning: "[&.selected]:text-warning hover:text-warning",
				"warning:pastel": "[&.selected]:text-warning-pastel dark:[&.selected]:text-warning-300 hover:text-warning-pastel dark:hover:text-warning-300",
				neutral: "[&.selected]:text-gray-800 dark:[&.selected]:text-gray-200 hover:text-gray-800 dark:hover:text-gray-200",
			}
		},
	}),

	indicator: cva("absolute transition-[left,width] z-10 pointer-events-none", {
		defaultVariants: {
			variant: "vercel",
			color: "primary"
		},
		variants: {
			variant: {
				vercel: "h-0.5 bottom-0 translate-y-px mx-3",
			},
			color: {
				primary: "bg-primary",
				"primary:pastel": "bg-primary-pastel dark:bg-primary-300",
				error: "bg-error",
				"error:pastel": "bg-error-pastel dark:bg-error-300",
				success: "bg-success",
				"success:pastel": "bg-success-pastel dark:bg-success-300",
				warning: "bg-warning",
				"warning:pastel": "bg-warning-pastel dark:bg-warning-300",
				neutral: "bg-gray-800 dark:bg-gray-200"
			},
		},
	}),

	background: cva("absolute -z-10 opacity-0", {
		defaultVariants: {
			variant: "vercel",
			color: "primary"
		},
		variants: {
			variant: {
				vercel: "h-8 rounded top-[7px] transition-all",
			},
			color: {
				primary: "bg-primary/20",
				"primary:pastel": "bg-primary-pastel/20 dark:bg-primary-300/20",
				error: "bg-error/20",
				"error:pastel": "bg-error-pastel/20 dark:bg-error-300/20",
				success: "bg-success/20",
				"success:pastel": "bg-success-pastel/20 dark:bg-success-300/20",
				warning: "bg-warning/20",
				"warning:pastel": "bg-warning-pastel/20 dark:bg-warning-300/20",
				neutral: "bg-gray-800/20 dark:bg-gray-200/20",
			}
		},
	})
};
const TabContext = createContext({
	isSelected: false,
	isHovered: false,
	setSelected: (() => { }) as Dispatch<void>,
	setHovered: (() => { }) as Dispatch<void>,
});

export const Tabs = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement> & VariantProps<(typeof classes)[keyof typeof classes]> & Partial<{

    /**
     * The color of the input
     * @default "primary"
     */
    color: "primary" | "primary:pastel" | "error" | "error:pastel" | "warning" | "warning:pastel" | "success" | "success:pastel" | "neutral";

}>>(function({ children, className, ...props }, fref) {

		// eslint-disable-next-line react-hooks/rules-of-hooks
		const tabsRef = Children.map(children, () => useRef<HTMLLIElement>(null));
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

		useEffect(function() {
			const tab = tabsRef?.[selected]?.current;
			if (!tab || !indicator.current) return;
			const { offsetLeft, clientWidth } = tab;
			const marginx = parseInt(getComputedStyle(indicator.current).marginRight);
			indicator.current.style.left = `${ offsetLeft }px`;
			indicator.current.style.width = `${ clientWidth - marginx * 2 }px`;
		}, [ selected, tabsRef ]);

		useEffect(function() {
			if (!background.current) return;

			if (hovered === -1) {
				background.current.style.transitionProperty = "opacity";
				background.current.style.opacity = "0";
				return;
			}

			const tab = tabsRef?.[hovered]?.current;
			if (!tab) return;

			const { offsetLeft, clientWidth } = tab;
			background.current.style.opacity = "1";
			background.current.style.left = `${ offsetLeft }px`;
			background.current.style.width = `${ clientWidth }px`;
			requestAnimationFrame(() => {
				if (!background.current) return;
				background.current.style.transitionProperty = "opacity, left, width";
			});
		}, [ hovered, tabsRef ]);

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
						setSelected: () => setSelected(key),
						setHovered: () => setHovered(key)
					}}>
						<li
							key={ key }
							ref={ tabsRef?.[key] }>
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
		className: string | ClassValue;

		/**
		 * Weather or not the ripple is disabled
		 * @default false
		 */
		disabled: boolean;

	}>;

}>>(function({ children, defaultChecked, className, ripple, ...props }, fref) {

	const ref = useConvergedRef(fref);
	const { isSelected, setSelected, setHovered } = useContext(TabContext);
	useEffect(() => void (defaultChecked && setSelected()), [ defaultChecked, setSelected ]);

	useEventMap(ref, {
		mouseenter: () => props.disabled || setHovered(),
		focus: () => props.disabled || setHovered(),
		click: () => setSelected()
	});

	return (
		<button
			{ ...props }
			className={ cn(classes.tab(props as VariantProps<typeof classes.tab>), className, isSelected && "selected") }
			ref={ ref }
			tabIndex={ 0 }>

			{ /* Ripple */ }
			{ (props.disabled || (typeof ripple === "boolean" && !ripple)) || <Ripple className={ cn("opacity-10", typeof ripple === "object" && ripple.className) } { ...typeof ripple === "boolean" ? {} : ripple } /> }

			{ children }

		</button>
	);
});
