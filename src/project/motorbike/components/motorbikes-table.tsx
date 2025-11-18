"use client"

import { Edit, Trash2, Bike, Search, User } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import Link from "next/link"

import { getMotorbikes } from "../actions/get-motorbikes"

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

export function MotorbikesTable() {
	const [motorbikes, setMotorbikes] = useState<Awaited<ReturnType<typeof getMotorbikes>>["data"]>(
		[]
	)
	const [searchTerm, setSearchTerm] = useState("")
	const [loading, setLoading] = useState(true)
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [totalItems, setTotalItems] = useState(0)
	const [totalPages, setTotalPages] = useState(0)

	useEffect(() => {
		async function loadMotorbikes() {
			setLoading(true)
			const result = await getMotorbikes({ page: currentPage, pageSize, search: searchTerm })
			if (result.success && result.data) {
				setMotorbikes(result.data)
				setTotalItems(result.total || 0)
				setTotalPages(result.totalPages || 0)
			} else {
				toast.error(result.error || "Error al cargar motos")
			}
			setLoading(false)
		}

		const timeoutId = setTimeout(() => {
			loadMotorbikes()
		}, 300)

		return () => clearTimeout(timeoutId)
	}, [currentPage, pageSize, searchTerm])

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-4">
				<div className="relative flex-1">
					<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
					<Input
						placeholder="Buscar motos..."
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
								<TableHead className="font-semibold text-green-800">Moto</TableHead>
								<TableHead className="font-semibold text-green-800">Patente</TableHead>
								<TableHead className="font-semibold text-green-800">Chasis</TableHead>
								<TableHead className="font-semibold text-green-800">Propietario</TableHead>
								<TableHead className="font-semibold text-green-800">Motorista</TableHead>
								<TableHead className="text-right font-semibold text-green-800">Acciones</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{loading
								? Array.from({ length: pageSize }).map((_, index) => (
										<TableRow key={index}>
											<TableCell colSpan={6}>
												<Skeleton className="h-10" />
											</TableCell>
										</TableRow>
									))
								: motorbikes?.map((motorbike) => (
										<TableRow key={motorbike.id} className="border-green-100">
											<TableCell>
												<div className="flex items-center gap-3">
													<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
														<Bike className="h-5 w-5 text-green-600" />
													</div>
													<div>
														<p className="font-medium">
															{motorbike.brand} {motorbike.model}
														</p>
														<p className="text-muted-foreground text-sm">
															{motorbike.color} • {motorbike.year}
														</p>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<Badge variant="secondary" className="bg-gray-100 font-mono text-gray-900">
													{motorbike.plate}
												</Badge>
											</TableCell>
											<TableCell>
												<div className="text-sm">
													<p className="font-mono text-xs text-gray-700">
														{motorbike.chassisNumber}
													</p>
													<p className="text-muted-foreground text-xs">
														Motor: {motorbike.engineNumber}
													</p>
												</div>
											</TableCell>
											<TableCell>
												<Badge
													variant="secondary"
													className={
														motorbike.owner === "EMPRESA"
															? "bg-blue-100 text-blue-800"
															: "bg-purple-100 text-purple-800"
													}
												>
													{motorbike.owner === "EMPRESA" ? "Empresa" : "Motorista"}
												</Badge>
											</TableCell>
											<TableCell>
												{motorbike.driver ? (
													<div className="flex items-center gap-2">
														<div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
															<User className="h-3 w-3 text-green-600" />
														</div>
														<span className="text-sm">
															{motorbike.driver.firstName} {motorbike.driver.paternalLastName}
														</span>
													</div>
												) : (
													<Badge variant="secondary" className="bg-orange-100 text-orange-800">
														Disponible
													</Badge>
												)}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end">
													<Link href={`/motos/${motorbike.id}`}>
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
