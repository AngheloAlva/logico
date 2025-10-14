/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Package, TrendingUp, CheckCircle, AlertCircle, Truck } from "lucide-react"
import { Badge } from "@/shared/components/ui/badge"
import { getTodayStats, getRecentActivity, getActiveDrivers } from "./actions/dashboard-actions"

export default function DashboardPage() {
	const [stats, setStats] = useState({
		deliveriesToday: 0,
		inTransit: 0,
		completedThisMonth: 0,
		incidentsPending: 0,
	})
	const [recentMovements, setRecentMovements] = useState<any[]>([])
	const [activeDrivers, setActiveDrivers] = useState<any[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		// eslint-disable-next-line react-hooks/immutability
		loadDashboardData()
	}, [])

	async function loadDashboardData() {
		setLoading(true)

		const [statsResult, movementsResult, driversResult] = await Promise.all([
			getTodayStats(),
			getRecentActivity(),
			getActiveDrivers(),
		])

		if (statsResult.success && statsResult.data) {
			setStats(statsResult.data)
		}

		if (movementsResult.success && movementsResult.data) {
			setRecentMovements(movementsResult.data)
		}

		if (driversResult.success && driversResult.data) {
			setActiveDrivers(driversResult.data)
		}

		setLoading(false)
	}

	if (loading) {
		return <div className="py-10 text-center">Cargando dashboard...</div>
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight text-green-800">Dashboard</h1>
				<p className="text-muted-foreground">Resumen general del sistema de distribución</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card className="bg-gradient-to-br from-white to-green-50/30">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-green-700">Entregas Hoy</CardTitle>
						<Package className="h-5 w-5 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-green-800">{stats.deliveriesToday}</div>
						<p className="text-muted-foreground text-xs">Pedidos programados para hoy</p>
					</CardContent>
				</Card>

				<Card className="border-blue-200 bg-gradient-to-br from-white to-blue-50/30">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-blue-700">En Tránsito</CardTitle>
						<TrendingUp className="h-5 w-5 text-blue-600" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-blue-800">{stats.inTransit}</div>
						<p className="text-muted-foreground text-xs">Pedidos siendo entregados</p>
					</CardContent>
				</Card>

				<Card className="border-emerald-200 bg-gradient-to-br from-white to-emerald-50/30">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-emerald-700">Completados</CardTitle>
						<CheckCircle className="h-5 w-5 text-emerald-600" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-emerald-800">{stats.completedThisMonth}</div>
						<p className="text-muted-foreground text-xs">Total este mes</p>
					</CardContent>
				</Card>

				<Card className="border-orange-200 bg-gradient-to-br from-white to-orange-50/30">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-orange-700">Incidencias</CardTitle>
						<AlertCircle className="h-5 w-5 text-orange-600" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-orange-800">{stats.incidentsPending}</div>
						<p className="text-muted-foreground text-xs">Pendientes de resolver</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Card className="">
					<CardHeader>
						<CardTitle className="text-green-800">Actividad Reciente</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{recentMovements.slice(0, 5).map((movement) => (
								<div
									key={movement.id}
									className="flex items-center justify-between rounded-lg border border-green-100 p-3"
								>
									<div className="flex items-center gap-3">
										<Package className="h-5 w-5 text-green-600" />
										<div>
											<p className="font-mono text-sm font-medium">{movement.number}</p>
											<p className="text-muted-foreground text-xs">{movement.pharmacy.name}</p>
										</div>
									</div>
									<Badge
										variant="secondary"
										className={
											movement.status === "DELIVERED"
												? "bg-green-100 text-green-800"
												: movement.status === "IN_TRANSIT"
													? "bg-blue-100 text-blue-800"
													: "bg-orange-100 text-orange-800"
										}
									>
										{movement.status}
									</Badge>
								</div>
							))}
							{recentMovements.length === 0 && (
								<p className="text-muted-foreground py-8 text-center text-sm">
									No hay movimientos recientes
								</p>
							)}
						</div>
					</CardContent>
				</Card>

				<Card className="">
					<CardHeader>
						<CardTitle className="text-green-800">Motoristas Activos</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{activeDrivers.map((driver) => (
								<div
									key={driver.id}
									className="flex items-center gap-3 rounded-lg border border-green-100 p-3"
								>
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
										<Truck className="h-5 w-5 text-green-600" />
									</div>
									<div className="flex-1">
										<p className="font-medium">{driver.name}</p>
										<p className="text-muted-foreground text-xs">
											Moto: {driver.motorbike ? driver.motorbike.plate : "Sin asignar"}
										</p>
									</div>
									<Badge variant="secondary" className="bg-green-100 text-green-800">
										Activo
									</Badge>
								</div>
							))}
							{activeDrivers.length === 0 && (
								<p className="text-muted-foreground py-8 text-center text-sm">
									No hay motoristas activos
								</p>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
