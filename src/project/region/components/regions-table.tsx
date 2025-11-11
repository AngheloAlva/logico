"use client"

import { Edit, Trash2, MapPin, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import Link from "next/link"

import { deleteRegion } from "../actions/delete-region"
import { getRegions } from "../actions/get-regions"

import { Card, CardContent } from "@/shared/components/ui/card"
import { Pagination } from "@/shared/components/pagination"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import {
	Table,
	TableRow,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
} from "@/shared/components/ui/table"

interface Region {
	id: string
	name: string
	cities: Array<{ id: string; name: string }>
	createdAt: Date
}

export function RegionsTable() {
	const [regions, setRegions] = useState<Region[]>([])
	const [searchTerm, setSearchTerm] = useState("")
	const [loading, setLoading] = useState(true)
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [totalItems, setTotalItems] = useState(0)
	const [totalPages, setTotalPages] = useState(0)

	useEffect(() => {
		async function loadRegions() {
			setLoading(true)
			const result = await getRegions({ page: currentPage, pageSize, search: searchTerm })
			if (result.success && result.data) {
				setRegions(result.data as Region[])
				setTotalItems(result.total || 0)
				setTotalPages(result.totalPages || 0)
			} else {
				toast.error(result.error || "Error al cargar regiones")
			}
			setLoading(false)
		}

		const timeoutId = setTimeout(() => {
			void loadRegions()
		}, 300)

		return () => clearTimeout(timeoutId)
	}, [currentPage, pageSize, searchTerm])

	async function loadRegions() {
		setLoading(true)
		const result = await getRegions({ page: currentPage, pageSize, search: searchTerm })
		if (result.success && result.data) {
			setRegions(result.data as Region[])
			setTotalItems(result.total || 0)
			setTotalPages(result.totalPages || 0)
		} else {
			toast.error(result.error || "Error al cargar regiones")
		}
		setLoading(false)
	}

	async function handleDelete(id: string, name: string) {
		if (!confirm(`¿Estás seguro de eliminar la región "${name}"?`)) return

		const result = await deleteRegion(id)
		if (result.success) {
			toast.success("Región eliminada exitosamente")
			loadRegions()
		} else {
			toast.error(result.error || "Error al eliminar región")
		}
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-4">
				<div className="relative flex-1">
					<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
					<Input
						placeholder="Buscar regiones..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="bg-white pl-9 focus:border-green-500 focus:ring-green-500"
					/>
				</div>
			</div>

			<Card className="">
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-green-50/50">
								<TableHead className="font-semibold text-green-800">Región</TableHead>
								<TableHead className="font-semibold text-green-800">Ciudades</TableHead>
								<TableHead className="font-semibold text-green-800">Total</TableHead>
								<TableHead className="text-right font-semibold text-green-800">Acciones</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{loading
								? Array.from({ length: pageSize }).map((_, index) => (
										<TableRow key={index}>
											<TableCell colSpan={4}>
												<Skeleton className="h-10" />
											</TableCell>
										</TableRow>
									))
								: regions.map((region) => (
										<TableRow key={region.id} className="border-green-100">
											<TableCell>
												<div className="flex items-center gap-3">
													<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
														<MapPin className="h-5 w-5 text-green-600" />
													</div>
													<div>
														<p className="font-medium">{region.name}</p>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex flex-wrap gap-1">
													{region.cities.slice(0, 5).map((city, index) => (
														<Badge
															key={index}
															variant="secondary"
															className="bg-green-100 text-green-800"
														>
															{city.name}
														</Badge>
													))}
													{region.cities.length > 5 && (
														<Badge variant="secondary" className="bg-green-100 text-green-800">
															+ {region.cities.length - 5}
														</Badge>
													)}
												</div>
											</TableCell>
											<TableCell>
												<Badge variant="secondary" className="bg-blue-100 text-blue-800">
													{region.cities.length}{" "}
													{region.cities.length === 1 ? "ciudad" : "ciudades"}
												</Badge>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end">
													<Link href={`/regiones/${region.id}`}>
														<Button
															variant="ghost"
															size="sm"
															className="text-green-600 hover:bg-green-50 hover:text-green-700"
														>
															<Edit className="h-4 w-4" />
														</Button>
													</Link>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => handleDelete(region.id, region.name)}
														className="text-red-600 hover:bg-red-50 hover:text-red-700"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
						</TableBody>
					</Table>
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						pageSize={pageSize}
						totalItems={totalItems}
						onPageChange={setCurrentPage}
						onPageSizeChange={setPageSize}
					/>
				</CardContent>
			</Card>
		</div>
	)
}
