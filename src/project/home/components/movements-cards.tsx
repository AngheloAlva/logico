import { ArrowRight, Clock, Package, Truck } from "lucide-react"
import Link from "next/link"

import { getRecentActivity } from "../actions/get-recent-activity"
import { getActiveDrivers } from "../actions/get-active-drivers"
import { getStatusLabel } from "../utils/get-status-label"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"

export default async function MovementsCards(): Promise<React.ReactElement> {
	const { data: recentMovements } = await getRecentActivity()
	const { data: activeDrivers } = await getActiveDrivers()

	if (!recentMovements || !activeDrivers) {
		return <div>No hay movimientos recientes</div>
	}

	return (
		<div className="grid gap-6 lg:grid-cols-3">
			<Card className="border-gray-200 lg:col-span-2">
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle className="text-lg font-semibold text-gray-900">
							Actividad Reciente
						</CardTitle>
						<p className="mt-1 text-sm text-gray-500">Últimos movimientos registrados</p>
					</div>
					<Link href="/movimientos">
						<Button
							size="sm"
							variant="outline"
							className="text-green-600 hover:bg-green-50 hover:text-green-700"
						>
							Ver todos
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</Link>
				</CardHeader>

				<CardContent>
					<div className="flex flex-col gap-2">
						{recentMovements?.slice(0, 5).map((movement) => (
							<Link key={movement.id} href={`/movimientos/${movement.id}`}>
								<div className="group flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-4 transition-all hover:border-green-200 hover:bg-green-50/50 hover:shadow-sm">
									<div className="flex items-center gap-4">
										<div className="rounded-lg bg-white p-2 shadow-sm">
											<Package className="h-5 w-5 text-gray-600" />
										</div>
										<div>
											<p className="font-mono text-sm font-semibold text-gray-900">
												{movement.number}
											</p>
											<p className="text-xs text-gray-500">{movement.pharmacy.name}</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<Badge
											variant="secondary"
											className={
												movement.status === "DELIVERED"
													? "border-green-200 bg-green-50 text-green-700"
													: movement.status === "IN_TRANSIT"
														? "border-blue-200 bg-blue-50 text-blue-700"
														: movement.status === "INCIDENT"
															? "border-orange-200 bg-orange-50 text-orange-700"
															: "border-gray-200 bg-gray-50 text-gray-700"
											}
										>
											{getStatusLabel(movement.status)}
										</Badge>
										<ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-green-600" />
									</div>
								</div>
							</Link>
						))}
						{recentMovements?.length === 0 && (
							<div className="py-12 text-center">
								<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
									<Package className="h-6 w-6 text-gray-400" />
								</div>
								<p className="text-sm text-gray-500">No hay movimientos recientes</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			<Card className="border-gray-200">
				<CardHeader>
					<CardTitle className="text-lg font-semibold text-gray-900">Motoristas Activos</CardTitle>
					<p className="text-sm text-gray-500">Personal en operación</p>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-2">
						{activeDrivers?.slice(0, 6).map((driver) => (
							<div
								key={driver.id}
								className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3 transition-colors hover:bg-gray-100/50"
							>
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
									<Truck className="h-5 w-5 text-gray-600" />
								</div>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-gray-900">
										{driver.firstName} {driver.paternalLastName}
									</p>
									<div className="flex items-center gap-1 text-xs text-gray-500">
										<Clock className="h-3 w-3" />
										{driver.motorbikes && driver.motorbikes.length > 0
											? driver.motorbikes[0].plate
											: "Sin asignar"}
									</div>
								</div>
								<Badge variant="secondary" className="border-green-200 bg-green-50 text-green-700">
									Activo
								</Badge>
							</div>
						))}
						{activeDrivers?.length === 0 && (
							<div className="py-8 text-center">
								<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
									<Truck className="h-6 w-6 text-gray-400" />
								</div>
								<p className="text-sm text-gray-500">No hay motoristas activos</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
