"use client";

import { cn } from "@/nextui/util";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

export function ScrollSpy({ contents, htmlFor }: { contents: { title: string; href: string; children?: { title: string; href: string; }[]; }[]; htmlFor: string }) {

	const [ activeHref, setActiveHref ] = useState<string | null>(null);

	// Get all links
	const hrefs = contents.flatMap(({ href, children }) => children ? [ href, ...children.map(({ href }) => href) ] : [ href ]);
	
	// Intersection observer to set active link
	useEffect(() => {

		const links = hrefs
			.map(href => document.querySelector(href))
			.filter(Boolean) as HTMLElement[];

		// Create observer
		const observer = new IntersectionObserver(entries => {
			const entry = entries.find(entry => entry.isIntersecting);
			if (entry) setActiveHref(entry.target.id);
		}, {
			rootMargin: "0px 0px -50% 0px",
			threshold: 0.5,
			root: document.getElementById(htmlFor)
		});

		// Observe all links
		links.forEach(link => observer.observe(link));

		// Disconnect observer
		return () => observer.disconnect();
		
	}, [ contents, htmlFor, hrefs ]);

	function onClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
		const href = event.currentTarget.getAttribute("href");
		setActiveHref(href);

		// Scroll to element
		if (href && href.startsWith("#")) {
			event.preventDefault();
			const element = document.querySelector(href);
			if (element) element.scrollIntoView({ behavior: "smooth" });
		}
	}

	return (
		<ul className="text-gray-700 text-sm flex flex-col gap-2">
			{contents.map(({ title, href, children }, key) => (
				<li className="mt-1" key={ key }>
					<Link className={ cn("transition-colors duration-200 py-1 min-h-[24px] font-medium hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300", (`#${ activeHref }` === href || children?.some(a => a.href === `#${ activeHref }`)) && "text-primary-500 dark:text-primary-400") } href={ href } onClick={ onClick } scroll={ false }>{title}</Link>
					{children && (
						<ul className="my-1">
							{children.map(({ title, href }, key) => (
								<li className="ml-4 " key={ key }>
									<Link className={ cn("min-h-[24px] group flex items-center transition-colors duration-200 py-1 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300", `#${ activeHref }` === href && "text-primary-500 dark:text-primary-400") } href={ href } onClick={ onClick } scroll={ false }>
										<MdKeyboardArrowRight className="mr-2 text-gray-400 overflow-visible group-hover:text-gray-600 dark:text-gray-600 dark:group-hover:text-gray-500" />
										{title}
									</Link>
								</li>
							))}
						</ul>
					)}
				</li>
			))}
		</ul>
	);
}
