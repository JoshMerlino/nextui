"use client";

import { useRouter } from "next/navigation";
import type { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Pagination } from ".";

export * from "./PaginationNav";
export * from "./PaginationPerPage";

type Dispatchable<T> = [T, Dispatch<SetStateAction<T>>];
type GetProps<T> = T extends React.ComponentType<infer P> | React.Component<infer P> ? P : never

const PaginationContext = createContext<{
	cursor: Dispatchable<number>
	loading: Dispatchable<boolean>
	perPage: Dispatchable<number>
	total: Dispatchable<number>
	rowProps?: Record<string, unknown>,
	name: string;
	data: unknown[];
	inheritProps: GetProps<typeof Pagination>
	refetch(options?: { passive?: boolean }): Promise<void>;

		} | undefined>(undefined);

export function usePagination<T>() {
	const context = useContext(PaginationContext);
	if (!context) throw new Error("usePagination must be used within a <Pagination/> component.");
	return context as typeof context & { data: T[] };
}

const DEFAULT_PER_PAGE = 10;
const DEFAULT_CURSOR = 1;

export function PaginationClient<T = unknown>(props: PropsWithChildren<
	GetProps<typeof Pagination> & {
		cursor: number;
		perPage: number;
		total: number;
		data: T[];
	}
	>) {
	
	const {
		fetch,
		children,
		cursor: defaultCursor = DEFAULT_CURSOR,
		perPage: defaultPerPage = DEFAULT_PER_PAGE,
		name,
		data: initialData = [],
		total: defaultTotal,
		rowProps,
	} = props;
	
	const [ cursor, setCursor ] = useState(defaultCursor);
	const [ data, setData ] = useState(initialData);
	const [ loading, setLoading ] = useState(false);
	const [ perPage, setPerPage ] = useState(defaultPerPage);
	const [ total, setTotal ] = useState(defaultTotal || initialData.length);
	const router = useRouter();

	/**
	 * Fetches the data from the server using the fetch function from props._1c-alt-icon
	 * @param options.passive Whether to set loading to true, used for refetching on window focus.
	 */
	const refetch = useCallback(async function refetch({ passive = false } = {}) {

		// Set loading to true to prevent multiple requests from being sent.
		if (!passive) setLoading(true);

		// Fetch the data from the server.
		const { data, total } = await fetch(cursor, perPage);

		// Set the data and the total.
		setData(data as T[]);
		setTotal(total);
		setLoading(false);
		
	}, [ cursor, fetch, perPage ]);
	
	useEffect(function() {
		if (cursor + perPage - 1 > total && total < perPage) {
			setCursor(Math.max(total - perPage + 1, 1));
			setTimeout(refetch, 1);
		} else refetch();

		// Await render to finish before refetching
	}, [ total, cursor, perPage, refetch ]);
	
	useEffect(function() {
		const url = new URL(window.location.href);
		if (perPage !== DEFAULT_PER_PAGE) url.searchParams.set([ name, "perPage" ].join("_"), perPage.toString());
		else url.searchParams.delete([ name, "perPage" ].join("_"));
		
		if (cursor !== DEFAULT_CURSOR) url.searchParams.set([ name, "cursor" ].join("_"), cursor.toString());
		else url.searchParams.delete([ name, "cursor" ].join("_"));
		window.history.replaceState(null, "", url.toString());
	}, [ cursor, name, perPage, router ]);

	return (
		<PaginationContext.Provider value={{
			name,
			data,
			rowProps,
			inheritProps: props,
			total: [ total, setTotal ],
			perPage: [ perPage, setPerPage ],
			cursor: [ cursor, setCursor ],
			loading: [ loading, setLoading ],
			refetch
		}}>
			{ children }
		</PaginationContext.Provider>
	);
}