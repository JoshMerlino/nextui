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