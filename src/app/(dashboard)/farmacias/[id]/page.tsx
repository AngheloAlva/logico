"use client"

import { ArrowLeft, Save, Trash2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import Link from "next/link"

import { getPharmacyById } from "@/project/pharmacy/actions/get-pharmacy-by-id"
import { updatePharmacy } from "@/project/pharmacy/actions/update-pharmacy"
import { deletePharmacy } from "@/project/pharmacy/actions/delete-pharmacy"
import { getRegions } from "@/project/region/actions/get-regions"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
	Select,
	SelectItem,
	SelectValue,
	SelectTrigger,
	SelectContent,
} from "@/shared/components/ui/select"

import type { City } from "@/generated/prisma"

export default function EditarFarmaciaPage() {
	const params = useParams()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [loading, setLoading] = useState(true)
	const [regions, setRegions] = useState<Awaited<ReturnType<typeof getRegions>>["data"]>([])
	const [cities, setCities] = useState<City[]>([])
	const [formData, setFormData] = useState({
		name: "",
		address: "",
		contactName: "",
		contactPhone: "",
		contactEmail: "",
		regionId: "",
		cityId: "",
	})

	useEffect(() => {
		loadData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.id])

	useEffect(() => {
		if (formData.regionId) {
			const region = regions?.find((r) => r.id === formData.regionId)
			setCities(region?.cities || [])
		}
	}, [formData.regionId, regions])

	async function loadData() {
		setLoading(true)

		const [pharmacyResult, regionsResult] = await Promise.all([
			getPharmacyById(params.id as string),
			getRegions(),
		])

		if (regionsResult.success && regionsResult.data) {
			setRegions(regionsResult.data)
		}

		if (pharmacyResult.success && pharmacyResult.data) {
			const pharmacy = pharmacyResult.data
			setFormData({
				name: pharmacy.name,
				address: pharmacy.address,
				contactName: pharmacy.contactName,
				contactPhone: pharmacy.contactPhone,
				contactEmail: pharmacy.contactEmail,
				regionId: pharmacy.regionId,
				cityId: pharmacy.cityId,
			})

			// Set cities based on the region
			const region = regionsResult.data?.find((r) => r.id === pharmacy.regionId)
			if (region) {
				setCities(region.cities || [])
			}
		} else {
			toast.error(pharmacyResult.error || "Error al cargar farmacia")
			router.push("/farmacias")
		}

		setLoading(false)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		const result = await updatePharmacy(params.id as string, formData)

		if (result.success) {
			toast.success("Farmacia actualizada exitosamente")
			router.push("/farmacias")
		} else {
			toast.error(result.error || "Error al actualizar farmacia")
		}

		setIsLoading(false)
	}

	const handleDelete = async () => {
		if (!confirm(`¿Estás seguro de eliminar "${formData.name}"?`)) return

		const result = await deletePharmacy(params.id as string)
		if (result.success) {
			toast.success("Farmacia eliminada exitosamente")
			router.push("/farmacias")
		} else {
			toast.error(result.error || "Error al eliminar farmacia")
		}
	}

	if (loading) {
		return <div className="py-10 text-center">Cargando farmacia...</div>
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Link href="/farmacias">
						<Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Volver
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-green-800">Editar Farmacia</h1>
						<p className="text-muted-foreground">Actualiza la información de la farmacia</p>
					</div>
				</div>
				<Button
					variant="destructive"
					onClick={handleDelete}
					className="bg-red-600 hover:bg-red-700"
				>
					<Trash2 className="mr-2 h-4 w-4" />
					Eliminar Farmacia
				</Button>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<Card className="">
					<CardHeader>
						<CardTitle className="text-green-800">Información de la Farmacia</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="name">Nombre de la Farmacia *</Label>
								<Input
									id="name"
									placeholder="Ej: Farmacia Cruz Verde - Centro"
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="address">Dirección *</Label>
								<Input
									id="address"
									placeholder="Ej: Av. Libertador Bernardo O'Higgins 1234"
									value={formData.address}
									onChange={(e) => setFormData({ ...formData, address: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="region">Región *</Label>
								<Select
									value={formData.regionId}
									onValueChange={(value) => setFormData({ ...formData, regionId: value })}
									required
								>
									<SelectTrigger className="focus:border-green-500 focus:ring-green-500">
										<SelectValue placeholder="Selecciona una región" />
									</SelectTrigger>
									<SelectContent>
										{regions?.map((region) => (
											<SelectItem key={region.id} value={region.id}>
												{region.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="city">Ciudad *</Label>
								<Select
									value={formData.cityId}
									onValueChange={(value) => setFormData({ ...formData, cityId: value })}
									disabled={!formData.regionId}
									required
								>
									<SelectTrigger className="focus:border-green-500 focus:ring-green-500">
										<SelectValue placeholder="Selecciona una ciudad" />
									</SelectTrigger>
									<SelectContent>
										{cities.map((city) => (
											<SelectItem key={city.id} value={city.id}>
												{city.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="">
					<CardHeader>
						<CardTitle className="text-green-800">Información de Contacto</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-3">
							<div className="space-y-2">
								<Label htmlFor="contactName">Nombre del Contacto *</Label>
								<Input
									id="contactName"
									placeholder="Ej: Juan Pérez"
									value={formData.contactName}
									onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="contactPhone">Teléfono *</Label>
								<Input
									id="contactPhone"
									placeholder="Ej: +56 9 1234 5678"
									value={formData.contactPhone}
									onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="contactEmail">Correo Electrónico *</Label>
								<Input
									id="contactEmail"
									type="email"
									placeholder="Ej: contacto@farmacia.cl"
									value={formData.contactEmail}
									onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="flex justify-end gap-4">
					<Link href="/farmacias">
						<Button variant="outline" type="button">
							Cancelar
						</Button>
					</Link>
					<Button
						type="submit"
						disabled={isLoading}
						className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
					>
						<Save className="mr-2 h-4 w-4" />
						{isLoading ? "Guardando..." : "Guardar Cambios"}
					</Button>
				</div>
			</form>
		</div>
	)
}
