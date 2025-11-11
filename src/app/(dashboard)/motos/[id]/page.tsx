"use client"

import { ArrowLeft, Save, Trash2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import Link from "next/link"

import { getAvailableDrivers } from "@/project/driver/actions/get-available-drivers"
import { getMotorbikeById } from "@/project/motorbike/actions/get-motorbike-by-id"
import { updateMotorbike } from "@/project/motorbike/actions/update-motorbike"
import { deleteMotorbike } from "@/project/motorbike/actions/delete-motorbike"

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

export default function EditarMotoPage() {
	const params = useParams()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [loading, setLoading] = useState(true)
	const [drivers, setDrivers] = useState<Awaited<ReturnType<typeof getAvailableDrivers>>["data"]>(
		[]
	)
	const [formData, setFormData] = useState({
		brand: "",
		model: "",
		plate: "",
		class: "",
		color: "",
		cylinders: 0,
		year: 0,
		mileage: 0,
		driverId: "",
	})

	useEffect(() => {
		loadData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.id])

	async function loadData() {
		setLoading(true)

		const [motorbikeResult, driversResult] = await Promise.all([
			getMotorbikeById(params.id as string),
			getAvailableDrivers(),
		])

		if (driversResult.success && driversResult.data) {
			setDrivers(driversResult.data)
		}

		if (motorbikeResult.success && motorbikeResult.data) {
			const motorbike = motorbikeResult.data
			setFormData({
				brand: motorbike.brand,
				model: motorbike.model,
				plate: motorbike.plate,
				class: motorbike.class,
				color: motorbike.color,
				cylinders: motorbike.cylinders,
				year: motorbike.year,
				mileage: motorbike.mileage,
				driverId: motorbike.driverId || "",
			})
		} else {
			toast.error(motorbikeResult.error || "Error al cargar moto")
			router.push("/motos")
		}

		setLoading(false)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		const data = {
			...formData,
			driverId: formData.driverId || null,
		}

		const result = await updateMotorbike(params.id as string, data)

		if (result.success) {
			toast.success("Moto actualizada exitosamente")
			router.push("/motos")
		} else {
			toast.error(result.error || "Error al actualizar moto")
		}

		setIsLoading(false)
	}

	const handleDelete = async () => {
		if (!confirm(`¿Estás seguro de eliminar la moto "${formData.plate}"?`)) return

		const result = await deleteMotorbike(params.id as string)
		if (result.success) {
			toast.success("Moto eliminada exitosamente")
			router.push("/motos")
		} else {
			toast.error(result.error || "Error al eliminar moto")
		}
	}

	if (loading) {
		return <div className="py-10 text-center">Cargando moto...</div>
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Link href="/motos">
						<Button variant="outline" size="icon" className="text-green-600 hover:bg-green-50">
							<ArrowLeft className="h-4 w-4" />
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-green-800">Editar Moto</h1>
						<p className="text-muted-foreground">Actualiza la información de la motocicleta</p>
					</div>
				</div>
				<Button
					variant="destructive"
					onClick={handleDelete}
					className="bg-red-600 hover:bg-red-700"
				>
					<Trash2 className="h-4 w-4" />
					Eliminar Moto
				</Button>
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
									onChange={(e) =>
										setFormData({ ...formData, cylinders: parseInt(e.target.value) || 0 })
									}
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
									onChange={(e) =>
										setFormData({ ...formData, year: parseInt(e.target.value) || 0 })
									}
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
									onChange={(e) =>
										setFormData({ ...formData, mileage: parseInt(e.target.value) || 0 })
									}
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
								<SelectTrigger className="w-full focus:border-green-500 focus:ring-green-500">
									<SelectValue placeholder="Selecciona un motorista" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="no">Sin asignar</SelectItem>
									{drivers?.map((driver) => (
										<SelectItem key={driver.id} value={driver.id}>
											{driver.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
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
						<Save className="h-4 w-4" />
						{isLoading ? "Guardando..." : "Guardar Cambios"}
					</Button>
				</div>
			</form>
		</div>
	)
}
