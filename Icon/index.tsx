"use client";

import { HTMLAttributes } from "react";
import { IconType } from "react-icons";
import { Ripple } from "../Ripple";
import { cn } from "../util";

export function Icon({ icon: Icon, className, ...props }: { icon: IconType; } & HTMLAttributes<HTMLButtonElement>) {
	return (
		<button { ...props }
			className={ cn([
				"rounded-full select-none p-0.5 shrink-0 overflow-hidden w-12 aspect-square relative",
				"onClick" in props && "hover:bg-black/5 dark:hover:bg-white/5 focus:outline-0 focus:border active:border-transparent border-black/10 dark:border-white/10",
				className
			]) }
			tabIndex={ "onClick" in props ? 0 : undefined }
			type="button">
			<Ripple className="bg-black/20 dark:bg-white/20" emitFromCenter />
			<Icon className="mx-auto text-2xl" />
		</button>
	);
}
