"use client"

import { ArrowLeft, Save } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

import { createPharmacy } from "@/project/pharmacy/actions/create-pharmacy"
import { getRegions } from "@/project/region/actions/get-regions"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
	Select,
	SelectItem,
	SelectValue,
	SelectContent,
	SelectTrigger,
} from "@/shared/components/ui/select"

import type { City } from "@/generated/prisma"

export default function NuevaFarmaciaPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
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
		// eslint-disable-next-line react-hooks/immutability
		loadRegions()
	}, [])

	useEffect(() => {
		if (formData.regionId) {
			const region = regions?.find((r) => r.id === formData.regionId)
			setCities(region?.cities || [])
			setFormData((prev) => ({ ...prev, cityId: "" }))
		}
	}, [formData.regionId, regions])

	async function loadRegions() {
		const result = await getRegions()
		if (result.success && result.data) {
			setRegions(result.data)
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		const result = await createPharmacy(formData)

		if (result.success) {
			toast.success("Farmacia creada exitosamente")
			router.push("/farmacias")
		} else {
			toast.error(result.error || "Error al crear farmacia")
		}

		setIsLoading(false)
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Link href="/farmacias">
					<Button variant="outline" size="icon" className="text-green-600 hover:bg-green-50">
						<ArrowLeft className="h-4 w-4" />
					</Button>
				</Link>
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-green-800">Nueva Farmacia</h1>
					<p className="text-muted-foreground">Registra una nueva farmacia en el sistema</p>
				</div>
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
								<Label htmlFor="city">Ciudad *</Label>
								<Select
									value={formData.cityId}
									onValueChange={(value) => setFormData({ ...formData, cityId: value })}
									disabled={!formData.regionId}
									required
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
						<Save className="h-4 w-4" />
						{isLoading ? "Guardando..." : "Guardar Farmacia"}
					</Button>
				</div>
			</form>
		</div>
	)
}
