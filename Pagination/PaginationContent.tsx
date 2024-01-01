"use client";

import { cn } from "nextui/util";
import { useEffect, useRef } from "react";
import { Pagination } from ".";
import { PaginationNav, PaginationPerPage, usePagination } from "./Client";

type GetProps<T> = T extends React.ComponentType<infer P> | React.Component<infer P> ? P : never

export function PaginationContent({ refetchInterval = -1, renderRow: Row, className }: Pick<GetProps<typeof Pagination>, "renderRow" | "refetchInterval" | "className">) {
	const { data, refetch } = usePagination();
	const interval = useRef<NodeJS.Timeout>();

	useEffect(() => {
		const handleFocus = () => refetch();

		if (refetchInterval >= 0 && !interval.current) interval.current = setInterval(refetch, refetchInterval);
		window.addEventListener("focus", handleFocus);
		return () => {
			window.removeEventListener("focus", handleFocus);
			clearInterval(interval.current);
		};
		
	}, [ refetch, refetchInterval ]);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col mb-0 -mx-4 -mt-4 border-b sm:-mx-6 sm:-mt-6 sm:mb-2 border-gray-200/50 dark:border-gray-600/50">
				<div className="rounded-t-lg bg-gray-200 dark:bg-gray-700/50 px-4 py-2.5 flex justify-end">
					<PaginationNav />
				</div>
				<ul className={ cn("divide-y divide-gray-200/50 dark:divide-gray-600/50", className) }>
					{data.map((data, key) => <Row
						data={ data }
						key={ key } />)}
				</ul>
			</div>
			<div className="flex flex-wrap items-center justify-between sm:-my-4">
				<PaginationNav />
				<PaginationPerPage />
			</div>
		</div>
	);
}