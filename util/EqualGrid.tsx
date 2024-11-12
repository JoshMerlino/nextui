import { type HTMLAttributes, type PropsWithChildren, Children } from "react";

export function EqualGrid({ style, children, ...props }: Readonly<PropsWithChildren & HTMLAttributes<HTMLDivElement>>) {
	return (
		<div { ...props }
			style={{
				...style,
				gridTemplateColumns: `repeat(${ Children.count(children) }, minmax(0, 1fr))`
			}}>
			{ children }
		</div>
	);
}
