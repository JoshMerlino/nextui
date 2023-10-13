"use client";

import { HTMLAttributes } from "react";

export function ReturnToTop({ children, htmlFor, ...props }: HTMLAttributes<HTMLDivElement> & { htmlFor?: string }): JSX.Element {
	const scrollToTop = () => (htmlFor ? document.getElementById(htmlFor)! : window).scrollTo({ top: 0, behavior: "smooth" });
	return <div { ...props } onClick={ props.onClick ? (...args) => props.onClick?.(...args) && scrollToTop() : scrollToTop }>{children}</div>;
}