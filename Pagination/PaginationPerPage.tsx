"use client";

import { InputField } from "nextui/InputField";
import { usePagination } from ".";

export function PaginationPerPage({ amounts = [ 10, 25, 50, 100 ]}: Partial<{ amounts: number[] }>) {
	const { perPage: [ perPage, setPerPage ], cursor: [ cursor, setCursor ], total: [ total ] } = usePagination();
	return (
		<div className="my-2 flex items-center gap-2 text-gray-900 dark:text-white font-medium text-sm">
			<p>Show</p>
			<InputField
				onChange={ e => [
					setPerPage(parseInt(e.target.value)),
					setCursor(Math.min(cursor, Math.ceil(total / parseInt(e.target.value)) * parseInt(e.target.value)))
				] }
				options={ amounts
					.filter((a, b, c) => total > a || total + perPage > c[b - 1])
					.map(a => a + "") }
				style={{ width: "32px" }}
				type="select"
				value={ perPage.toString() }
			/>
			<p>items per page</p>
		</div>
	);
}