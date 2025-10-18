"use client"

import { Edit, Trash2, Building2, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import Link from "next/link"

import { Card, CardContent } from "@/shared/components/ui/card"
import { deletePharmacy } from "../actions/delete-pharmacy"
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

	async function loadPharmacies() {
		setLoading(true)
		const result = await getPharmacies()
		if (result.success && result.data) {
			setPharmacies(result.data as Pharmacy[])
		} else {
			toast.error(result.error || "Error al cargar farmacias")
		}
		setLoading(false)
	}

	useEffect(() => {
		loadPharmacies()
	}, [])

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

	const filteredPharmacies = pharmacies.filter(
		(pharmacy) =>
			pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			pharmacy.city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase())
	)

	if (loading) {
		return <div className="py-10 text-center">Cargando farmacias...</div>
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
						className="pl-9 focus:border-green-500 focus:ring-green-500"
					/>
				</div>
			</div>

			<Card className="">
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
							{filteredPharmacies.map((pharmacy) => (
								<TableRow key={pharmacy.id} className="border-green-100">
									<TableCell>
										<div className="flex items-center gap-3">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
												<Building2 className="h-5 w-5 text-green-600" />
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
										<div className="flex justify-end gap-2">
											<Link href={`/farmacias/${pharmacy.id}`}>
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
				</CardContent>
			</Card>
		</div>
	)
}
