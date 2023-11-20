"use client";

import { Ripple } from "nextui/Ripple";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { usePagination } from ".";

export function PaginationNav() {
	const {
		cursor: [ cursor, setCursor ],
		loading: [ loading ],
		perPage: [ perPage ],
		total: [ total ],
	} = usePagination();

	const rangeStart = Math.min(total, Math.max(cursor, 1));
	const rangeEnd = Math.min(total, Math.max(cursor + perPage - 1, 1));
	const nextCursor = Math.min(total, Math.max(cursor + perPage, 1));
	const prevCursor = Math.min(total, Math.max(cursor - perPage, 1));
	const currentPage = Math.ceil(rangeStart / perPage);

	return (
		<div className="flex gap-4">
			<span className="text-sm text-gray-700 dark:text-gray-400">
				<span className="hidden sm:inline">Showing </span>
				<span className="font-semibold text-gray-900 dark:text-white">{rangeStart}</span> to <span className="font-semibold text-gray-900 dark:text-white">{rangeEnd}</span> of <span className="font-semibold text-gray-900 dark:text-white">{total}</span>
				<span className="hidden sm:inline"> Entries</span>
			</span>
			<div className="flex gap-2 items-center">
				<button
					className="aspect-square hover:bg-black/10 dark:hover:bg-white/10 focus:bg-black/10 dark:focus:bg-white/10 rounded h-6 -my-2 flex items-center justify-center relative overflow-hidden focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:opacity-50 disabled:pointer-events-none"
					disabled={ loading || cursor === prevCursor }
					onClick={ () => setCursor(prevCursor) }
					type="button">
					<Ripple className="bg-black/30 dark:bg-white/20" />
					<MdKeyboardArrowLeft className="text-gray-900 dark:text-white text-2xl" />
				</button>

				<span className={ "text-sm text-gray-700 dark:text-gray-400" }>
					Page <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span>
				</span>

				<button
					className="aspect-square hover:bg-black/10 dark:hover:bg-white/10 focus:bg-black/10 dark:focus:bg-white/10 rounded h-6 -my-2 flex items-center justify-center relative overflow-hidden focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:opacity-50 disabled:pointer-events-none"
					disabled={ loading || cursor === nextCursor || nextCursor - 1 >= total || rangeEnd === total }
					onClick={ () => setCursor(nextCursor) }
					type="button">
					<Ripple className="bg-black/30 dark:bg-white/20" />
					<MdKeyboardArrowRight className="text-gray-900 dark:text-white text-2xl" />
				</button>
				
			</div>
		</div>
	);
}