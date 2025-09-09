import { type HTMLAttributes, type PropsWithChildren, Children } from "react";

export function EqualGrid({ style, children, ...props }: Readonly<PropsWithChildren & HTMLAttributes<HTMLDivElement>>) {

	// Count non null children
	const validChildrenCount = Children.toArray(children).filter(child => child !== null && child !== undefined);

	console.log({ validChildrenCount });

	return (
		<div { ...props }
			style={{
				...style,
				gridTemplateColumns: `repeat(${ Children.count(validChildrenCount) }, minmax(0, 1fr))`
			}}>
			{ children }
		</div>
	);
}
