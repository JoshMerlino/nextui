"use client";

import { InputField } from "nextui/InputField";
import { usePagination } from ".";

export function PaginationPerPage({ amounts = [ 10, 25, 50, 100 ]}: Partial<{ amounts: number[] }>) {
	const { perPage: [ perPage, setPerPage ], cursor: [ cursor, setCursor ], total: [ total ], name } = usePagination();
	return (
		<div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
			<p>Show</p>
			<InputField
				id={ "pagination-per-page-" + name }
				onChange={ e => [
					setPerPage(parseInt(e.target.value)),
					setCursor(Math.min(cursor, Math.ceil(total / parseInt(e.target.value)) * parseInt(e.target.value)))
				] }
				options={ amounts.map(a => a.toString()) }
				style={{ width: "32px" }}
				type="select"
				value={ perPage.toString() }
			/>
			<p>items per page</p>
		</div>
	);
}