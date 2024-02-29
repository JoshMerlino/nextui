import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine tailwind classes with clsx and tailwind-merge
 * @param inputs - tailwind classes
 * @returns - Combined classes
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/**
 * Create a style tag with the given CSS.
 * @type This is a tagged template literal function.
 * @param strings - Template strings
 * @returns - Style tag
 */
export const css = (strings: TemplateStringsArray, ...values: Array<string | number>) => <style>{ String.raw(strings, ...values) }</style>;


/**
 * Convert a hex color to rgb
 * @param {string} hex - Hex color
 * @returns - RGB color
 */
export function rgb(hex: string) {
	if (hex.length === 4) hex = hex.replace(/./g, "$&$&");
	const [ r, g, b ] = hex.match(/\w\w/g)!.map(c => parseInt(c, 16));
	return { r, g, b };
}

/**
 * Convert a hex color to rgba
 * @param {string} hex - Hex color
 * @param {string | number} alpha - Alpha value
 * @returns - RGBA color
 */
export function rgba(hex: string, alpha: string | number) {
	const { r, g, b } = rgb(hex);
	if (typeof alpha === "string") alpha = Number(alpha);
	if (alpha > 1) alpha = alpha / 100;
	return `rgba(${ r }, ${ g }, ${ b }, ${ alpha })`;
}

/**
 * Get the contrast of a hex color
 * @param {string} hex - Hex color
 * @returns {number} Contrast value
 */
export function contrast(hex: string) {
	if (hex.length === 4) hex = hex.replace(/./g, "$&$&");
	const [ r, g, b ] = hex.match(/\w\w/g)!.map(c => parseInt(c, 16));
	return (r * 299 + g * 587 + b * 114) / 1000;
}
