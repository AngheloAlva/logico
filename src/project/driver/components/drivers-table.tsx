"use client"

import { Edit, Trash2, Truck, Search, CheckCircle, XCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import Link from "next/link"

import { deleteDriver } from "../actions/delete-driver"
import { getDrivers } from "../actions/get-drivers"

import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import {
	Table,
	TableRow,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
} from "@/shared/components/ui/table"
import { Pagination } from "@/shared/components/pagination"

export function DriversTable() {
	const [drivers, setDrivers] = useState<Awaited<ReturnType<typeof getDrivers>>["data"]>([])
	const [searchTerm, setSearchTerm] = useState("")
	const [loading, setLoading] = useState(true)
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [totalItems, setTotalItems] = useState(0)
	const [totalPages, setTotalPages] = useState(0)

	async function loadDrivers() {
		setLoading(true)
		const result = await getDrivers({ page: currentPage, pageSize, search: searchTerm })
		if (result.success && result.data) {
			setDrivers(result.data)
			setTotalItems(result.total || 0)
			setTotalPages(result.totalPages || 0)
		} else {
			toast.error(result.error || "Error al cargar motoristas")
		}
		setLoading(false)
	}

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			loadDrivers()
		}, 300)

		return () => clearTimeout(timeoutId)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, pageSize, searchTerm])

	async function handleDelete(id: string, name: string) {
		if (!confirm(`¿Eliminar motorista "${name}"?`)) return

		const result = await deleteDriver(id)
		if (result.success) {
			toast.success("Motorista eliminado")
			loadDrivers()
		} else {
			toast.error(result.error)
		}
	}


	if (loading) {
		return <div className="py-10 text-center">Cargando motoristas...</div>
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-4">
				<div className="relative flex-1">
					<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
					<Input
						placeholder="Buscar motoristas..."
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
								<TableHead className="font-semibold text-green-800">Motorista</TableHead>
								<TableHead className="font-semibold text-green-800">RUT</TableHead>
								<TableHead className="font-semibold text-green-800">Contacto</TableHead>
								<TableHead className="font-semibold text-green-800">Moto</TableHead>
								<TableHead className="font-semibold text-green-800">Estado</TableHead>
								<TableHead className="text-right font-semibold text-green-800">Acciones</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{drivers?.map((driver) => (
								<TableRow key={driver.id} className="border-green-100">
									<TableCell>
										<div className="flex items-center gap-3">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
												<Truck className="h-5 w-5 text-green-600" />
											</div>
											<div>
												<p className="font-medium">{driver.name}</p>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<p className="font-mono text-sm">{driver.rut}</p>
									</TableCell>
									<TableCell>
										<div>
											<p className="text-sm">{driver.phone}</p>
											<p className="text-muted-foreground text-xs">{driver.email}</p>
										</div>
									</TableCell>
									<TableCell>
										{driver.motorbike ? (
											<Badge variant="secondary" className="bg-green-100 text-green-800">
												{driver.motorbike.plate}
											</Badge>
										) : (
											<Badge variant="secondary" className="bg-gray-100 text-gray-600">
												Sin moto
											</Badge>
										)}
									</TableCell>
									<TableCell>
										{driver.active ? (
											<div className="flex items-center gap-1 text-green-600">
												<CheckCircle className="h-4 w-4" />
												<span className="text-sm">Activo</span>
											</div>
										) : (
											<div className="flex items-center gap-1 text-gray-500">
												<XCircle className="h-4 w-4" />
												<span className="text-sm">Inactivo</span>
											</div>
										)}
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end gap-2">
											<Link href={`/motoristas/${driver.id}`}>
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
												onClick={() => handleDelete(driver.id, driver.name)}
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
