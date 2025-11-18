import { getDashboardCharts } from "../actions/get-dashboard-charts"
import DashboardCharts from "./dashboard-charts"

export default async function DashboardChartsWrapper() {
	const result = await getDashboardCharts()

	if (!result.success || !result.data) {
		return (
			<div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
				<p className="text-sm text-red-600">Error al cargar las gráficas del dashboard</p>
			</div>
		)
	}

	const { movementsByType, deliveriesPerDay, topDrivers } = result.data

	if (
		movementsByType.length === 0 &&
		deliveriesPerDay.every((d) => d.count === 0) &&
		topDrivers.length === 0
	) {
		return (
			<div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
				<p className="text-sm text-gray-500">
					No hay suficientes datos para mostrar las gráficas. Crea algunos movimientos primero.
				</p>
			</div>
		)
	}

	return (
		<DashboardCharts
			topDrivers={topDrivers}
			movementsByType={movementsByType}
			deliveriesPerDay={deliveriesPerDay}
		/>
	)
}
