"use client"

import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

import { getAvailableDrivers } from "@/project/driver/actions/get-available-drivers"
import { createMovement } from "@/project/movement/actions/create-movement"
import { getPharmacies } from "@/project/pharmacy/actions/get-pharmacies"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Switch } from "@/shared/components/ui/switch"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
	Select,
	SelectItem,
	SelectValue,
	SelectTrigger,
	SelectContent,
} from "@/shared/components/ui/select"

import type { Pharmacy } from "@/generated/prisma"
import type { Driver } from "@/generated/prisma"

export default function NuevoMovimientoPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
	const [drivers, setDrivers] = useState<Driver[]>([])
	const [formData, setFormData] = useState({
		number: "",
		pharmacyId: "",
		driverId: "",
		address: "",
		hasRecipe: false,
		segments: 1,
		segmentCost: "",
	})
	const [segmentAddresses, setSegmentAddresses] = useState<string[]>([""])

	useEffect(() => {
		async function loadData() {
			const [pharmaciesResult, driversResult] = await Promise.all([
				getPharmacies(),
				getAvailableDrivers(),
			])

			if (pharmaciesResult.success && pharmaciesResult.data) {
				setPharmacies(pharmaciesResult.data)
			}

			if (driversResult.success && driversResult.data) {
				setDrivers(driversResult.data)
			}
		}
		loadData()
	}, [])

	const addSegment = () => {
		setSegmentAddresses([...segmentAddresses, ""])
		setFormData({ ...formData, segments: formData.segments + 1 })
	}

	const removeSegment = (index: number) => {
		setSegmentAddresses(segmentAddresses.filter((_, i) => i !== index))
		setFormData({ ...formData, segments: formData.segments - 1 })
	}

	const updateSegmentAddress = (index: number, value: string) => {
		const newAddresses = [...segmentAddresses]
		newAddresses[index] = value
		setSegmentAddresses(newAddresses)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		// Determinar el tipo de movimiento según las características
		let type: "ENTREGA" | "ENTREGA_CON_RECETA" | "REINTENTO" | "ENTREGA_VARIAS_DIRECCIONES" =
			"ENTREGA"

		if (formData.hasRecipe) {
			type = "ENTREGA_CON_RECETA"
		} else if (segmentAddresses.filter((addr) => addr.trim() !== "").length > 0) {
			type = "ENTREGA_VARIAS_DIRECCIONES"
		}

		const data = {
			...formData,
			type,
			retryCount: 0,
			segmentCost: parseInt(formData.segmentCost) || 0,
			segmentsAddress: segmentAddresses.filter((addr) => addr.trim() !== ""),
		}

		const result = await createMovement(data)

		if (result.success) {
			toast.success("Movimiento creado exitosamente")
			router.push("/movimientos")
		} else {
			toast.error(result.error || "Error al crear movimiento")
		}

		setIsLoading(false)
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Link href="/movimientos">
					<Button variant="outline" size="icon" className="text-green-600 hover:bg-green-50">
						<ArrowLeft className="h-4 w-4" />
					</Button>
				</Link>
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-green-800">Nuevo Movimiento</h1>
					<p className="text-muted-foreground">Registra un nuevo despacho en el sistema</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<Card className="">
					<CardHeader>
						<CardTitle className="text-green-800">Información del Despacho</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="number">Número de Despacho *</Label>
								<Input
									id="number"
									placeholder="Mínimo 10 caracteres"
									value={formData.number}
									onChange={(e) => setFormData({ ...formData, number: e.target.value })}
									required
									minLength={10}
									className="focus:border-green-500 focus:ring-green-500"
								/>
								<p className="text-muted-foreground text-xs">
									El número debe tener al menos 10 caracteres
								</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="pharmacy">Farmacia *</Label>
								<Select
									value={formData.pharmacyId}
									onValueChange={(value) => setFormData({ ...formData, pharmacyId: value })}
								>
									<SelectTrigger className="w-full focus:border-green-500 focus:ring-green-500">
										<SelectValue placeholder="Selecciona una farmacia" />
									</SelectTrigger>
									<SelectContent>
										{pharmacies.map((pharmacy) => (
											<SelectItem key={pharmacy.id} value={pharmacy.id}>
												{pharmacy.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="driver">Motorista *</Label>
								<Select
									value={formData.driverId}
									onValueChange={(value) => setFormData({ ...formData, driverId: value })}
								>
									<SelectTrigger className="w-full focus:border-green-500 focus:ring-green-500">
										<SelectValue placeholder="Selecciona un motorista" />
									</SelectTrigger>
									<SelectContent>
										{drivers.map((driver) => (
											<SelectItem key={driver.id} value={driver.id}>
												{driver.firstName} {driver.paternalLastName}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="address">Dirección de Entrega *</Label>
								<Input
									id="address"
									placeholder="Ej: Av. Libertador 1234, Depto 501"
									value={formData.address}
									onChange={(e) => setFormData({ ...formData, address: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>
						</div>

						<div className="flex items-center justify-between rounded-lg border p-4">
							<div className="space-y-0.5">
								<Label htmlFor="hasRecipe">Pedido con Receta Médica</Label>
								<p className="text-muted-foreground text-sm">
									Indica si este pedido requiere retiro previo de receta
								</p>
							</div>
							<Switch
								id="hasRecipe"
								checked={formData.hasRecipe}
								onCheckedChange={(checked) => setFormData({ ...formData, hasRecipe: checked })}
							/>
						</div>
					</CardContent>
				</Card>

				<Card className="">
					<CardHeader>
						<CardTitle className="text-green-800">Información de Costos</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="segments">Número de Segmentos</Label>
								<Input
									id="segments"
									type="number"
									min="1"
									value={formData.segments}
									onChange={(e) =>
										setFormData({ ...formData, segments: parseInt(e.target.value) || 1 })
									}
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="segmentCost">Costo por Segmento (CLP)</Label>
								<Input
									id="segmentCost"
									type="number"
									placeholder="Ej: 2500"
									value={formData.segmentCost}
									onChange={(e) => setFormData({ ...formData, segmentCost: e.target.value })}
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="">
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle className="text-green-800">Direcciones Adicionales (Opcional)</CardTitle>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={addSegment}
							className="border-green-300 text-green-600 hover:bg-green-50"
						>
							<Plus className="h-4 w-4" />
							Agregar Dirección
						</Button>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground text-sm">
							Agrega direcciones adicionales si el motorista debe realizar múltiples paradas
						</p>
						{segmentAddresses.map((address, index) => (
							<div key={index} className="flex gap-2">
								<div className="flex-1">
									<Input
										placeholder={`Dirección adicional ${index + 1}`}
										value={address}
										onChange={(e) => updateSegmentAddress(index, e.target.value)}
										className="focus:border-green-500 focus:ring-green-500"
									/>
								</div>
								{segmentAddresses.length > 1 && (
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => removeSegment(index)}
										className="text-red-600 hover:bg-red-50"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								)}
							</div>
						))}
					</CardContent>
				</Card>

				<div className="flex justify-end gap-4">
					<Link href="/movimientos">
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
						{isLoading ? "Guardando..." : "Crear Movimiento"}
					</Button>
				</div>
			</form>
		</div>
	)
}
