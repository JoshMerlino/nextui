import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "nextui/util";
import { useState, type HTMLAttributes } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { Button } from "./Button";
import { Card } from "./Card";
import { IconButton } from "./IconButton";

export const classes = {

	// Style for the calendar container
	container: cva("inline-flex flex-col", {
		defaultVariants: {
			variant: "desktop"
		},
		variants: {
			variant: {
				desktop: "w-[300px] h-[340px]",
			}
		}
	})

};

const MONTHS = [
	"January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"
];

const YEAR_PADDING = 40;

export function Calendar({ className, ...props }: HTMLAttributes<HTMLDivElement>) {

	// State for the selected date range
	const [ renderDate, setRenderDate ] = useState(new Date());

	// State for year picker
	const [ yearPicker, setYearPicker ] = useState(false);

	return (
		<Card
			className={ cn(classes.container(props as VariantProps<typeof classes.container>), "p-0", className) }
			variant="popover">
            
			{ /* Calendar Header */ }
			<div className="flex items-center justify-between gap-2 p-2.5 border-b border-gray-200 dark:border-gray-700">
                
				<Button
					color="neutral"
					onClick={ () => setYearPicker(!yearPicker) }
					variant="flat">
					{ MONTHS[renderDate.getMonth()] } { renderDate.getFullYear() }
					<IoMdArrowDropdown />
				</Button>
                
				<div className="flex items-center gap-2">
					<IconButton
						icon={ MdChevronLeft }
						onClick={ () => setRenderDate(function(date) {
							const newDate = new Date(date);
							newDate.setMonth(newDate.getMonth() - 1);
							return newDate;
						}) }
						size="medium" />
					<IconButton
						icon={ MdChevronRight }
						onClick={ () => setRenderDate(function(date) {
							const newDate = new Date(date);
							newDate.setMonth(newDate.getMonth() + 1);
							return newDate;
						}) }
						size="medium" />
				</div>

			</div>
            
			{ /* Calendar Body */ }
			<div className="relative grow overflow-hidden">
				
				{ /* Year picker */ }
				<motion.div
					animate={ yearPicker ? "visible" : "hidden" }
					className={ cn("absolute inset-0 overflow-y-auto", yearPicker || "pointer-events-none") }
					exit="hidden"
					initial="hidden"
					style={{
						scrollbarColor: "currentColor transparent",
						scrollbarWidth: "thin"
					}}
					transition={{ duration: 0.2 }}
					variants={{
						hidden: { opacity: 0, top: -16 },
						visible: { opacity: 1, top: 0 }
					}}>
                    
					{ /* <div className="grid grid-cols-4 gap-2">
						{ Array.from({ length: YEAR_PADDING * 2 + 1 }).map(function(_, key) {
							const year = renderDate.getFullYear() - YEAR_PADDING + key;
							v
						}) }
					</div> */ }

					<div className="flex flex-col">

						{ /* { Array.from({ length: 5 }).map(function(_, key, { length }) {
							const year = renderDate.getFullYear() - (length / 2) + key;
							const group = year - (year % 4);
							return (
								<div className="grid grid-cols-4 gap-2" key={ group }> */ }
						{ /* { Array.from({ length: 4 }).map(function(_, key) {
										const year = group + key;
										return (
											<Button
												className="rounded-full !shadow-none"
												color={ year === renderDate.getFullYear() || new Date().getFullYear() === year ? "primary" : "neutral" }
												key={ year }
												onClick={ function() {
													setRenderDate(function(date) {
														const newDate = new Date(date);
														newDate.setFullYear(year);
														return newDate;
													});
												} }
												size="small"
												variant={ year === renderDate.getFullYear() ? "raised" : new Date().getFullYear() === year ? "outlined" : "flat" }>{ year }</Button>
										);
									}) } */ }

						{ Array(10).fill(null).map((_, row, { length }) => {
							return (
								<div className="grid grid-cols-4" key={ row }>

									{ Array(4).fill(null).map((_, col, { length }) => {
										return (
											<div className="grid grid-cols-4" key={ col }>

												{ col }
                                                 
											</div>
										);
									}) }
                                                 
								</div>
							);
						}) }

						{ /* </div> */ }
						{ /* ); */ }
						{ /* }) } */ }

					</div>

				</motion.div>
				
				{ /* Calendar */ }
				<motion.div
					animate={ yearPicker ? "visible" : "hidden" }
					className={ cn("bg-red-500 absolute inset-0", yearPicker && "pointer-events-none") }
					exit="hidden"
					initial="hidden"
					transition={{ duration: 0.2 }}
					variants={{
						visible: { opacity: 0, top: -16 },
						hidden: { opacity: 1, top: 0 }
					}}>
                    calendar
				</motion.div>
                    
			</div>
            
		</Card>
	);
}