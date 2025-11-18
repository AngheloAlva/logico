"use client"

import { ArrowLeft, Save, Trash2, FileText } from "lucide-react"
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
import { Badge } from "@/shared/components/ui/badge"
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
	const [motorbikeData, setMotorbikeData] =
		useState<Awaited<ReturnType<typeof getMotorbikeById>>["data"]>(undefined)
	const [formData, setFormData] = useState({
		brand: "",
		model: "",
		plate: "",
		color: "",
		year: 0,
		chassisNumber: "",
		engineNumber: "",
		owner: "EMPRESA" as "EMPRESA" | "MOTORISTA",
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
			setMotorbikeData(motorbike)
			setFormData({
				brand: motorbike.brand,
				model: motorbike.model,
				plate: motorbike.plate,
				color: motorbike.color,
				year: motorbike.year,
				chassisNumber: motorbike.chassisNumber,
				engineNumber: motorbike.engineNumber,
				owner: motorbike.owner,
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
								<Label htmlFor="chassisNumber">Número de Chasis *</Label>
								<Input
									id="chassisNumber"
									placeholder="Ej: 1HGBH41JXMN109186"
									value={formData.chassisNumber}
									onChange={(e) =>
										setFormData({ ...formData, chassisNumber: e.target.value.toUpperCase() })
									}
									required
									className="font-mono focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="engineNumber">Número de Motor *</Label>
								<Input
									id="engineNumber"
									placeholder="Ej: G13BB123456"
									value={formData.engineNumber}
									onChange={(e) =>
										setFormData({ ...formData, engineNumber: e.target.value.toUpperCase() })
									}
									required
									className="font-mono focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="owner">Propietario *</Label>
								<Select
									value={formData.owner}
									onValueChange={(value: "EMPRESA" | "MOTORISTA") =>
										setFormData({ ...formData, owner: value })
									}
								>
									<SelectTrigger className="w-full focus:border-green-500 focus:ring-green-500">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="EMPRESA">Empresa</SelectItem>
										<SelectItem value="MOTORISTA">Motorista</SelectItem>
									</SelectContent>
								</Select>
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
											{driver.firstName} {driver.paternalLastName}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				{motorbikeData &&
					motorbikeData.annualDocumentations &&
					motorbikeData.annualDocumentations.length > 0 && (
						<Card className="">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-green-800">
									<FileText className="h-5 w-5" />
									Documentación Anual
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{motorbikeData.annualDocumentations.map((doc) => (
										<div key={doc.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
											<div className="mb-3 flex items-center justify-between">
												<h4 className="font-semibold text-gray-900">Año {doc.year}</h4>
											</div>
											<div className="grid gap-3 md:grid-cols-3">
												<div>
													<p className="text-xs font-medium text-gray-500">
														Permiso de Circulación
													</p>
													<p className="mt-1 text-sm text-gray-900">
														{doc.circulationPermitFileUrl ? (
															<a
																href={doc.circulationPermitFileUrl}
																target="_blank"
																rel="noopener noreferrer"
																className="text-green-600 hover:underline"
															>
																Ver archivo
															</a>
														) : (
															<span className="text-gray-400">No disponible</span>
														)}
													</p>
												</div>
												<div>
													<p className="text-xs font-medium text-gray-500">Seguro Obligatorio</p>
													<p className="mt-1 text-sm text-gray-900">
														{doc.mandatoryInsuranceFileUrl ? (
															<a
																href={doc.mandatoryInsuranceFileUrl}
																target="_blank"
																rel="noopener noreferrer"
																className="text-green-600 hover:underline"
															>
																Ver archivo
															</a>
														) : (
															<span className="text-gray-400">No disponible</span>
														)}
													</p>
													{doc.mandatoryInsuranceExpiryDate && (
														<p className="mt-1 text-xs text-gray-500">
															Vence:{" "}
															{new Date(doc.mandatoryInsuranceExpiryDate).toLocaleDateString()}
														</p>
													)}
												</div>
												<div>
													<p className="text-xs font-medium text-gray-500">Revisión Técnica</p>
													<p className="mt-1 text-sm text-gray-900">
														{doc.technicalInspectionFileUrl ? (
															<a
																href={doc.technicalInspectionFileUrl}
																target="_blank"
																rel="noopener noreferrer"
																className="text-green-600 hover:underline"
															>
																Ver archivo
															</a>
														) : (
															<span className="text-gray-400">No disponible</span>
														)}
													</p>
													{doc.technicalInspectionExpiryDate && (
														<p className="mt-1 text-xs text-gray-500">
															Vence:{" "}
															{new Date(doc.technicalInspectionExpiryDate).toLocaleDateString()}
														</p>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}

				{motorbikeData && motorbikeData.driver && (
					<Card className="">
						<CardHeader>
							<CardTitle className="text-green-800">Motorista Asignado Actualmente</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="rounded-lg border border-green-100 bg-green-50/30 p-4">
								<div className="grid gap-3 md:grid-cols-2">
									<div>
										<p className="text-xs font-medium text-gray-500">Nombre Completo</p>
										<p className="mt-1 text-sm font-medium text-gray-900">
											{motorbikeData.driver.firstName} {motorbikeData.driver.paternalLastName}{" "}
											{motorbikeData.driver.maternalLastName}
										</p>
									</div>
									<div>
										<p className="text-xs font-medium text-gray-500">RUT</p>
										<p className="mt-1 font-mono text-sm text-gray-900">
											{motorbikeData.driver.rut}
										</p>
									</div>
									<div>
										<p className="text-xs font-medium text-gray-500">Email</p>
										<p className="mt-1 text-sm text-gray-900">{motorbikeData.driver.email}</p>
									</div>
									<div>
										<p className="text-xs font-medium text-gray-500">Estado</p>
										<Badge
											className="mt-1"
											variant={motorbikeData.driver.active ? "default" : "secondary"}
										>
											{motorbikeData.driver.active ? "Activo" : "Inactivo"}
										</Badge>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

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
