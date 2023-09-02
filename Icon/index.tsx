"use client";
import { HTMLAttributes } from "react";
import { IconType } from "react-icons";
import { Ripple } from "../Ripple";
import { cn } from "../util";

export function Icon({ icon: Icon, className, ...props }: { icon: IconType; } & HTMLAttributes<HTMLButtonElement>) {
	return (
		<button className={ cn("relative w-12 overflow-hidden text-2xl text-center rounded-full aspect-square transition-colors duration-75 hover:bg-black/10 focus:bg-black/10 outline-0 dark:hover:bg-white/10 dark:focus:bg-white/10", className) } { ...props }>
			<Ripple className="bg-black/20 dark:bg-white/20" emitFromCenter />
			<Icon className="mx-auto" />
		</button>
	);
}
