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

import type { City, Province } from "@/generated/prisma"

type ProvinceWithCities = Province & { cities: City[] }

export default function EditarFarmaciaPage() {
	const params = useParams()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [loading, setLoading] = useState(true)
	const [regions, setRegions] = useState<Awaited<ReturnType<typeof getRegions>>["data"]>([])
	const [provinces, setProvinces] = useState<ProvinceWithCities[]>([])
	const [cities, setCities] = useState<City[]>([])
	const [formData, setFormData] = useState({
		code: "",
		name: "",
		address: "",
		phone: "",
		openingTime: "",
		closingTime: "",
		latitude: 0,
		longitude: 0,
		regionId: "",
		provinceId: "",
		cityId: "",
	})

	useEffect(() => {
		loadData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.id])

	useEffect(() => {
		if (formData.regionId) {
			const region = regions?.find((r) => r.id === formData.regionId)
			setProvinces(region?.provinces || [])
		}
	}, [formData.regionId, regions])

	useEffect(() => {
		if (formData.provinceId) {
			const province = provinces?.find((p) => p.id === formData.provinceId)
			setCities(province?.cities || [])
		}
	}, [formData.provinceId, provinces])

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
				code: pharmacy.code,
				name: pharmacy.name,
				address: pharmacy.address,
				phone: pharmacy.phone,
				openingTime: pharmacy.openingTime,
				closingTime: pharmacy.closingTime,
				latitude: pharmacy.latitude,
				longitude: pharmacy.longitude,
				regionId: pharmacy.regionId,
				provinceId: pharmacy.provinceId,
				cityId: pharmacy.cityId,
			})

			// Set provinces and cities based on region and province
			const region = regionsResult.data?.find((r) => r.id === pharmacy.regionId)
			if (region) {
				setProvinces(region.provinces || [])
				const province = region.provinces?.find((p) => p.id === pharmacy.provinceId)
				if (province) {
					setCities(province.cities || [])
				}
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
						<Button variant="outline" size="icon" className="text-green-600 hover:bg-green-50">
							<ArrowLeft className="h-4 w-4" />
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
					<Trash2 className="h-4 w-4" />
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
								<Label htmlFor="code">Código *</Label>
								<Input
									id="code"
									placeholder="Ej: FARM001"
									value={formData.code}
									onChange={(e) => setFormData({ ...formData, code: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

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

							<div className="space-y-2 md:col-span-2">
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
								<Label htmlFor="phone">Teléfono *</Label>
								<Input
									id="phone"
									placeholder="Ej: +56 2 1234 5678"
									value={formData.phone}
									onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="openingTime">Horario de Apertura *</Label>
								<Input
									id="openingTime"
									type="time"
									value={formData.openingTime}
									onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="closingTime">Horario de Cierre *</Label>
								<Input
									id="closingTime"
									type="time"
									value={formData.closingTime}
									onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="">
					<CardHeader>
						<CardTitle className="text-green-800">Ubicación</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-3">
							<div className="space-y-2">
								<Label htmlFor="region">Región *</Label>
								<Select
									value={formData.regionId}
									onValueChange={(value) =>
										setFormData({ ...formData, regionId: value, provinceId: "", cityId: "" })
									}
								>
									<SelectTrigger className="w-full focus:border-green-500 focus:ring-green-500">
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
								<Label htmlFor="province">Provincia *</Label>
								<Select
									value={formData.provinceId}
									onValueChange={(value) =>
										setFormData({ ...formData, provinceId: value, cityId: "" })
									}
									disabled={!formData.regionId}
								>
									<SelectTrigger className="w-full focus:border-green-500 focus:ring-green-500">
										<SelectValue placeholder="Selecciona una provincia" />
									</SelectTrigger>
									<SelectContent>
										{provinces.map((province) => (
											<SelectItem key={province.id} value={province.id}>
												{province.name}
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
									disabled={!formData.provinceId}
								>
									<SelectTrigger className="w-full focus:border-green-500 focus:ring-green-500">
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

						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="latitude">Latitud *</Label>
								<Input
									id="latitude"
									type="number"
									step="any"
									placeholder="Ej: -33.4489"
									value={formData.latitude}
									onChange={(e) =>
										setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })
									}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
								<p className="text-muted-foreground text-xs">Coordenada de latitud (-90 a 90)</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="longitude">Longitud *</Label>
								<Input
									id="longitude"
									type="number"
									step="any"
									placeholder="Ej: -70.6693"
									value={formData.longitude}
									onChange={(e) =>
										setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })
									}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
								<p className="text-muted-foreground text-xs">Coordenada de longitud (-180 a 180)</p>
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
						<Save className="h-4 w-4" />
						{isLoading ? "Guardando..." : "Guardar Cambios"}
					</Button>
				</div>
			</form>
		</div>
	)
}
