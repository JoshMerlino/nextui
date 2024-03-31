import { ClassValue } from "clsx";
import { PropsWithChildren } from "react";
import { PaginationClient } from "./Client";
import { PaginationContent } from "./PaginationContent";

export { usePagination } from "./Client";

export async function Pagination<T>({
	children,
	cursor: _cursor,
	perPage: _perPage,
	rowProps = {},
	searchParams = {},
	...props
}: PropsWithChildren<{
	renderRow({ data }: { data: T }): JSX.Element;
	rowProps?: Record<string, unknown>;
	fetch(cursor: number, perPage: number): Promise<{ data: T[], total: number }>;
	refetchInterval?: number;
	refetchOnWindowFocus?: boolean;
	name: string;
	cursor?: number;
	perPage?: number;
	className?: ClassValue;
	sticky?: boolean;
	stickyTop?: number;
	searchParams?: Record<string, string>;
}>) {

	const { name, fetch } = props;

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
			{ ...props }
			cursor={ cursor }
			data={ data }
			perPage={ perPage }
			rowProps={ rowProps }
			total={ total }>
			{ children || <PaginationContent /> }
		</PaginationClient>
	);
}