"use client";

import { HTMLAttributes, useState } from "react";
import { MdChevronRight, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { cn } from "../util";
import { DrawerItem, ItemProps } from "./Item";

interface Props extends Partial<ItemProps> {

	/**
	 * The title of the group
	 */
	title: string;

	/**
	 * If the group is expanded by default
	 * @default false
	 */
	defaultExpanded?: boolean;

}

export function DrawerGroup({ children, defaultExpanded, title, ...props }: Props & HTMLAttributes<HTMLElement>) {

	// Initialize expanded state
	const [ isExpanded, setExpanded ] = useState(defaultExpanded === true);
	const toggle = () => setExpanded(a => !a);

	// If no icon, add icon
	if (!props.icon) props.icon = isExpanded ? MdOutlineKeyboardArrowDown : MdChevronRight;
	
	return (
		<div className="group/expandable">
			<DrawerItem { ...props } onClick={ toggle }>{title}</DrawerItem>
			<ul className={ cn("group expandable-content overflow-hidden ml-8 transition-[height] [&>li]:py-2", isExpanded ? "max-h-full" : "max-h-0") }>{children}</ul>
		</div>
	);
}