"use client";

import { AdjustableHeight } from "nextui/AdjustableHeight";
import { useEvent } from "nextui/hooks";
import { PropsWithChildren, useRef, useState } from "react";
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
	const isExpanded = height !== defaultHeight;
	const ref = useRef<HTMLDivElement>(null);

	function getNaturalHeight() {
		if (!ref.current) return defaultHeight;
		const height = Array.from(ref.current.children).reduce((height, child) => height + child.getBoundingClientRect().height, 0);
		return height;
	}

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
			<div className="overflow-y-hidden relative bg-inherit mask transition-[padding]" style={{ paddingBottom: isExpanded ? shadowSize : 0 }}>
				<style>{`.mask{
				-webkit-mask-image: -webkit-linear-gradient(to top,black 0%, black calc(100% - ${ shadowSize }px), transparent 100%);
				mask-image: linear-gradient(to top,black 0%, black calc(100% - ${ shadowSize }px), transparent 100%);
				}`}</style>
				<AdjustableHeight deps={ [ height ] }>
					<div className="-mb-4 pb-4" ref={ ref } style={{ height }}>{children}</div>
				</AdjustableHeight>
			</div>
			<div className="flex justify-center transition-[margin,padding] z-10" style={{ marginTop: isExpanded ? -shadowSize : 0, paddingTop: isExpanded ? gap : 0 }}>
				<Button
					isExpanded={ isExpanded }
					onClick={ toggle } />
			</div>
		</div>
	);
}