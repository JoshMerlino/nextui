import { Ripple } from "nextui/Ripple";
import { cn } from "nextui/util";
import { type HTMLAttributes, useCallback, useContext } from "react";
import { KeyContext, TabsContext } from ".";

export function Tab({ children, className, onClick, ...props }: HTMLAttributes<HTMLLIElement>) {
	const { background, selected, setSelected } = useContext(TabsContext);
	const index = useContext(KeyContext);

	const onMouseMove = useCallback(function(event: React.MouseEvent<HTMLLIElement, MouseEvent>) {
		const slider = background?.current;
		const target = event.target instanceof HTMLLIElement ? event.target : (event.target as HTMLElement).closest("li") as HTMLLIElement;
		if (!slider || !target) return;
		slider.style.top = `${ target.offsetTop }px`;
		slider.style.height = `${ target.offsetHeight }px`;
		slider.style.opacity = "1";
		slider.style.left = `${ target.offsetLeft }px`;
		slider.style.right = `${ slider.parentElement!.offsetWidth - target.offsetLeft - target.offsetWidth }px`;
		slider.style.transitionProperty = "opacity, left, right";
	}, [ background ]);

	return (
		<li
			className={ cn(
				"font-medium text-sm rounded relative overflow-hidden cursor-pointer",
				"inline-flex items-center focus:outline-0 transition-colors duration-100",
				"focus:bg-primary-700/10 dark:focus:bg-primary-400/10",
				selected === index ? "active text-primary-700 dark:text-primary-400" : "hover:text-primary-900 dark:hover:text-primary-100",
				"h-8 px-3",
				className
			) }
			onClick={ ev => [ setSelected(index), onClick?.(ev) ] }
			onMouseMove={ onMouseMove }
			{ ...props }
			tabIndex={ 0 }>
			<Ripple className="bg-primary-700/20 dark:bg-primary-400/20" />
			{ children }
		</li>
	);
}
