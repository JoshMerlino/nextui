"use client";

import { Children, createContext, type PropsWithChildren, type RefObject, useCallback, useEffect, useRef, useState } from "react";
export { Tab } from "./Tab";

// eslint-disable-next-line @typescript-eslint/no-unused-vars, func-call-spacing
export const TabsContext = createContext<[number | null, (val: number) => void]>([ -1, (_index: number) => { } ]);
export const IndexContext = createContext(-1);
export const IndicatorContext = createContext<RefObject<HTMLLIElement> | null>(null);

export function Tabs({ children }: Readonly<PropsWithChildren>) {

	const indicator = useRef<HTMLLIElement>(null);
	const hover = useRef<HTMLLIElement>(null);

	const [ selected, setSelected ] = useState<number | null>(null);

	useEffect(function() {
		const slider = indicator.current;
		if (selected === null) return;
		const target = indicator.current?.parentElement?.children[selected] as HTMLElement;
		if (!slider || !target) return;
		slider.style.left = `${ target.offsetLeft }px`;
		slider.style.width = `${ target.offsetWidth - 20 }px`;
		slider.style.transitionProperty = "left, width";
	}, [ selected ]);

	const onMouseMove = useCallback(function(event: React.MouseEvent<HTMLLIElement, MouseEvent> | React.FocusEvent<HTMLLIElement>) {
		const slider = hover.current;
		const target = event.target instanceof HTMLLIElement ? event.target : (event.target as HTMLElement).closest("li") as HTMLLIElement;
		if (!slider || !target) return;
		slider.style.top = `${ target.offsetTop }px`;
		slider.style.height = `${ target.offsetHeight }px`;
		slider.style.opacity = "1";
		slider.style.left = `${ target.offsetLeft }px`;
		slider.style.right = `${ slider.parentElement!.offsetWidth - target.offsetLeft - target.offsetWidth }px`;
		slider.style.transitionProperty = "opacity, left, right";
	}, []);

	const onMouseLeave = useCallback(function(event: React.MouseEvent<HTMLUListElement, MouseEvent>) {
		const slider = hover.current;
		const target = event.target as HTMLUListElement;
		if (!slider || !target) return;
		slider.style.transitionProperty = "opacity";
		slider.style.opacity = "0";
		slider.addEventListener("transitionend", function() {
			slider.style.left = "auto";
			slider.style.right = "auto";
		}, { once: true });
	}, []);

	const onBlur = useCallback(function(event: React.FocusEvent<HTMLUListElement>) {
		const slider = hover.current;
		if (!slider) return;
		if (event.target.contains(event.relatedTarget)) return;
		if (event.currentTarget.contains(event.relatedTarget)) return;
		slider.style.transitionProperty = "opacity";
		slider.style.opacity = "0";
	}, []);

	return (
		<TabsContext.Provider value={ [ selected, setSelected ] }>
			<IndicatorContext.Provider value={ indicator }>
				<ul
					className="border-b border-gray-200 dark:border-gray-750 inline-flex self-start relative isolate w-full md:w-auto"
					onBlurCapture={ onBlur }
					onMouseLeave={ onMouseLeave }>
					{ Children.map(children, (child, key) => (
						<IndexContext.Provider
							key={ key }
							value={ key }>
							<li
								className="w-full md:w-auto flex"
								onFocusCapture={ onMouseMove }
								onMouseMove={ onMouseMove }>{ child }</li>
						</IndexContext.Provider>
					)) }
					<li className="h-[3px] bg-primary rounded-full bottom-0 absolute transition-all translate-y-[2px] mx-2.5" ref={ indicator } />
					<li className="absolute bg-gray-200 dark:bg-gray-700/25 rounded -z-10 -translate-y-1 transition-all" ref={ hover } />
				</ul>
			</IndicatorContext.Provider>
		</TabsContext.Provider>
	);
}

