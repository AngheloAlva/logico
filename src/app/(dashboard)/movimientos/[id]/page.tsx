"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import Link from "next/link"
import {
	Plus,
	Clock,
	Truck,
	MapPin,
	Package,
	ArrowLeft,
	Building2,
	AlertCircle,
	CheckCircle,
} from "lucide-react"

import { getIncidentsByMovement } from "@/project/movement/actions/incidents/get-incidents-by-movement"
import { setDepartureDate } from "@/project/movement/actions/set-departure-date"
import { getMovementById } from "@/project/movement/actions/get-movement-by-id"
import { setDeliveryDate } from "@/project/movement/actions/set-delivery-date"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { IncidentForm } from "@/project/movement/components/incident-form"
import { Separator } from "@/shared/components/ui/separator"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"

const statusConfig = {
	PENDING: { label: "Pendiente", color: "bg-gray-100 text-gray-800" },
	IN_TRANSIT: { label: "En Tránsito", color: "bg-blue-100 text-blue-800" },
	DELIVERED: { label: "Entregado", color: "bg-green-100 text-green-800" },
	INCIDENT: { label: "Incidencia", color: "bg-orange-100 text-orange-800" },
}

export default function MovimientoDetallePage() {
	const [incidents, setIncidents] = useState<
		Awaited<ReturnType<typeof getIncidentsByMovement>>["data"]
	>([])
	const [movement, setMovement] = useState<Awaited<ReturnType<typeof getMovementById>>["data"]>()
	const [showIncidentForm, setShowIncidentForm] = useState(false)
	const [updating, setUpdating] = useState(false)
	const [loading, setLoading] = useState(true)

	const params = useParams()
	const router = useRouter()

	useEffect(() => {
		loadMovement()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.id])

	async function loadMovement() {
		setLoading(true)
		const result = await getMovementById(params.id as string)
		if (result.success && result.data) {
			setMovement(result.data)
			loadIncidents()
		} else {
			toast.error(result.error || "Error al cargar movimiento")
			router.push("/movimientos")
		}
		setLoading(false)
	}

	async function loadIncidents() {
		const result = await getIncidentsByMovement(params.id as string)
		if (result.success && result.data) {
			setIncidents(result.data)
		}
	}

	async function handleSetDeparture() {
		setUpdating(true)
		const result = await setDepartureDate(params.id as string)
		if (result.success) {
			toast.success("Salida registrada")
			loadMovement()
		} else {
			toast.error(result.error)
		}
		setUpdating(false)
	}

	async function handleSetDelivery() {
		setUpdating(true)
		const result = await setDeliveryDate(params.id as string)
		if (result.success) {
			toast.success("Entrega registrada")
			loadMovement()
		} else {
			toast.error(result.error)
		}
		setUpdating(false)
	}

	if (loading || !movement) {
		return <div className="py-10 text-center">Cargando movimiento...</div>
	}

	const status = statusConfig[movement.status as keyof typeof statusConfig]

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Link href="/movimientos">
					<Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Volver
					</Button>
				</Link>
				<div className="flex-1">
					<div className="flex items-center gap-3">
						<h1 className="text-3xl font-bold tracking-tight text-green-800">
							Movimiento #{movement.number}
						</h1>
						<Badge variant="secondary" className={status.color}>
							{status.label}
						</Badge>
					</div>
					<p className="text-muted-foreground">Detalle del movimiento y gestión de incidencias</p>
				</div>
				<div className="flex gap-2">
					{movement.status === "PENDING" && (
						<Button
							onClick={handleSetDeparture}
							disabled={updating}
							className="bg-blue-600 hover:bg-blue-700"
						>
							<Clock className="mr-2 h-4 w-4" />
							Registrar Salida
						</Button>
					)}
					{movement.status === "IN_TRANSIT" && (
						<Button
							onClick={handleSetDelivery}
							disabled={updating}
							className="bg-green-600 hover:bg-green-700"
						>
							<CheckCircle className="mr-2 h-4 w-4" />
							Registrar Entrega
						</Button>
					)}
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card className="">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-green-800">
							<Package className="h-5 w-5" />
							Información del Despacho
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<p className="text-muted-foreground text-sm font-medium">Número de Despacho</p>
							<p className="font-mono text-lg">{movement.number}</p>
						</div>
						<Separator />
						<div>
							<p className="text-muted-foreground text-sm font-medium">Dirección de Entrega</p>
							<p className="text-base">{movement.address}</p>
						</div>
						{movement.hasRecipe && (
							<>
								<Separator />
								<Badge variant="secondary" className="bg-purple-100 text-purple-800">
									Con Receta Médica
								</Badge>
							</>
						)}
						<Separator />
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-muted-foreground text-sm font-medium">Segmentos</p>
								<p className="text-base">{movement.segments}</p>
							</div>
							<div>
								<p className="text-muted-foreground text-sm font-medium">Costo por Segmento</p>
								<p className="text-base">${movement?.segmentCost?.toLocaleString()}</p>
							</div>
						</div>
						{movement.segmentsAddress?.length > 0 && (
							<>
								<Separator />
								<div>
									<p className="text-muted-foreground mb-2 text-sm font-medium">
										Direcciones Adicionales
									</p>
									{movement.segmentsAddress.map((addr: string, index: number) => (
										<div key={index} className="mt-1 flex items-start gap-2">
											<MapPin className="mt-0.5 h-4 w-4 text-green-600" />
											<p className="text-sm">{addr}</p>
										</div>
									))}
								</div>
							</>
						)}
					</CardContent>
				</Card>

				<div className="space-y-6">
					<Card className="">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-green-800">
								<Building2 className="h-5 w-5" />
								Farmacia
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<p className="text-muted-foreground text-sm font-medium">Farmacia</p>
							<p className="text-base">{movement.pharmacy?.name}</p>
							<p className="text-muted-foreground text-sm">{movement.pharmacy?.address}</p>
						</CardContent>
					</Card>

					<Card className="">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-green-800">
								<Truck className="h-5 w-5" />
								Motorista
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<p className="font-medium">{movement.driver?.name || "Sin asignar"}</p>
							{movement.driver?.phone && (
								<p className="text-muted-foreground text-sm">{movement.driver.phone}</p>
							)}
						</CardContent>
					</Card>

					<Card className="">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-green-800">
								<Clock className="h-5 w-5" />
								Tiempos
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<p className="text-muted-foreground text-sm font-medium">Creado</p>
								<p className="text-base">{movement.createdAt.toLocaleString("es-CL")}</p>
							</div>
							{movement.departureDate && (
								<>
									<Separator />
									<div>
										<p className="text-muted-foreground text-sm font-medium">Salida</p>
										<p className="text-base">{movement.departureDate.toLocaleString("es-CL")}</p>
									</div>
								</>
							)}
							{movement.deliveryDate && (
								<>
									<Separator />
									<div>
										<p className="text-muted-foreground text-sm font-medium">Entrega</p>
										<p className="text-base">{movement.deliveryDate.toLocaleString("es-CL")}</p>
									</div>
								</>
							)}
						</CardContent>
					</Card>
				</div>
			</div>

			<Card className="border-orange-200">
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="flex items-center gap-2 text-orange-800">
						<AlertCircle className="h-5 w-5" />
						Incidencias
					</CardTitle>
					<Button
						onClick={() => setShowIncidentForm(!showIncidentForm)}
						variant="outline"
						size="sm"
						className="border-orange-300 text-orange-600 hover:bg-orange-50"
					>
						<Plus className="mr-2 h-4 w-4" />
						Reportar Incidencia
					</Button>
				</CardHeader>
				<CardContent className="space-y-4">
					{showIncidentForm && (
						<IncidentForm
							movementId={movement.id}
							onClose={() => setShowIncidentForm(false)}
							onSuccess={() => {
								setShowIncidentForm(false)
								loadIncidents()
							}}
						/>
					)}

					{incidents && incidents.length > 0 ? (
						<div className="space-y-4">
							{incidents.map((incident) => (
								<div
									key={incident.id}
									className="rounded-lg border border-orange-200 bg-orange-50/30 p-4"
								>
									<div className="flex items-start justify-between">
										<div className="space-y-1">
											<Badge variant="secondary" className="bg-orange-100 text-orange-800">
												{incident.type.replace(/_/g, " ")}
											</Badge>
											<p className="text-sm">{incident.description}</p>
											<p className="text-muted-foreground text-xs">
												Reportado por {incident.createdBy.name} el{" "}
												{incident.date.toLocaleString("es-CL")}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<p className="text-muted-foreground py-4 text-center text-sm">
							No hay incidencias reportadas para este movimiento
						</p>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
