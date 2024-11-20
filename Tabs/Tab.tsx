import { Ripple } from "nextui/Ripple";
import { cn } from "nextui/util";
import { type HTMLAttributes, useCallback, useContext, useEffect } from "react";
import { KeyContext, TabsContext } from ".";

export function Tab({ children, className, onClick, defaultChecked, disabled, ...props }: HTMLAttributes<HTMLButtonElement> & Partial<{ defaultChecked: boolean, disabled: boolean }>) {
	const { background, selected, setSelected } = useContext(TabsContext);
	const index = useContext(KeyContext);

	const onMouseMove = useCallback(function(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		const slider = background?.current;
		const target = event.target instanceof HTMLButtonElement ? event.target : (event.target as HTMLElement).closest("button") as HTMLButtonElement;
		if (!slider || !target) return;
		slider.style.top = `${ target.offsetTop }px`;
		slider.style.height = `${ target.offsetHeight }px`;
		slider.style.opacity = "1";
		slider.style.left = `${ target.offsetLeft }px`;
		slider.style.right = `${ slider.parentElement!.offsetWidth - target.offsetLeft - target.offsetWidth }px`;
		slider.style.transitionProperty = "opacity, left, right";
	}, [ background ]);
	
	useEffect(function() {
		if (defaultChecked) setSelected(index);
	}, [ defaultChecked, setSelected, index ]);

	return (
		<li>
			<button
				className={ cn(
					"font-medium text-sm rounded relative overflow-hidden cursor-pointer",
					"inline-flex items-center focus:outline-0 transition-colors duration-100",
					!disabled && "focus:bg-primary-500/10 dark:focus:bg-primary-400/10 focus:text-primary-700 dark:focus:text-primary-200",
					!disabled && (selected === index ? "active text-primary-500 dark:text-primary-300" : "hover:text-primary-900 dark:hover:text-primary-100"),
					"h-8 px-3",
					disabled && "text-gray-500 dark:text-gray-400 cursor-not-allowed",
					className
				) }
				onClick={ ev => disabled || [ setSelected(index), onClick?.(ev) ] }
				onMouseMove={ ev => disabled || onMouseMove(ev) }
				{ ...props }
				tabIndex={ disabled ? -1 : 0 }>
				{ disabled || <Ripple className="bg-primary-500/20 dark:bg-primary-400/20" /> }
				{ children }
			</button>
		</li>
	);
}
