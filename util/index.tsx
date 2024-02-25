import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine tailwind classes with clsx and tailwind-merge
 * @param inputs - tailwind classes
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/**
 * Create a style tag with the given CSS.
 */
export const css = (strings: TemplateStringsArray, ...values: Array<string | number>) => <style>{ String.raw(strings, ...values) }</style>;

export function rgba(hex: string, alpha: string | number) {
	if (hex.length === 4) hex = hex.replace(/./g, "$&$&");
	const [ r, g, b ] = hex.match(/\w\w/g)!.map(c => parseInt(c, 16));
	if (typeof alpha === "string") alpha = Number(alpha);
	if (alpha > 1) alpha = alpha / 100;
	return `rgba(${ r }, ${ g }, ${ b }, ${ alpha })`;
}
