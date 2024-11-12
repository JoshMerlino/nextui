"use client";
import { cn } from "nextui/util";
import { type HTMLAttributes, useContext, useEffect, useMemo } from "react";
import { IndexContext, IndicatorContext, TabsContext } from ".";

export function Tab({ children, defaultChecked, onClick, ...props }: HTMLAttributes<HTMLButtonElement>) {

	const index = useContext(IndexContext);
	const [ selected, setSelected ] = useContext(TabsContext);

	const active = useMemo(() => selected === index, [ selected, index ]);
	const indicator = useContext(IndicatorContext);

	useEffect(function() {
		if (defaultChecked && indicator?.current) {
			indicator.current.style.transitionProperty = "none";
			setSelected(index);
			indicator.current.style.transitionProperty = "left, width";
		}
	}, [ defaultChecked, index, indicator, setSelected ]);

	return (
		<button
			className={ cn("w-full mx-1 px-2.5 font-semibold text-gray-400 pb-2.5 select-none text-center transition-colors cursor-pointer outline-0 truncate", active ? "text-gray-800 dark:text-gray-200" : "hover:text-gray-500 dark:hover:text-gray-300") }
			onClick={ e => [ setSelected(index), onClick?.(e) ] }
			{ ...props }>
			{ children }
		</button>
	);
}
