"use client";

import { ClassValue } from "clsx";
import { PropsWithChildren, ReactNode, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { cn } from "nextui/util";

interface Props {

	/**
	 * The tooltip content
	 */
	tooltip?: ReactNode;

	/**
	 * The tooltip itsself
	 */
	element?: ReactNode;

	/**
	 * The anchor position of the tooltip
	 * (this is the side of the tooltip that is attached to the target)
	 * @default "top"
	 */
	anchor?: "top" | "bottom" | "left" | "right";

	/**
	 * Render the bubble into `document.body` instead of beside the target.
	 *
	 * The default is an absolutely positioned sibling, which is cheap and needs no
	 * JavaScript — and which any ancestor with `overflow` other than `visible`
	 * will clip. That is not a rare situation: a scrolling panel, a table with a
	 * horizontal scroller, a card with rounded corners and `overflow-hidden` all
	 * cut the bubble off at their own edge, and the deeper the target sits the
	 * more likely one of them is in the way.
	 *
	 * With this set the bubble leaves the tree entirely and is positioned against
	 * the viewport, so nothing between it and the body can clip it. The cost is
	 * that hover becomes stateful — the CSS-only path can't reach across a portal
	 * — so it is opt-in rather than the default.
	 *
	 * @default false
	 */
	portal?: boolean;

	/**
	 * Custom classnames to apply to the tooltip
	 */
	className?: ClassValue;

	/**
	 * The element the tooltip hangs on.
	 *
	 * A `span` for a tooltip inside phrasing content — inside a `<button>`, most
	 * often, where a div is invalid and browsers close the button around it.
	 * Inline by default then, so give it `inline-flex` if it wraps something with
	 * a size.
	 *
	 * @default "div"
	 */
	as?: "div" | "span";

}

/** Where the bubble goes when it is positioned against the viewport rather than
 *  against the target. The transform does the centring, so only the target's own
 *  edge has to be measured. */
export function place(anchor: NonNullable<Props["anchor"]>, rect: DOMRect): CSSProperties {
	switch (anchor) {
		case "bottom": return { top: rect.top, left: rect.left + rect.width / 2, transform: "translate(-50%, calc(-100% - 0.5rem))" };
		case "left": return { top: rect.top + rect.height / 2, left: rect.right, transform: "translate(0.5rem, -50%)" };
		case "right": return { top: rect.top + rect.height / 2, left: rect.left, transform: "translate(calc(-100% - 0.5rem), -50%)" };
		default: return { top: rect.bottom, left: rect.left + rect.width / 2, transform: "translate(-50%, 0.5rem)" };
	}
}

/**
 * The portalled bubble's classes, on their own, for anything that draws the
 * same bubble without going through {@link Tooltip}: the global `title`
 * tooltips, which hang one off whatever element the pointer is over.
 */
export function bubbleClassName(anchor: NonNullable<Props["anchor"]> = "top") {
	return cn(
		"inline-flex items-center normal-case tracking-normal transition-all z-[100]",
		"pointer-events-none not-motion-reduce:animate-bubble-in",
		{
			"origin-top": anchor === "top",
			"origin-bottom": anchor === "bottom",
			"origin-left": anchor === "left",
			"origin-right": anchor === "right"
		},
		"min-h-6 px-2 py-1 text-xs font-medium text-white rounded-md select-none bg-neutral-500 dark:bg-neutral-700 w-max max-w-64 text-pretty"
	);
}

export function Tooltip({ tooltip, anchor = "top", as = "div", children, className, element, portal }: PropsWithChildren<Props>) {

	if (!tooltip && !element) throw new Error("You must provide either a tooltip or an element to render as the tooltip");

	// Widened from HTMLDivElement now that the target can be a span. Only ever
	// read for getBoundingClientRect, which every element has.
	const target = useRef<HTMLDivElement & HTMLSpanElement>(null);

	// Only ever set on the portal path — the default one is pure CSS and has no
	// state at all, which is the reason it is still the default.
	const [ at, setAt ] = useState<ReturnType<typeof place> | null>(null);

	// Measured as the pointer arrives rather than on a scroll listener: the bubble
	// lives as long as the hover does, and anything that would move the target out
	// from under it (a scroll, a resize) has already ended the hover.
	function show() {
		const rect = target.current?.getBoundingClientRect();
		if (rect) setAt(place(anchor, rect));
	}

	// Record of classnames to apply based on props
	const classes: ClassValue[] = [

		// Base classnames
		"group/tooltip relative isolate hover:z-[10]",

		// Custom classs
		className

	];

	// Tooltip classes
	const tooltipClasses: ClassValue[] = [

		// Base classnames.
		//
		// `normal-case` and `tracking-normal` are not styling — they are insulation.
		// The bubble is an ordinary child of whatever the tooltip wraps, so text
		// transforms inherit into it, and these get attached to small-caps labels
		// (a KPI tile's heading, a table header) whose `uppercase tracking-wider`
		// turned an explanatory sentence into SHOUTED SPACED OUT PROSE. A tooltip is
		// a sentence and should read as one wherever it is hung.
		"inline-flex items-center normal-case tracking-normal transition-all z-[100]",

		// Portalled, the bubble is mounted only while it is wanted, so it has no
		// hidden state to transition out of — the entrance is a keyframe that runs
		// on the frame it first renders. The placement's transform lives on a
		// wrapper (see below), so the bubble's own origin is the edge it hangs
		// from and the scale grows out of that edge rather than a corner.
		portal ? [
			"pointer-events-none not-motion-reduce:animate-bubble-in",
			{
				"origin-top": anchor === "top",
				"origin-bottom": anchor === "bottom",
				"origin-left": anchor === "left",
				"origin-right": anchor === "right"
			}
		] : [
			"absolute scale-0 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100",
			{
				"top-full origin-top my-2 mx-auto left-1/2 -translate-x-1/2": anchor === "top",
				"bottom-full origin-bottom my-2 mx-auto left-1/2 -translate-x-1/2": anchor === "bottom",
				"left-full origin-left mx-2 my-auto top-1/2 -translate-y-1/2": anchor === "left",
				"right-full origin-right mx-2 my-auto top-1/2 -translate-y-1/2": anchor === "right"
			}
		]
	];

	/* Wraps rather than running off the screen: a tooltip that explains something
	   is a sentence, not a label. `min-h-6` + `py-1` keeps a one-line tooltip
	   exactly the height the fixed `h-6` gave it, so nothing that already fit
	   changes.

	   `w-max` is what makes `max-w-64` mean anything: absolutely positioned, the
	   tooltip shrinks to fit its CONTAINING BLOCK, so inside a narrow cell it
	   collapsed to about one word per line. */
	const bubble = (
		<div className={ element ? cn(tooltipClasses) : cn(tooltipClasses, "min-h-6 px-2 py-1 text-xs font-medium text-white rounded-md select-none bg-neutral-500 dark:bg-neutral-700 w-max max-w-64 text-pretty pointer-events-none") }>
			{ element ?? tooltip }
		</div>
	);

	// The portal's placement, on an element of its own. A transform-origin is
	// applied around an element's WHOLE transform, so with the centring
	// translate and the entrance's scale on one element the point that held
	// still under the scale was a corner of the bubble, and every tooltip grew
	// in from its top right. With the translate out here, the bubble inside
	// scales about its own anchored edge.
	const placed = (
		<div
			className="fixed z-[100] pointer-events-none"
			style={ at ?? undefined }>
			{ bubble }
		</div>
	);

	// A div by default, because that is what every existing caller lays out
	// against. `as="span"` is for the callers that cannot have one: a tooltip
	// hung inside a <button> — a details group's header, say — would otherwise be
	// flow content inside phrasing content, which is invalid and which browsers
	// resolve by closing the button early.
	const Element = as;

	return (
		<Element
			className={ cn(classes) }
			onBlur={ portal ? () => setAt(null) : undefined }
			onFocus={ portal ? show : undefined }
			onMouseEnter={ portal ? show : undefined }
			onMouseLeave={ portal ? () => setAt(null) : undefined }
			ref={ target }>
			{ children }
			{ portal ? at && createPortal(placed, document.body) : bubble }
		</Element>
	);
}
