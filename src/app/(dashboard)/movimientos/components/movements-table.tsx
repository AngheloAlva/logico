"use client"

import { useState, useEffect } from "react"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components/ui/table"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select"
import {
	Eye,
	Trash2,
	Search,
	Package,
	Clock,
	CheckCircle,
	TrendingUp,
	AlertCircle,
} from "lucide-react"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import Link from "next/link"
import { getMovements, deleteMovement } from "../actions/movements-actions"
import { toast } from "sonner"

const statusConfig = {
	PENDING: {
		label: "Pendiente",
		color: "bg-gray-100 text-gray-800",
		icon: Clock,
	},
	IN_TRANSIT: {
		label: "En Tránsito",
		color: "bg-blue-100 text-blue-800",
		icon: TrendingUp,
	},
	DELIVERED: {
		label: "Entregado",
		color: "bg-green-100 text-green-800",
		icon: CheckCircle,
	},
	INCIDENT: {
		label: "Incidencia",
		color: "bg-orange-100 text-orange-800",
		icon: AlertCircle,
	},
}

export function MovementsTable() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [movements, setMovements] = useState<any[]>([])
	const [searchTerm, setSearchTerm] = useState("")
	const [statusFilter, setStatusFilter] = useState<string>("all")
	const [loading, setLoading] = useState(true)

	async function loadMovements() {
		setLoading(true)
		const result = await getMovements({})
		if (result.success && result.data) {
			setMovements(result.data)
		} else {
			toast.error(result.error || "Error al cargar movimientos")
		}
		setLoading(false)
	}

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		loadMovements()
	}, [])

	async function handleDelete(id: string, number: string) {
		if (!confirm(`¿Eliminar movimiento #${number}?`)) return

		const result = await deleteMovement(id)
		if (result.success) {
			toast.success("Movimiento eliminado")
			loadMovements()
		} else {
			toast.error(result.error)
		}
	}

	const filteredMovements = movements.filter((movement) => {
		const matchesSearch =
			movement.number.includes(searchTerm) ||
			movement.pharmacy?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			movement.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			movement.address?.toLowerCase().includes(searchTerm.toLowerCase())

		const matchesStatus = statusFilter === "all" || movement.status === statusFilter

		return matchesSearch && matchesStatus
	})

	if (loading) {
		return <div className="py-10 text-center">Cargando movimientos...</div>
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-4 sm:flex-row">
				<div className="relative flex-1">
					<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
					<Input
						placeholder="Buscar por número, farmacia, motorista o dirección..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-9 focus:border-green-500 focus:ring-green-500"
					/>
				</div>
				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-full sm:w-[200px]">
						<SelectValue placeholder="Filtrar por estado" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Todos los estados</SelectItem>
						<SelectItem value="PENDING">Pendiente</SelectItem>
						<SelectItem value="IN_TRANSIT">En Tránsito</SelectItem>
						<SelectItem value="DELIVERED">Entregado</SelectItem>
						<SelectItem value="INCIDENT">Incidencia</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<Card className="">
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-green-50/50">
								<TableHead className="font-semibold text-green-800">Número</TableHead>
								<TableHead className="font-semibold text-green-800">Farmacia</TableHead>
								<TableHead className="font-semibold text-green-800">Motorista</TableHead>
								<TableHead className="font-semibold text-green-800">Dirección</TableHead>
								<TableHead className="font-semibold text-green-800">Estado</TableHead>
								<TableHead className="text-right font-semibold text-green-800">Acciones</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredMovements.map((movement) => {
								const status = statusConfig[movement.status as keyof typeof statusConfig]
								const StatusIcon = status.icon

								return (
									<TableRow key={movement.id} className="border-green-100">
										<TableCell>
											<div className="flex items-center gap-2">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
													<Package className="h-4 w-4 text-green-600" />
												</div>
												<div>
													<p className="font-mono text-sm font-medium">{movement.number}</p>
													{movement.hasRecipe && (
														<Badge
															variant="secondary"
															className="mt-1 bg-purple-100 text-xs text-purple-800"
														>
															Con Receta
														</Badge>
													)}
												</div>
											</div>
										</TableCell>
										<TableCell>
											<p className="text-sm">{movement.pharmacy?.name || "Sin asignar"}</p>
										</TableCell>
										<TableCell>
											<p className="text-sm">{movement.driver?.name || "Sin asignar"}</p>
										</TableCell>
										<TableCell>
											<p className="text-sm">{movement.address}</p>
										</TableCell>
										<TableCell>
											<Badge variant="secondary" className={status.color}>
												<StatusIcon className="mr-1 h-3 w-3" />
												{status.label}
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Link href={`/movimientos/${movement.id}`}>
													<Button
														variant="ghost"
														size="sm"
														className="text-green-600 hover:bg-green-50 hover:text-green-700"
													>
														<Eye className="h-4 w-4" />
													</Button>
												</Link>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleDelete(movement.id, movement.number)}
													className="text-red-600 hover:bg-red-50 hover:text-red-700"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	)
}
