import { useVirtualizer } from "@tanstack/react-virtual";
import { cva, type VariantProps } from "class-variance-authority";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "nextui/util";
import { useCallback, useEffect, useMemo, useRef, useState, type HTMLAttributes } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdChevronLeft, MdChevronRight, MdToday } from "react-icons/md";
import { Button } from "./Button";
import { Card } from "./Card";
import { IconButton } from "./IconButton";

export const classes = {

	container: cva("inline-flex flex-col", {
		defaultVariants: {
			variant: "desktop"
		},
		variants: {
			variant: {
				desktop: "w-[300px] h-[316px]",
			}
		}
	})

};

export function Calendar({
	className,
	yearPickerStart = 1900,
	yearPickerEnd = 2099,
	color = "primary",
	yearFormat = (date: Date) => dayjs(date).format("MMM YYYY"),
	...props
}: Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> & Partial<{

	/**
	 * The starting range for the year picker
	 * @default 1900
	 */
	yearPickerStart: number;

	/**
	 * The ending range for the year picker
	 * @default 2099
	 */
	yearPickerEnd: number;

	/**
	 * The format for the year picker
	 * @default (date: Date) => dayjs(date).format("MMM YYYY")
	 * @param date The date to format
	 * @returns The formatted date
	 */
	yearFormat: (date: Date) => string;

	/**
	 * The color to use for the selection
	 * @default "primary"
	 */
	color: "primary" | "success" | "warning" | "error" | "primary:pastel" | "success:pastel" | "warning:pastel" | "error:pastel" | "neutral";

	/**
	 * A callback for when a date is selected
	 * @param date The selected date
	 */
	onSelect: (date: Date | readonly [Date, Date] | null) => unknown;
	
}>) {

	// State for year picker
	const [ yearPicker, setYearPicker ] = useState(false);
	const yearPickerRef = useRef<HTMLDivElement>(null);

	// The virtualizer
	const totalYears = yearPickerEnd - yearPickerStart + 1;
	const rowVirtualizer = useVirtualizer({
		count: Math.ceil(totalYears / 4),
		getScrollElement: () => yearPickerRef.current,
		scrollToFn: scroll => yearPickerRef.current?.scrollTo({ top: scroll }),
		estimateSize: () => 36,
	});

	// State for the current page of the calendar
	const [ renderDate, setRenderDate ] = useState(new Date);
	const [ selectionStartDate, setSelectedDate ] = useState<Date>();
	const [ selectionEndDate, setSelectionEndDate ] = useState<Date>();

	// Auto scroll to the current year
	useEffect(function() {
		if (!yearPicker) return;
		const currentYearIndex = Math.floor((renderDate.getFullYear() - yearPickerStart) / 4);
		rowVirtualizer.scrollToIndex(currentYearIndex);
		setTimeout(function() {
			yearPickerRef.current?.querySelector(`button[data-value="${ renderDate.getFullYear() }"]`)?.scrollIntoView({
				block: "center",
				behavior: "smooth",
			});
		});
	}, [ renderDate, rowVirtualizer, yearPicker, yearPickerStart ]);
	
	// Day of week of first day of month
	const firstDay = useMemo(() => {
		const date = new Date(renderDate);
		date.setDate(1);
		return date.getDay();
	}, [ renderDate ]);
	
	// Last day of last month
	const lastDayOfLastMonth = useMemo(() => {
		const date = new Date(renderDate);
		date.setDate(0);
		return date.getDate();
	}, [ renderDate ]);
	
	// Get the number of days in the month
	const daysInMonth = useMemo(() => {
		const date = new Date(renderDate);
		date.setMonth(date.getMonth() + 1);
		date.setDate(0);
		return date.getDate();
	}, [ renderDate ]);
	
	// Date selection
	const [ direction, setDirection ] = useState<"left" | "right">("right");
	
	// Update the render date
	const updateRenderDate = useCallback(function(next: Date) {
		const current = new Date(renderDate);
		const direction = dayjs(next).isAfter(dayjs(current)) ? "right" : "left";
		setDirection(direction);
		setRenderDate(next);
	}, [ renderDate ]);
	
	// On selection date change, call the onSelect callback
	useEffect(function() {
		const value = (selectionEndDate && selectionStartDate) ? [ selectionStartDate, selectionEndDate ] as const : selectionStartDate ?? null;
		props.onSelect?.(value);
	}, [ selectionStartDate, props, selectionEndDate ]);

	return (
		<Card
			className={ cn(classes.container(props as VariantProps<typeof classes.container>), "p-0", className) }
			variant="popover">
			
			{ /* Calendar Header */ }
			<div className="flex items-center justify-between gap-2 p-2.5 border-b border-gray-200 dark:border-gray-700">

				{ /* Toggle year picker */ }
				<Button
					color="neutral"
					onClick={ () => setYearPicker(!yearPicker) }
					variant="flat">
					{ yearFormat(renderDate) }
					<IoMdArrowDropdown className={ cn("transition-[transform] text-xl -mx-1", yearPicker && "rotate-180") } />
				</Button>

				{ /* Month navigation */ }
				<div className="flex items-center gap-1">

					{ /* Go to today button */ }
					<IconButton
						icon={ MdToday }
						onClick={ () => updateRenderDate(new Date) }
						size="medium" />

					{ /* Go to previous month */ }
					<IconButton
						icon={ MdChevronLeft }
						onClick={ () => updateRenderDate(new Date(new Date(renderDate).setMonth(renderDate.getMonth() - 1))) }
						size="medium" />

					{ /* Go to next month */ }
					<IconButton
						icon={ MdChevronRight }
						onClick={ () => updateRenderDate(new Date(new Date(renderDate).setMonth(renderDate.getMonth() + 1))) }
						size="medium" />
					
				</div>
			</div>

			{ /* Calendar Body */ }
			<div className="relative grow overflow-hidden">

				{ /* Year picker */ }
				<motion.div
					animate={ yearPicker ? "visible" : "hidden" }
					className={ cn(
						"absolute inset-0 overflow-auto py-2",
						yearPicker || "pointer-events-none"
					) }
					exit="hidden"
					initial="hidden"
					ref={ yearPickerRef }
					style={{
						scrollbarWidth: "none",
						maskImage: "linear-gradient(to bottom, #0000 0px, #000f 16px, #000f calc(100% - 16px), #0000 100%)",
					}}
					transition={{ duration: 0.1 }}
					variants={{
						hidden: { opacity: 0, top: -16 },
						visible: { opacity: 1, top: 0 },
					}}>
					
					<div
						className="relative w-full"
						style={{ height: `${ rowVirtualizer.getTotalSize() }px` }}>
						{ rowVirtualizer.getVirtualItems().map(function(virtualItem) {
							const yearBase = yearPickerStart + virtualItem.index * 4;
							return (
								<div
									className="absolute top-0 left-0 w-full py-1 items-center flex justify-center"
									key={ yearBase }
									style={{
										height: `${ virtualItem.size }px`,
										transform: `translateY(${ virtualItem.start }px)`,
									}}>
									<div className="px-4 gap-4 grid grid-cols-4">
										{ Array(4).fill(null).map(function(_, col) {
											const year = yearBase + col;
											if (year > yearPickerEnd) return null;
											return (
												<Button
													{ ...{ "data-value": year } }
													className="rounded-full !shadow-none"
													color={ year === renderDate.getFullYear() || new Date().getFullYear() === year ? color : "neutral" }
													key={ year }
													onClick={ function() {
														setRenderDate(function(date) {
															const newDate = new Date(date);
															newDate.setFullYear(year);
															return newDate;
														});
													} }
													size="small"
													variant={ year === renderDate.getFullYear() ? "raised" : "flat" }>
													{ year.toString().padStart(4, "0") }
												</Button>
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
					className={ cn(
						"absolute inset-0 flex flex-col",
						yearPicker && "pointer-events-none"
					) }
					exit="hidden"
					initial="hidden"
					transition={{ duration: 0.1 }}
					variants={{
						visible: { opacity: 0, top: -16 },
						hidden: { opacity: 1, top: 0 },
					}}>
					
					<AnimatePresence>
						<motion.div
							animate={{ x: 0, opacity: 1 }}
							className="absolute inset-0"
							exit={{ x: direction === "right" ? -16 : 16, opacity: 0 }}
							initial={{ x: direction === "right" ? 16 : -16, opacity: 0 }}
							key={ dayjs(renderDate).format("YYYY-MM") }
							transition={{ duration: 0.1 }}>
							<div className="grid grid-cols-7 m-2 select-none text-sm gap-1 font-medium">
						
								{ /* Blank days of week */ }
								{ Array(firstDay).fill(null).map(function(_, index, { length }) {
									return (
										<div
											className="flex items-center justify-center aspect-square text-gray-400 dark:text-gray-500"
											key={ index }>
											{ lastDayOfLastMonth - length + index + 1 }
										</div>
									);
								}) }

								{ /* Days of week */ }
								{ Array(daysInMonth).fill(null).map(function(_, index) {

									// Generate the date for this cell
									const date = new Date(renderDate);
									date.setDate(index + 1);

									// Check if the current cell is selected
									const isSelected =
										dayjs(date).isSame(dayjs(selectionStartDate), "day") &&
										dayjs(date).isSame(dayjs(renderDate), "month") &&
										dayjs(date).isSame(dayjs(selectionStartDate), "year");

									// Check if the current cell is today
									const isToday =
										dayjs(date).isSame(dayjs(), "day") &&
										dayjs(date).isSame(dayjs(renderDate), "month") &&
										dayjs(date).isSame(dayjs(), "year");

									return (
										<Button
											className={ cn("rounded-full aspect-square flex items-center justify-center relative overflow-hidden cursor-pointer") }
											color={ (isSelected || isToday) ? color : "neutral" }
											key={ date.toISOString() }
											onClick={ () => setSelectedDate(new Date(date.setMonth(renderDate.getMonth()))) }
											ripple={{ emitFromCenter: true }}
											type="button"
											variant={ isSelected ? "raised" : "flat" }>
											{ date.getDate() }
										</Button>
									);
								}) }
						
								{ /* Blank days of week */ }
								{ Array(7 - (firstDay + daysInMonth) % 7).fill(null).map((_, index) => (
									<div
										className="flex items-center justify-center aspect-square text-gray-400 dark:text-gray-500"
										key={ index }>
										{ index + 1 }
									</div>
								)) }
								
								{ /* Add an additional row if necessary */ }
								{ firstDay + daysInMonth + (7 - (firstDay + daysInMonth) % 7) <= 35 && (
									Array(7).fill(null).map((_, index) => (
										<div
											className="flex items-center justify-center aspect-square text-gray-400 dark:text-gray-500"
											key={ index }>
											{ index + 1 }
										</div>
									))
								) }
								
							</div>

						</motion.div>
					</AnimatePresence>

				</motion.div>

			</div>
		</Card>
	);
}