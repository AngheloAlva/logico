"use client"

import { Edit, Trash2, Search, HospitalIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import Link from "next/link"

import { Card, CardContent } from "@/shared/components/ui/card"
import { deletePharmacy } from "../actions/delete-pharmacy"
import { Pagination } from "@/shared/components/pagination"
import { getPharmacies } from "../actions/get-pharmacies"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
	Table,
	TableRow,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
} from "@/shared/components/ui/table"
import { Skeleton } from "@/shared/components/ui/skeleton"

interface Pharmacy {
	id: string
	name: string
	address: string
	region: { id: string; name: string }
	city: { id: string; name: string }
	contactName: string
	contactPhone: string
	contactEmail: string
}

export function PharmaciesTable() {
	const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
	const [searchTerm, setSearchTerm] = useState("")
	const [loading, setLoading] = useState(true)
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [totalItems, setTotalItems] = useState(0)
	const [totalPages, setTotalPages] = useState(0)

	async function loadPharmacies() {
		setLoading(true)
		const result = await getPharmacies({ page: currentPage, pageSize, search: searchTerm })
		if (result.success && result.data) {
			setPharmacies(result.data as Pharmacy[])
			setTotalItems(result.total || 0)
			setTotalPages(result.totalPages || 0)
		} else {
			toast.error(result.error || "Error al cargar farmacias")
		}
		setLoading(false)
	}

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			loadPharmacies()
		}, 300)

		return () => clearTimeout(timeoutId)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, pageSize, searchTerm])

	async function handleDelete(id: string, name: string) {
		if (!confirm(`¿Estás seguro de eliminar "${name}"?`)) return

		const result = await deletePharmacy(id)
		if (result.success) {
			toast.success("Farmacia eliminada exitosamente")
			loadPharmacies()
		} else {
			toast.error(result.error || "Error al eliminar farmacia")
		}
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-4">
				<div className="relative flex-1">
					<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
					<Input
						placeholder="Buscar farmacias..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="bg-white pl-9 focus:border-green-500 focus:ring-green-500"
					/>
				</div>
			</div>

			<Card className="py-0">
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-green-50/50">
								<TableHead className="font-semibold text-green-800">Farmacia</TableHead>
								<TableHead className="font-semibold text-green-800">Ubicación</TableHead>
								<TableHead className="font-semibold text-green-800">Contacto</TableHead>
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
								: pharmacies.map((pharmacy) => (
										<TableRow key={pharmacy.id} className="border-green-100">
											<TableCell>
												<div className="flex items-center gap-3">
													<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
														<HospitalIcon className="h-5 w-5 text-green-600" />
													</div>
													<div>
														<p className="font-medium">{pharmacy.name}</p>
														<p className="text-muted-foreground text-sm">{pharmacy.address}</p>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div>
													<p className="text-sm font-medium">{pharmacy.city.name}</p>
													<p className="text-muted-foreground text-xs">{pharmacy.region.name}</p>
												</div>
											</TableCell>
											<TableCell>
												<div>
													<p className="text-sm font-medium">{pharmacy.contactName}</p>
													<p className="text-muted-foreground text-xs">{pharmacy.contactPhone}</p>
													<p className="text-muted-foreground text-xs">{pharmacy.contactEmail}</p>
												</div>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end">
													<Link href={`/farmacias/${pharmacy.id}`}>
														<Button
															size="sm"
															variant="ghost"
															className="text-green-600 hover:bg-green-50 hover:text-green-700"
														>
															<Edit className="h-4 w-4" />
														</Button>
													</Link>
													<Button
														size="sm"
														variant="ghost"
														onClick={() => handleDelete(pharmacy.id, pharmacy.name)}
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
