"use client";

import { usePathname } from "next/navigation";
import { cn } from "nextui/util";
import { Children, createContext, useCallback, useContext, useEffect, useRef, useState, type Dispatch, type PropsWithChildren, type RefObject, type SetStateAction } from "react";

export const TabsContext = createContext<{
	indicator: RefObject<HTMLDivElement> | null,
	background: RefObject<HTMLDivElement> | null,
	selected: number,
	setSelected: Dispatch<SetStateAction<number>>
}>({
	indicator: null,
	background: null,
	selected: -1,
	setSelected: () => {}
});

export const KeyContext = createContext(-1);

export function Tabs({ children }: PropsWithChildren) {
	const indicator = useRef<HTMLDivElement>(null);
	const background = useRef<HTMLDivElement>(null);
	const items = useRef<HTMLUListElement>(null);
	const [ selected, setSelected ] = useState(-1);
	const pathname = usePathname();

	const onMouseLeave = useCallback(function(event: React.MouseEvent<HTMLUListElement, MouseEvent>) {
		const slider = background.current;
		const target = event.target as HTMLUListElement;
		if (!slider || !target) return;
		slider.style.transitionProperty = "opacity";
		slider.style.opacity = "0";
		slider.addEventListener("transitionend", function() {
			slider.style.left = "auto";
			slider.style.right = "auto";
		}, { once: true });
	}, []);

	useEffect(function() {
		if (!indicator.current || !items.current) return;
		const slider = indicator.current;
		const target = items.current.querySelector(":nth-child(" + (selected + 1) + ")") as HTMLLIElement;
		if (!target) return;
		slider.style.left = `${ target.offsetLeft }px`;
		slider.style.right = `${ slider.parentElement!.offsetWidth - target.offsetLeft - target.offsetWidth }px`;
		slider.addEventListener("transitionend", function() {
			slider.style.opacity = "1";
		}, { once: true });
	}, [ selected ]);

	useEffect(function() {
		if (!items.current) return;
		const defaultTarget =
			items.current.querySelector(`a[href='${ pathname }']`) as HTMLLIElement ||
			items.current.querySelector(":first-child") as HTMLLIElement;

		// Get the index of the default target
		const index = Array.from(items.current.children).indexOf(defaultTarget);
		setSelected(index);
	}, [ pathname ]);

	return (
		<TabsContext.Provider value={{ indicator, background, selected, setSelected }}>
			<div className="relative isolate">
				<div
					className="absolute rounded bg-primary/10 pointer-events-none transition-[left,right,opacity] -z-10"
					ref={ background } />
				<div
					className="absolute bg-primary-700 dark:bg-primary-300 pointer-events-none h-0.5 transition-[left,right,opacity] -bottom-[1px]"
					ref={ indicator } />
				<ul
					className="flex items-center gap-1 group pb-2"
					onMouseLeave={ onMouseLeave }
					ref={ items }>
					{ Children.map(children, (child, key) => <KeyContext.Provider
						key={ key }
						value={ key }>
						{ child }
					</KeyContext.Provider>) }
				</ul>
			</div>
		</TabsContext.Provider>
	);
}

export function Tab({ children }: PropsWithChildren) {
	const { background, selected, setSelected } = useContext(TabsContext);
	const index = useContext(KeyContext);

	const onMouseMove = useCallback(function(event: React.MouseEvent<HTMLLIElement, MouseEvent>) {
		const slider = background?.current;
		const target = event.target instanceof HTMLLIElement ? event.target : (event.target as HTMLElement).closest("li") as HTMLLIElement;
		if (!slider || !target) return;
		slider.style.top = `${ target.offsetTop }px`;
		slider.style.height = `${ target.offsetHeight }px`;
		slider.style.opacity = "1";
		slider.style.left = `${ target.offsetLeft }px`;
		slider.style.right = `${ slider.parentElement!.offsetWidth - target.offsetLeft - target.offsetWidth }px`;
		slider.style.transitionProperty = "opacity, left, right";
	}, [ background ]);

	return (
		<li
			className={ cn(
				"uppercase font-medium text-sm rounded relative",
				"inline-flex items-center focus:outline-0 transition-colors duration-100",
				"active:bg-primary-700/10 dark:active:bg-primary-300/10 focus:bg-primary-700/10 dark:focus:bg-primary-300/10",
				selected === index ? "active text-primary-700 dark:text-primary-300" : "hover:text-primary-900 dark:hover:text-primary-100",
				"h-8 px-3"
			) }
			onClick={ () => setSelected(index) }
			onMouseMove={ onMouseMove }>
			{ children }
		</li>
	);
}
