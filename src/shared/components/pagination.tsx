"use client"

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface PaginationProps {
	currentPage: number
	totalPages: number
	pageSize: number
	totalItems: number
	onPageChange: (page: number) => void
	onPageSizeChange: (pageSize: number) => void
}

export function Pagination({
	currentPage,
	totalPages,
	pageSize,
	totalItems,
	onPageChange,
	onPageSizeChange,
}: PaginationProps) {
	const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
	const endItem = Math.min(currentPage * pageSize, totalItems)

	const canGoPrevious = currentPage > 1
	const canGoNext = currentPage < totalPages

	return (
		<div className="flex flex-col gap-4 border-t border-green-100 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex items-center gap-2">
				<span className="text-sm text-gray-700">Mostrar</span>
				<Select
					value={pageSize.toString()}
					onValueChange={(value) => onPageSizeChange(Number(value))}
				>
					<SelectTrigger className="h-8 w-[70px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="10">10</SelectItem>
						<SelectItem value="20">20</SelectItem>
						<SelectItem value="50">50</SelectItem>
						<SelectItem value="100">100</SelectItem>
					</SelectContent>
				</Select>
				<span className="text-sm text-gray-700">
					{startItem}-{endItem} de {totalItems} resultados
				</span>
			</div>

			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(1)}
					disabled={!canGoPrevious}
					className="h-8 w-8 p-0"
				>
					<ChevronsLeft className="h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={!canGoPrevious}
					className="h-8 w-8 p-0"
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>

				<span className="text-sm text-gray-700">
					Página {currentPage} de {totalPages}
				</span>

				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={!canGoNext}
					className="h-8 w-8 p-0"
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(totalPages)}
					disabled={!canGoNext}
					className="h-8 w-8 p-0"
				>
					<ChevronsRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	)
}
