"use client";

import type { ClassValue } from "clsx";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { cn } from "../util";

interface ScrollSpyProps {
	title: ReactNode;
	href: string;
	children?: {
		title: ReactNode;
		href: string;
		children?: {
			title: ReactNode;
			href: string;
		}[] | undefined;
	}[] | undefined;
}

export function ScrollSpy({ contents, htmlFor, highlight = true, highlightClass }: { contents: ScrollSpyProps[]; htmlFor: string, highlight?: boolean, highlightClass?: ClassValue }) {

	const [ activeHref, setActiveHref ] = useState<string | null>(null);

	// Get all links
	const hrefs = contents.flatMap(({ href, children }) => children ? [ href, ...children.flatMap(({ href, children }) => children ? [ href, ...children.map(({ href }) => href) ] : [ href ]) ] : [ href ]);
	
	// Intersection observer to set active link
	useEffect(() => {

		const tops = hrefs
			.map(href => document.querySelector(href))
			.map(function(container) {
				if(!container?.id) return container;
				const element = document.createElement("DIV");
				element.id = container.id;
				element.style.position = "absolute";
				element.style.top = "0";
				container?.prepend(element);
				return element;
			})
			.filter(Boolean) as HTMLElement[];

		const bottoms = hrefs
			.map(href => document.querySelector(href))
			.map(function(container) {
				if(!container?.id) return container;
				const element = document.createElement("DIV");
				element.id = container.id;
				element.style.position = "absolute";
				element.style.bottom = "0";
				container?.appendChild(element);
				return element;
			})
			.filter(Boolean) as HTMLElement[];

		// Create observer
		const topObserver = new IntersectionObserver(entries => {
			const entry = entries.find(entry => entry.isIntersecting);
			if (entry) setActiveHref(entry.target.id);
		}, {
			rootMargin: "0px 0px -50% 0px",
			threshold: 1,
			root: document.getElementById(htmlFor)
		});

		const bottomObserver = new IntersectionObserver(entries => {
			const entry = entries.find(entry => entry.isIntersecting);
			if (entry) setActiveHref(entry.target.id);
		}, {
			rootMargin: "0px 0px 50% 0px",
			threshold: 0.1,
			root: document.getElementById(htmlFor)
		});


		// Observe all links
		tops.forEach(link => topObserver.observe(link));
		bottoms.forEach(link => bottomObserver.observe(link));

		// Disconnect observer
		return () => topObserver.disconnect();
		
	}, [ contents, htmlFor, hrefs ]);

	function onClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
		setActiveHref(null);
		const href = event.currentTarget.getAttribute("href");
		
		// Scroll to element
		if (href && href.startsWith("#")) {
			event.preventDefault();
			const element = document.querySelector(href) as HTMLDivElement;
			const shell = document.getElementById(htmlFor) as HTMLDivElement;
			if (!element || !shell) return;

			if(highlight) {
				const h = document.createElement("div")
				h.style.top = element.offsetTop + "px";
				h.style.left = element.offsetLeft + "px";
				h.style.width = element.offsetWidth + "px";
				h.style.height = element.offsetHeight + "px";
				h.className = cn("pointer-events-none absolute rounded-md ring-2 ring-primary transition-opacity", highlightClass)
				element.parentElement?.appendChild(h);
				setTimeout(() => [
					h.classList.add("opacity-0"),
					h.addEventListener("transitionend", () => h.remove(), { once: true })
				], 500);
			}

			const { top } = element.getBoundingClientRect();
			shell.scrollTo({ top: shell.scrollTop + top - 80 });
			setActiveHref(href.substring(1));
		}

	}

	return (
		<ul className="text-gray-700 text-sm flex flex-col gap-2 -mt-2">
			{ contents.map(({ title, href, children }, key) => (
				<li className={ cn((!children?.some(child => child.children) || key === 0) && "mt-2") } key={ key }>
					<Link className={ cn("transition-colors duration-200 py-1 min-h-[24px] font-medium hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300", (`#${ activeHref }` === href || children?.some(a => a.href === `#${ activeHref }`) || children?.some(a => a.children?.some(a => a.href === `#${ activeHref }`))) && "text-primary-600 dark:text-primary-400") } href={ href } onClick={ onClick } scroll={ false }>{ title }</Link>
					{ children && (
						<ul className={ cn("flex flex-col", children.some(child => child.children) && "") }>
							{ children.map(({ title, href, children }, key) => (
								<li className="mt-1" key={ key }>
									<Link className={ cn("min-h-[24px] group flex items-center transition-colors duration-200 py-1 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300", key === 0 && "mt-1", (`#${ activeHref }` === href || children?.some(a => a.href === `#${ activeHref }`)) && "text-primary-600 dark:text-primary-400") } href={ href } onClick={ onClick } scroll={ false }>
										<MdKeyboardArrowRight className="mr-2 text-gray-400 overflow-visible group-hover:text-gray-600 dark:text-gray-600 dark:group-hover:text-gray-500" />
										{ title }
									</Link>
									{ children && (
										<ul className="pt-1">
											{ children.map(({ title, href }, key) => (
												<li className="ml-4" key={ key }>
													<Link className={ cn("min-h-[24px] group flex items-center transition-colors duration-200 py-1.5 pl-4 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300", `#${ activeHref }` === href && "text-primary-600 dark:text-primary-400") } href={ href } onClick={ onClick } scroll={ false }>
														{ title }
													</Link>
												</li>
											)) }
										</ul>
									) }
								</li>
							)) }
						</ul>
					) }
				</li>
			)) }
		</ul>
	);
}
