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
				desktop: "w-[300px] h-[340px]",
			}
		}
	})

};

export function Calendar({
	allowFuture = true,
	allowPast = true,
	className,
	color = "primary",
	onSelect,
	openToDate: _defaultRenderDate,
	selected: _selected,
	yearFormat = (date: Date) => dayjs(date).format("MMM YYYY"),
	yearPicker: _yearPicker = false,
	yearPickerEnd = 2099,
	yearPickerStart = 1900,
	...props
}: Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> & Partial<{

	/**
	 * Whether to allow future dates to be selected
	 * @default true
	 */
	allowFuture: boolean;

	/**
	 * Whether to allow past dates to be selected
	 * @default true
	 */
	allowPast: boolean;

	/**
	 * The color to use for the selection
	 * @default "primary"
	 */
	color: "primary" | "success" | "warning" | "error" | "primary:pastel" | "success:pastel" | "warning:pastel" | "error:pastel" | "neutral";

	/**
	 * A callback for when a date is selected
	 * @param date The selected date
	 */
	onSelect: (date: Date | null) => void | unknown;

	/**
	 * The date to open the calendar to
	 * @default selection | new Date
	 */
	openToDate: Date;

	/**
	 * The selected date
	 * @default null
	 */
	selected: Date | null;

	/**
	 * The format for the year picker
	 * @default (date: Date) => dayjs(date).format("MMM YYYY")
	 * @param date The date to format
	 * @returns The formatted date
	 */
	yearFormat: (date: Date) => string;

	/**
	 * Whether to show the year picker by default
	 * @default false
	 */
	yearPicker: boolean;

	/**
	 * The ending range for the year picker
	 * @default 2099
	 */
	yearPickerEnd: number;
	
	/**
	 * The starting range for the year picker
	 * @default 1900
	 */
	yearPickerStart: number;
	
}>) {

	// State for year picker
	const [ yearPicker, setYearPicker ] = useState(_yearPicker);
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
	const [ selectedDate, setSelectedDate ] = useState<Date | null>(_selected || null);
	const [ renderDate, setRenderDate ] = useState<Date>(_defaultRenderDate || selectedDate || new Date);
	
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
	const firstDay = useMemo(() => dayjs(renderDate).startOf("month").day() || 0, [ renderDate ]);

	// Last day of last month (number of days in the previous month)
	const lastDayOfLastMonth = useMemo(() => dayjs(renderDate).subtract(1, "month").daysInMonth() || 0, [ renderDate ]);

	// Number of days in the current month
	const daysInMonth = useMemo(() => dayjs(renderDate).daysInMonth() || 0, [ renderDate ]);
	
	// Date selection
	const [ direction, setDirection ] = useState<"left" | "right">("right");
	
	// Update the render date
	const updateRenderDate = useCallback(function(next: Date) {
		const current = new Date(renderDate);
		if (dayjs(next).toDate().toString() === "Invalid Date") return;
		if (dayjs(next).isBefore(dayjs(new Date(yearPickerStart, 0, 1)))) return;
		if (dayjs(next).isAfter(dayjs(new Date(yearPickerEnd, 11, 31)))) return;
		if (dayjs(next).isSame(dayjs(current), "day")) return;
		setDirection(dayjs(next).isAfter(dayjs(current)) ? "right" : "left");
		setRenderDate(next);
	}, [ renderDate, yearPickerEnd, yearPickerStart ]);
	
	// Sync the selected date from props
	useEffect(function() {
		setSelectedDate(_selected || null);
		if (!_selected) return;
		setRenderDate(_selected);
	}, [ _selected ]);
	
	const nextPageDate = useMemo(() => new Date(renderDate)[yearPicker ? "setFullYear" : "setMonth"](renderDate[yearPicker ? "getFullYear" : "getMonth"]() + 1), [ renderDate, yearPicker ]);
	const prevPageDate = useMemo(() => new Date(renderDate)[yearPicker ? "setFullYear" : "setMonth"](renderDate[yearPicker ? "getFullYear" : "getMonth"]() - 1), [ renderDate, yearPicker ]);
	const disablePreviousButton = useMemo(() => (dayjs(renderDate).isSame(dayjs(new Date(yearPickerStart, 0, 1)), "month") || dayjs(renderDate).isBefore(dayjs(new Date(yearPickerStart, 0, 1)), "month")) || (!allowPast && dayjs(prevPageDate).isBefore(dayjs(), "month")), [ renderDate, yearPickerStart, prevPageDate, allowPast ]);
	const disableNextButton = useMemo(() => (dayjs(renderDate).isSame(dayjs(new Date(yearPickerEnd, 11, 31)), "month") || dayjs(renderDate).isAfter(dayjs(new Date(yearPickerEnd, 11, 31)), "month")) || (!allowFuture && dayjs(nextPageDate).isAfter(dayjs(), "month")), [ renderDate, yearPickerEnd, nextPageDate, allowFuture ]);
	const disableCurrentButton = useMemo(() => dayjs(renderDate).isSame(dayjs(), "month"), [ renderDate ]);

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
					<IoMdArrowDropdown className={ cn("transition-[transform] text-xl -mx-1 duration-75", yearPicker && "rotate-180") } />
				</Button>

				{ /* Month navigation */ }
				<div className="flex items-center gap-1">

					{ /* Go to previous month */ }
					<IconButton
						disabled={ disablePreviousButton }
						icon={ MdChevronLeft }
						onClick={ () => updateRenderDate(new Date(prevPageDate)) }
						size="medium" />
					
					{ /* Go to today button */ }
					<IconButton
						disabled={ disableCurrentButton }
						icon={ MdToday }
						onClick={ () => updateRenderDate(new Date) }
						size="medium" />

					{ /* Go to next month */ }
					<IconButton
						disabled={ disableNextButton }
						icon={ MdChevronRight }
						onClick={ () => updateRenderDate(new Date(nextPageDate)) }
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
											if (year < yearPickerStart) return null;
											const disabled = (!allowFuture && year > new Date().getFullYear()) || (!allowPast && year < new Date().getFullYear());
											return (
												<Button
													{ ...{ "data-value": year } }
													className="rounded-full !shadow-none"
													color={ year === renderDate.getFullYear() || new Date().getFullYear() === year ? color : "neutral" }
													disabled={ disabled }
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
					
					<div className="flex flex-col grow select-none">
						
						{ /* Days of week */ }
						<div className="grid grid-cols-7 mx-1.5 pt-3 -mb-1">
							{ [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ].map(function(day) {
								return (
									<div
										className="flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wide"
										key={ day }>
										{ day }
									</div>
								);
							}) }
						</div>
						
						{ /* Pan area */ }
						<div className="relative grow">
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
										{ Array(firstDay || 0).fill(null).map(function(_, index, { length }) {
											return (
												<div
													className="flex items-center justify-center aspect-square text-gray-300 dark:text-gray-600"
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
											const isSelected = dayjs(date).isSame(dayjs(selectedDate), "day");

											// Check if the current cell is today
											const isToday = dayjs(date).isSame(dayjs(), "day");
											const isPast = dayjs(date).isBefore(dayjs(), "day");
											const isFuture = dayjs(date).isAfter(dayjs(), "day");

											return (
												<Button
													className="rounded-full aspect-square flex items-center justify-center relative overflow-hidden cursor-pointer shadow-none hover:shadow-none active:shadow-none"
													color={ (isSelected || isToday) ? color : "neutral" }
													disabled={ (isPast && !allowPast) || (isFuture && !allowFuture) }
													key={ date.toISOString() }
													onClick={ () => onSelect?.(date) }
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
												className="flex items-center justify-center aspect-square text-gray-300 dark:text-gray-600"
												key={ index }>
												{ index + 1 }
											</div>
										)) }
								
										{ /* Add an additional row if necessary */ }
										{ firstDay + daysInMonth + (7 - (firstDay + daysInMonth) % 7) <= 35 && (
											Array(7).fill(null).map((_, index) => (
												<div
													className="flex items-center justify-center aspect-square text-gray-300 dark:text-gray-600"
													key={ index + 1 + 7 - (firstDay + daysInMonth) % 7 }>
													{ index + 1 + 7 - (firstDay + daysInMonth) % 7 }
												</div>
											))
										) }
								
									</div>

								</motion.div>
							</AnimatePresence>
						</div>

					</div>

				</motion.div>

			</div>

		</Card>
	);
}