import { Package, TrendingUp, CheckCircle, AlertCircle } from "lucide-react"
import { getTodayStats } from "../actions/get-today-stats"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"

export default async function StatsCards(): Promise<React.ReactElement> {
	const { data: stats } = await getTodayStats()

	if (!stats) {
		return <div>Error al cargar estadísticas</div>
	}

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
			<Card className="border-gray-200 transition-all hover:shadow-md">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-gray-600">Entregas Hoy</CardTitle>
					<div className="rounded-full bg-gray-100 p-2">
						<Package className="h-4 w-4 text-gray-600" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-3xl font-bold text-gray-900">{stats.deliveriesToday}</div>
					<p className="mt-1 text-xs text-gray-500">Pedidos programados</p>
				</CardContent>
			</Card>

			<Card className="border-gray-200 transition-all hover:shadow-md">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-gray-600">En Tránsito</CardTitle>
					<div className="rounded-full bg-blue-50 p-2">
						<TrendingUp className="h-4 w-4 text-blue-600" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-3xl font-bold text-gray-900">{stats.inTransit}</div>
					<p className="mt-1 text-xs text-gray-500">En proceso de entrega</p>
				</CardContent>
			</Card>

			<Card className="border-gray-200 transition-all hover:shadow-md">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-gray-600">Completados</CardTitle>
					<div className="rounded-full bg-green-50 p-2">
						<CheckCircle className="h-4 w-4 text-green-600" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-3xl font-bold text-gray-900">{stats.completedThisMonth}</div>
					<p className="mt-1 text-xs text-gray-500">Total este mes</p>
				</CardContent>
			</Card>

			<Card className="border-gray-200 transition-all hover:shadow-md">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-gray-600">Incidencias</CardTitle>
					<div className="rounded-full bg-orange-50 p-2">
						<AlertCircle className="h-4 w-4 text-orange-600" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-3xl font-bold text-gray-900">{stats.incidentsPending}</div>
					<p className="mt-1 text-xs text-gray-500">Pendientes de resolver</p>
				</CardContent>
			</Card>
		</div>
	)
}
