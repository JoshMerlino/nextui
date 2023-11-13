"use client";

import { Button } from "nextui/Button";
import { MouseEventHandler } from "react";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";

export function ToggleButton({
	isExpanded,
	onClick
}: {
	isExpanded: boolean,
	onClick: MouseEventHandler<HTMLButtonElement>
}) {
	return (
		<Button
			icon={ isExpanded ? MdOutlineExpandLess : MdOutlineExpandMore }
			iconPosition="after"
			onClick={ onClick }
			type="button">
			{ isExpanded ? "collapse" : "show all" }
		</Button>
	);
}
