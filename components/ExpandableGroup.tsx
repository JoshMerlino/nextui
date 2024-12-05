"use client";

import { merge } from "lodash";
import { AdjustableHeight } from "nextui/AdjustableHeight";
import { Button as NextUIButton } from "nextui/Button";
import { useEvent } from "nextui/hooks";
import { cn } from "nextui/util";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type MouseEventHandler } from "react";
import { MdChevronLeft } from "react-icons/md";

function ToggleButton({ isExpanded, onClick }: { isExpanded: boolean, onClick: MouseEventHandler<HTMLButtonElement> }) {
	return (
		<NextUIButton
			className="w-12 h-12 rounded-full text-2xl"
			color="primary:pastel"
			onClick={ onClick }
			type="button">
			<MdChevronLeft className={ cn("transition-transform shrink-0", isExpanded ? "rotate-90" : "-rotate-90") } />
		</NextUIButton>
	);
}

export default function ExpandableGroup({
	button: Button = ToggleButton,
	children,
	defaultHeight = 300,
	shadowSize = 64,
	className,
	...props
}: HTMLAttributes<HTMLDivElement> & Partial<{
	button?: (props: { isExpanded: boolean; onClick: () => void; }) => JSX.Element,
	defaultHeight?: number,
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
		setButtonHidden(naturalHeight < containerHeight + 20);
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
		<div className={ cn("flex flex-col bg-inherit", className) } { ...props }>
			<div className={ cn("relative bg-inherit transition-[padding]", isExpanded || "overflow-y-hidden") }
				style={ merge({ paddingBottom: !buttonHidden ? shadowSize : 0 },
					buttonHidden || {
						WebkitMaskImage: `-webkit-linear-gradient(top, black 0%, black calc(100% - ${ shadowSize }px), transparent 100%)`,
						maskImage: `linear-gradient(top, black 0%, black calc(100% - ${ shadowSize }px), transparent 100%)`,
					} satisfies CSSProperties) }>
				<AdjustableHeight deps={ [ height ] }>
					<div
						ref={ ref }
						style={{ maxHeight: buttonHidden ? "auto" : height }}>{ children }</div>
				</AdjustableHeight>
			</div>
			<div
				className={ cn("flex justify-center transition-[margin,transform,opacity] z-10", {
					"pointer-events-none opacity-0": buttonHidden,
					"-translate-y-1/2": !isExpanded && !buttonHidden,
					"sticky bottom-12 xl:bottom-12": isExpanded
				}) }
				style={{ marginTop: (isExpanded || buttonHidden) ? -shadowSize / 2 : 0 }}>
				<Button
					isExpanded={ isExpanded }
					onClick={ toggle } />
			</div>
		</div>
	);
}