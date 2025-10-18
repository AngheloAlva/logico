import { Package, ArrowRight } from "lucide-react"
import { Suspense } from "react"
import Link from "next/link"

import MovementsCardsSkeleton from "@/project/home/components/movements-card-skeleton"
import StatsCardsSkeleton from "@/project/home/components/stats-card-skeleton"
import MovementsCards from "@/project/home/components/movements-cards"
import { Card, CardContent } from "@/shared/components/ui/card"
import StatsCards from "@/project/home/components/stats-cards"
import { Button } from "@/shared/components/ui/button"

export default async function DashboardPage() {
	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
				<p className="mt-1 text-sm text-gray-500">
					Monitorea en tiempo real el estado de tus operaciones
				</p>
			</div>

			<Suspense fallback={<StatsCardsSkeleton />}>
				<StatsCards />
			</Suspense>

			<Suspense fallback={<MovementsCardsSkeleton />}>
				<MovementsCards />
			</Suspense>

			<Card className="border-gray-200 bg-gradient-to-br from-green-50 to-white">
				<CardContent className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
							<p className="mt-1 text-sm text-gray-600">
								Accede rápidamente a las funciones más utilizadas
							</p>
						</div>
						<div className="flex gap-3">
							<Link href="/movimientos/nuevo">
								<Button className="bg-green-600 hover:bg-green-700">
									<Package className="mr-2 h-4 w-4" />
									Nuevo Movimiento
								</Button>
							</Link>
							<Link href="/reportes">
								<Button variant="outline" className="border-gray-300 hover:bg-gray-50">
									Ver Reportes
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</Link>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
