"use client";

import { useRouter } from "next/navigation";
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useCallback, useContext, useEffect, useState } from "react";

export * from "./PaginationNav";
export * from "./PaginationPerPage";

const PaginationContext = createContext<{
	name: string;
	cursor: [number, Dispatch<SetStateAction<number>>];
	perPage: [number, Dispatch<SetStateAction<number>>];
	total: [number, Dispatch<SetStateAction<number>>];
	loading: [boolean, Dispatch<SetStateAction<boolean>>];
	data: any[];
	refetch(passive?: boolean): Promise<void>;
		}>({} as any);

export function usePagination<T>() {
	const context = useContext(PaginationContext);
	return context as typeof context & { data: T[] };
}

const DEFAULT_PER_PAGE = 10;
const DEFAULT_CURSOR = 1;

export function Pagination({ fetch, children, cursor: defaultCursor = DEFAULT_CURSOR, perPage: defaultPerPage = DEFAULT_PER_PAGE, name, initialData = [], total: defaultTotal }: PropsWithChildren<Partial<{
	cursor: number;
	perPage: number;
	total: number;
}> & {
	name: string,
	initialData?: any[],
	fetch(cursor: number, perPage: number): Promise<{ data: any[], total: number }>,
}>) {

	const [ cursor, setCursor ] = useState(defaultCursor);
	const [ data, setData ] = useState(initialData);
	const [ loading, setLoading ] = useState(false);
	const [ perPage, setPerPage ] = useState(defaultPerPage);
	const [ total, setTotal ] = useState(defaultTotal || initialData.length);
	const router = useRouter();

	const refetch = useCallback(async function refetch(passive = false) {
		if (!passive) setLoading(true);
		fetch(cursor, perPage)
			.then(({ data, total }) => [
				setData(data),
				setTotal(total)
			])
			.finally(() => setLoading(false));
	}, [ cursor, fetch, perPage ]);

	useEffect(function() {
		refetch(true);
	}, [ cursor, fetch, perPage, refetch, total ]);
	
	useEffect(function() {
		const url = new URL(window.location.href);
		if (perPage !== DEFAULT_PER_PAGE) url.searchParams.set([ name, "perpage" ].join("_"), perPage.toString());
		else url.searchParams.delete([ name, "perpage" ].join("_"));
		if (cursor !== DEFAULT_CURSOR) url.searchParams.set([ name, "cursor" ].join("_"), cursor.toString());
		else url.searchParams.delete([ name, "cursor" ].join("_"));
		router.replace(url.toString(), { scroll: false });
	}, [ cursor, name, perPage, router ]);

	return (
		<PaginationContext.Provider value={{
			name,
			data,
			total: [ total, setTotal ],
			perPage: [ perPage, setPerPage ],
			cursor: [ cursor, setCursor ],
			loading: [ loading, setLoading ],
			refetch
		}}>
			{children}
		</PaginationContext.Provider>
	);
}