import { useVirtualizer } from "@tanstack/react-virtual";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "nextui/util";
import { useEffect, useRef, useState, type HTMLAttributes } from "react";
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

export function Calendar({ className, yearPickerRange = 200, ...props }: HTMLAttributes<HTMLDivElement> & Partial<{

	/**
	 * The range of years to show in the year picker
	 * @default 200
	 */
	yearPickerRange: number

}>) {

	// State for the selected date range
	const [ renderDate, setRenderDate ] = useState(new Date());

	// State for year picker
	const [ yearPicker, setYearPicker ] = useState(false);
	const yearPickerRef = useRef<HTMLDivElement>(null);

	// The virtualizer
	const rowVirtualizer = useVirtualizer({
		count: 1000,
		getScrollElement: () => yearPickerRef.current,
		scrollToFn: scroll => yearPickerRef.current?.scrollTo({ top: scroll }),
		estimateSize: () => 36,
	});

	useEffect(function() {
		if (!yearPicker) return;
		rowVirtualizer.scrollToIndex(Math.floor(renderDate.getFullYear() / 4));
		setTimeout(function() {
			yearPickerRef.current?.querySelector(`button[data-value="${ renderDate.getFullYear() }`)?.scrollIntoView({
				block: "center",
				behavior: "smooth"
			});
		});
	}, [ renderDate, rowVirtualizer, yearPicker ]);

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
					className={ cn("absolute inset-0 overflow-auto", yearPicker || "pointer-events-none") }
					exit="hidden"
					initial="hidden"
					ref={ yearPickerRef }
					style={{
						scrollbarColor: "currentColor transparent",
						scrollbarWidth: "thin",
						maskImage: "linear-gradient(to bottom, #0000 0px, #000f 16px, #000f calc(100% - 16px), #0000 100%)"
					}}
					transition={{ duration: 0.2 }}
					variants={{
						hidden: { opacity: 0, top: -16 },
						visible: { opacity: 1, top: 0 }
					}}>
					
					<div style={{
						height: `${ rowVirtualizer.getTotalSize() }px`,
						width: "100%",
						position: "relative",
					}}>
                    
						{ rowVirtualizer.getVirtualItems().map(function(virtualItem) {
							
							const yearBase = virtualItem.index * 4;

							return (
								<div
									className="absolute top-0 left-0 w-full py-1"
									key={ yearBase }
									style={{
										height: `${ virtualItem.size }px`,
										transform: `translateY(${ virtualItem.start }px)`,
									}}>
									<div className="px-4 gap-2 grid grid-cols-4">
										{ Array(4).fill(null).map(function(_, col) {
											const year = yearBase + col;
											return (
												<Button
													{ ...{ "data-value": year } }
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
													variant={ year === renderDate.getFullYear() ? "raised" : "flat" }>{ year.toString().padStart(4, "0") }</Button>
											);
										}) }
									</div>
								</div>
							);
						}) }

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