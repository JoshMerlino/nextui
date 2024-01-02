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
