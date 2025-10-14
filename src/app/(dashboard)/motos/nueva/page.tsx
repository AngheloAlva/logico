"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { ArrowLeft, Save, Upload } from "lucide-react"
import Link from "next/link"

export default function NuevaMotoPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [formData, setFormData] = useState({
		brand: "",
		model: "",
		plate: "",
		class: "",
		color: "",
		cylinders: "",
		year: "",
		mileage: "",
		driverId: "",
		imageFile: null as File | null,
	})

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFormData({ ...formData, imageFile: e.target.files[0] })
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			// TODO: Implement API call to create motorbike
			await new Promise((resolve) => setTimeout(resolve, 1000))
			router.push("/motos")
		} catch (error) {
			console.error(error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Link href="/motos">
					<Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Volver
					</Button>
				</Link>
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-green-800">Nueva Moto</h1>
					<p className="text-muted-foreground">Registra una nueva motocicleta en el sistema</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<Card className="">
					<CardHeader>
						<CardTitle className="text-green-800">Información del Vehículo</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="brand">Marca *</Label>
								<Input
									id="brand"
									placeholder="Ej: Honda"
									value={formData.brand}
									onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="model">Modelo *</Label>
								<Input
									id="model"
									placeholder="Ej: Wave 110"
									value={formData.model}
									onChange={(e) => setFormData({ ...formData, model: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="plate">Patente *</Label>
								<Input
									id="plate"
									placeholder="Ej: AB-CD-12"
									value={formData.plate}
									onChange={(e) =>
										setFormData({ ...formData, plate: e.target.value.toUpperCase() })
									}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="class">Clase *</Label>
								<Input
									id="class"
									placeholder="Ej: Motocicleta"
									value={formData.class}
									onChange={(e) => setFormData({ ...formData, class: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="color">Color *</Label>
								<Input
									id="color"
									placeholder="Ej: Rojo"
									value={formData.color}
									onChange={(e) => setFormData({ ...formData, color: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="cylinders">Cilindrada (cc) *</Label>
								<Input
									id="cylinders"
									type="number"
									placeholder="Ej: 110"
									value={formData.cylinders}
									onChange={(e) => setFormData({ ...formData, cylinders: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="year">Año *</Label>
								<Input
									id="year"
									type="number"
									placeholder="Ej: 2023"
									value={formData.year}
									onChange={(e) => setFormData({ ...formData, year: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="mileage">Kilometraje *</Label>
								<Input
									id="mileage"
									type="number"
									placeholder="Ej: 15000"
									value={formData.mileage}
									onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="">
					<CardHeader>
						<CardTitle className="text-green-800">Asignación</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="driver">Motorista (Opcional)</Label>
							<Select
								value={formData.driverId}
								onValueChange={(value) => setFormData({ ...formData, driverId: value })}
							>
								<SelectTrigger className="focus:border-green-500 focus:ring-green-500">
									<SelectValue placeholder="Selecciona un motorista" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">Sin asignar</SelectItem>
									<SelectItem value="1">Juan Pérez</SelectItem>
									<SelectItem value="2">María González</SelectItem>
									<SelectItem value="3">Carlos Rodríguez</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				<Card className="">
					<CardHeader>
						<CardTitle className="text-green-800">Imagen del Vehículo</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="image">Fotografía de la Moto</Label>
							<div className="flex items-center gap-4">
								<Input
									id="image"
									type="file"
									accept="image/*"
									onChange={handleFileChange}
									className="focus:border-green-500 focus:ring-green-500"
								/>
								<Button type="button" variant="outline" size="sm">
									<Upload className="mr-2 h-4 w-4" />
									Subir
								</Button>
							</div>
							{formData.imageFile && (
								<p className="text-muted-foreground text-sm">
									Archivo seleccionado: {formData.imageFile.name}
								</p>
							)}
						</div>
					</CardContent>
				</Card>

				<div className="flex justify-end gap-4">
					<Link href="/motos">
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
						{isLoading ? "Guardando..." : "Guardar Moto"}
					</Button>
				</div>
			</form>
		</div>
	)
}
