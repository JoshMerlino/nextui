"use client";

import { cn } from "nextui/util";
import { useCallback, useEffect, useRef } from "react";
import { Pagination } from ".";
import { PaginationNav, PaginationPerPage, usePagination } from "./Client";

type GetProps<T> = T extends React.ComponentType<infer P> | React.Component<infer P> ? P : never

export function PaginationContent(passedProps: Partial<GetProps<typeof Pagination>>) {

	const { inheritProps, data, refetch } = usePagination();
	const props: GetProps<typeof Pagination> = {
		refetchInterval: -1,
		...inheritProps,
		...passedProps,
	};

	// eslint-disable-next-line react/prop-types
	const { refetchInterval = -1, renderRow: Row, className, refetchOnWindowFocus } = props;
	
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	// Set up the refetch interval
	const setupRefetchInterval = useCallback(function() {
		if (intervalRef.current) clearInterval(intervalRef.current);
		if (refetchInterval > 0 && document.visibilityState === "visible") intervalRef.current = setInterval(() => refetch({ passive: true }), refetchInterval);
	}, [ refetchInterval, refetch ]);
	
	// Handle visibility change
	const handleVisibilityChange = useCallback(function() {
		if (document.visibilityState === "visible") return setupRefetchInterval();
		if (intervalRef.current) clearInterval(intervalRef.current);
	}, [ setupRefetchInterval ]);
	
	// Set up the focus event listener to refetch data when window gains focus
	const handleFocus = useCallback(() => refetchOnWindowFocus && refetch(), [ refetchOnWindowFocus, refetch ]);

	// Set up the refetch interval and the event listeners
	useEffect(function() {
		window.addEventListener("focus", handleFocus);
		document.addEventListener("visibilitychange", handleVisibilityChange);
		setupRefetchInterval();

		return () => {
			window.removeEventListener("focus", handleFocus);
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [ handleVisibilityChange, setupRefetchInterval, handleFocus ]);

	return (
		<div className="flex flex-col gap-4">
			<div className={ cn((data.length > 0) && "border-b", "flex flex-col mb-0 -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 sm:mb-2 border-gray-200/50 dark:border-gray-600/50") }>
				<div className="rounded-t-lg bg-gray-200 dark:bg-gray-700/50 px-4 py-2.5 flex justify-end">
					<PaginationNav />
				</div>
				<ul className={ cn("divide-y divide-gray-200/50 dark:divide-gray-600/50", className) }>
					{ data.map((data, key) => (
						<Row
							// eslint-disable-next-line react/prop-types
							{ ...props.rowProps }
							data={ data }
							key={ (data && typeof data === "object" && "id" in data && (typeof data.id === "string" || typeof data.id === "number")) ? data.id : key } />
					)) }
				</ul>
			</div>
			<div className="flex flex-wrap items-center justify-between sm:-my-4">
				<PaginationNav />
				<PaginationPerPage />
			</div>
		</div>
	);
}