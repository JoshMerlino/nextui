"use client";
import { Card } from "nextui/Card";
import { Ripple } from "nextui/Ripple";
import { cn } from "nextui/util";
import { IconType } from "react-icons";
import { MdMoreVert } from "react-icons/md";

export function PopupMenu({ controls, state: [ controlsVisible, setControlsVisible ] }: {
	controls: {
		icon: IconType;
		onClick?: () => unknown | void;
		disabled?: boolean;
		text: string;
	}[];
	state: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}) {
	return (
		<div className="absolute top-0 right-0 mx-2">
			<Card className={ cn("p-0 absolute overflow-hidden z-[100] top-0 right-0 transition-[transform,opacity] origin-top-right", controlsVisible ? "shadow-2xl opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none") }>
				<div className="flex flex-col py-2 relative after:absolute after:inset-0 after:content-[''] after:bg-gray-200/20 dark:after:bg-gray-700/20 isolate after:-z-10">
					{ controls.map(({ icon: Icon, text, onClick, disabled }, key) => (
						<button className={ cn("select-none font-medium relative overflow-hidden py-3 pl-4 pr-8 flex items-center whitespace-nowrap gap-4 hover:bg-black/5 hover:dark:bg-white/5", text.split(" ")[0].toUpperCase() === "DELETE" && "text-error-600 dark:text-error-400", disabled && "opacity-50 cursor-not-allowed") }
							disabled={ disabled }
							key={ key }
							onClick={ onClick }>
							{ !disabled && <Ripple className={ cn(text.split(" ")[0].toUpperCase() === "DELETE" ? "bg-error/40" : "bg-black/20 dark:bg-white/20") } /> }
							<Icon className="text-2xl shrink-0" />
							<h1>{ text }</h1>
						</button>
					)) }
				</div>
			</Card>
			<button
				className={ cn("hidden group-hover/message:flex group-focus-within/message:flex w-9 focus:outline-0 aspect-square items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 rounded-xl", !controlsVisible && "focus:ring-2 focus:ring-primary") }
				onClick={ e => [ e.stopPropagation(), setControlsVisible(true) ] }
				type="button">
				<MdMoreVert className="text-2xl" />
			</button>
		</div>
	);
}
