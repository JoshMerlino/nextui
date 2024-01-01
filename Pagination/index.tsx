import { ClassValue } from "clsx";
import { PropsWithChildren } from "react";
import { PaginationClient } from "./Client";
import { PaginationContent } from "./PaginationContent";

export { usePagination } from "./Client";

export async function Pagination<T>({
	fetch,
	renderRow,
	className,
	refetchInterval = -1,
	name,
	children,
	cursor: _cursor,
	perPage: _perPage,
	searchParams = {}
}: PropsWithChildren<{
	renderRow({ data }: { data: T }): JSX.Element;
	fetch(cursor: number, perPage: number): Promise<{ data: T[], total: number }>;
	refetchInterval?: number;
	name: string;
	cursor?: number;
	perPage?: number;
	className?: ClassValue;
	searchParams?: Record<string, string>;
}>) {

	// Get the cursor and perPage from the search params or the arguments.
	const cursor = (function() {
		if (typeof _cursor === "number") return _cursor;
		const cursor = Number(searchParams[[ name, "cursor" ].join("_")]);
		if (isNaN(cursor)) return 1;
		return cursor;
	}());

	const perPage = (function() {
		if (typeof _perPage === "number") return _perPage;
		const perPage = Number(searchParams[[ name, "perPage" ].join("_")]);
		if (isNaN(perPage)) return 10;
		return perPage;
	}());

	// Fetch the data initial data during SSR.
	const { data, total } = await fetch(cursor, perPage);
	
	return (
		<PaginationClient
			cursor={ cursor }
			fetch={ fetch }
			initialData={ data }
			name={ name }
			perPage={ perPage }
			total={ total }>
			{children || <PaginationContent
				className={ className }
				fetch={ fetch }
				name={ name }
				refetchInterval={ refetchInterval }
				renderRow={ renderRow } />}
		</PaginationClient>
	);
}