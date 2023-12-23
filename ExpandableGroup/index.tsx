"use client";

import { AdjustableHeight } from "nextui/AdjustableHeight";
import { useEvent } from "nextui/hooks";
import { cn } from "nextui/util";
import { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import { ToggleButton } from "./ToggleButton";

export default function ExpandableGroup({
	button: Button = ToggleButton,
	children,
	defaultHeight = 500,
	gap = 16,
	shadowSize = 64,
}: PropsWithChildren<{
	button?: (props: { isExpanded: boolean; onClick: () => void; }) => JSX.Element,
	defaultHeight?: number,
	gap?: number,
	shadowSize?: number,
}>) {
	const [ height, setHeight ] = useState<number | undefined>(defaultHeight);
	const [ buttonHidden, setButtonHidden ] = useState(false);
	const isExpanded = height !== defaultHeight;
	const ref = useRef<HTMLDivElement>(null);

	const getNaturalHeight = useCallback(function() {
		if (!ref.current) return defaultHeight;
		const height = Array.from(ref.current.children).reduce((height, child) => height + child.getBoundingClientRect().height, 0);
		return height;
	}, [ defaultHeight ]);

	const getContainerHeight = useCallback(function() {
		if (!ref.current) return defaultHeight;
		const { height } = ref.current.getBoundingClientRect();
		return height;
	}, [ defaultHeight ]);
	
	useEffect(function() {
		if (!ref.current) return;
		const naturalHeight = getNaturalHeight();
		const containerHeight = getContainerHeight();
		setButtonHidden(naturalHeight < containerHeight);
	}, [ getNaturalHeight, getContainerHeight ]);

	function toggle() {
		if (!ref.current) return;
		const naturalHeight = getNaturalHeight();
		if (height === naturalHeight) setHeight(defaultHeight);
		else setHeight(naturalHeight);
	}

	useEvent("resize", function() {
		if (!ref.current) return;
		if (height === defaultHeight) return;
		const naturalHeight = getNaturalHeight();
		setHeight(naturalHeight);
	});

	return (
		<div className="flex flex-col bg-inherit isolate">
			<div className={ cn("overflow-y-hidden relative bg-inherit transition-[padding]", !buttonHidden && "mask") } style={{ paddingBottom: (isExpanded && !buttonHidden) ? shadowSize : 0 }}>
				<style>{`.mask{
				-webkit-mask-image: -webkit-linear-gradient(top,black 0%, black calc(100% - ${ shadowSize }px), transparent 100%);
				mask-image: linear-gradient(top,black 0%, black calc(100% - ${ shadowSize }px), transparent 100%);
				}`}</style>
				<AdjustableHeight deps={ [ height ] }>
					<div className="-mb-4 pb-4" ref={ ref } style={{ maxHeight: height }}>{children}</div>
				</AdjustableHeight>
			</div>
			<div className={ cn("flex justify-center transition-[margin,padding,opacity] z-10") } style={{
				marginTop: (isExpanded || buttonHidden) ? -shadowSize : 0,
				paddingTop: (isExpanded || buttonHidden) ? gap : 0,
				opacity: buttonHidden ? 0 : 1
			}}>
				<Button
					isExpanded={ isExpanded }
					onClick={ toggle } />
			</div>
		</div>
	);
}