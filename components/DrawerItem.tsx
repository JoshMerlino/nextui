import { cva, type VariantProps } from "class-variance-authority";
import { useConvergedRef, useEventMap } from "nextui/hooks";
import { cn } from "nextui/util";
import { Children, createContext, forwardRef, useCallback, useContext, useEffect, useRef, useState, type HTMLAttributes, type InputHTMLAttributes } from "react";
import { Ripple } from "./Ripple";

export const classes = {
	group: cva([
		"flex flex-col items-center group/tabs relative isolate [&>li]:w-full"
	]),

	item: cva([
		"relative flex items-center overflow-hidden not-motion-reduce:transition-colors gap-4 text-sm font-medium px-5 text-gray-600 active:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50 hover:bg-gray-100 dark:active:bg-gray-700/50 w-full outline-0"
	], {

		variants: {
			size: {
				"default": "h-13 [&>svg]:w-6 [&>svg]:h-6",
				"dense": "h-10 [&>svg]:w-5 [&>svg]:h-5 [&>svg]:mx-0.5"
			},
			disabled: {
				true: "cursor-not-allowed text-gray-600 dark:text-gray-400 pointer-events-none"
			},
			color: {
				primary: "[&.selected]:text-primary [&.selected]:bg-primary/5 [&.selected]:hover:bg-primary/10",
				"primary:pastel": "[&.selected]:text-primary [&.selected]:bg-primary/5 dark:[&.selected]:text-primary-300 dark:[&.selected]:bg-primary-300/5 [&.selected]:hover:bg-primary/10 dark:[&.selected]:hover:bg-primary-300/10",
				error: "[&.selected]:text-error [&.selected]:bg-error/5 [&.selected]:hover:bg-error/10",
				"error:pastel": "[&.selected]:text-error [&.selected]:bg-error/5 dark:[&.selected]:text-error-300 dark:[&.selected]:bg-error-300/5 [&.selected]:hover:bg-error/10 dark:[&.selected]:hover:bg-error-300/10",
				success: "[&.selected]:text-success [&.selected]:bg-success/5 [&.selected]:hover:bg-success/10",
				"success:pastel": "[&.selected]:text-success [&.selected]:bg-success/5 dark:[&.selected]:text-success-300 dark:[&.selected]:bg-success-300/5 [&.selected]:hover:bg-success/10 dark:[&.selected]:hover:bg-success-300/10",
				warning: "[&.selected]:text-warning [&.selected]:bg-warning/5 [&.selected]:hover:bg-warning/10",
				"warning:pastel": "[&.selected]:text-warning [&.selected]:bg-warning/5 dark:[&.selected]:text-warning-300 dark:[&.selected]:bg-warning-300/5 [&.selected]:hover:bg-warning/10 dark:[&.selected]:hover:bg-warning-300/10",
				neutral: "[&.selected]:text-gray-800 dark:[&.selected]:text-gray-200 [&.selected]:bg-gray-800/5 dark:[&.selected]:bg-gray-200/5 [&.selected]:hover:bg-gray-800/10 dark:[&.selected]:hover:bg-gray-200/10"
			}
		},

		defaultVariants: {
			size: "default",
			color: "primary",
			disabled: false
		}

	}),

	indicator: cva("absolute not-motion-reduce:transition-[top,height] z-10 pointer-events-none", {
		defaultVariants: {
			variant: "default",
			color: "primary"
		},
		variants: {
			variant: {
				default: "w-1 left-0"
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
	})

};

const GroupContext = createContext({
	isSelected: false,
	color: "primary" as "primary" | "primary:pastel" | "error" | "error:pastel" | "warning" | "warning:pastel" | "success" | "success:pastel" | "neutral",

	/** This item's position in the group, passed rather than closed over so the
	 *  setter below can stay referentially stable. */
	index: -1,

	select: (() => { }) as (index: number, checked: boolean) => void
});

export const DrawerGroup = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement> & VariantProps<(typeof classes)[keyof typeof classes]> & Partial<{

	/**
     * The color of the input
     * @default "primary"
     */
	color: "primary" | "primary:pastel" | "error" | "error:pastel" | "warning" | "warning:pastel" | "success" | "success:pastel" | "neutral";

}>>(function({ children, className, ...props }, fref) {

	const tabsRef = Children.map(children, () => useRef<HTMLLIElement>(null));
	const indicator = useRef<HTMLDivElement>(null);
	const ref = useConvergedRef(fref);

	const [ selected, setSelected ] = useState(-1);

	/**
	 * Claim or release the group's one selected slot.
	 *
	 * Written as a functional update so the result does not depend on the order
	 * the items' effects happen to run in: an item releasing the slot can only
	 * clear it while it still holds it, so a sibling that has already claimed it
	 * is never wiped by the departing item running second.
	 */
	const select = useCallback((index: number, checked: boolean) => setSelected(current => checked ? index : current === index ? -1 : current), []);

	useEffect(function() {
		if (!indicator.current) return;
		const tab = tabsRef?.[selected]?.current;

		// Collapse when the group holds nothing, rather than leaving the bar parked
		// on whatever row was last active. A group the route has moved away from
		// has no current row to point at.
		if (!tab) {
			indicator.current.style.height = "0px";
			return;
		}

		const { offsetTop, clientHeight } = tab;
		indicator.current.style.top = `${ offsetTop }px`;
		indicator.current.style.height = `${ clientHeight }px`;
	}, [ selected, tabsRef ]);

	return (
		<ul { ...props }
			className={ cn(classes.group(props as VariantProps<typeof classes.group>), className) }
			ref={ ref }>

			<li className="absolute inset-0 pointer-events-none">

				{ /* Indicator */ }
				<div className={ cn(classes.indicator(props as VariantProps<typeof classes.indicator>)) } ref={ indicator } />

			</li>

			{ /* Tabs */ }
			{ Children.map(children, (child, key) => (
				<GroupContext value={{
					color: props.color || "primary",
					index: key,
					isSelected: selected === key,
					select
				}}>
					<li
						key={ key }
						ref={ tabsRef?.[key] }>
						{ child }
					</li>
				</GroupContext>
			)) }
		</ul>

	);
});

export const DrawerItem = forwardRef<HTMLButtonElement, HTMLAttributes<HTMLButtonElement> & Pick<InputHTMLAttributes<HTMLButtonElement>, "disabled"> & VariantProps<typeof classes.item> & Partial<{

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
	const { isSelected, color, index, select } = useContext(GroupContext);

	// `defaultChecked` is what a router-driven drawer binds to the current route,
	// so it has to deselect as well as select. Without the false branch a group
	// only ever heard which of ITS items had become active — so navigating to a
	// route owned by a different group left this one highlighting its old row,
	// with two rows lit at once.
	//
	// Depends on `defaultChecked` alone (index and select are stable), so an item
	// selected by a plain click is not cleared again on the next render.
	useEffect(() => select(index, !!defaultChecked), [ defaultChecked, index, select ]);

	useEventMap(ref, { click: () => select(index, true) });

	props.color ||= color;

	return (
		<button
			{ ...props }
			className={ cn(classes.item(props as VariantProps<typeof classes.item>), {
				"selected": isSelected
			}, className) }
			ref={ ref }
			tabIndex={ 0 }>

			{ /* Ripple */ }
			{ (props.disabled || (typeof ripple === "boolean" && !ripple)) || <Ripple className={ cn("opacity-10", typeof ripple === "object" && ripple.className) } { ...typeof ripple === "boolean" ? {} : ripple } /> }

			{ children }

		</button>
	);
});
