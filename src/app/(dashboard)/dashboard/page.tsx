import { Suspense } from "react"

import MovementsCardsSkeleton from "@/project/home/components/movements-card-skeleton"
import StatsCardsSkeleton from "@/project/home/components/stats-card-skeleton"
import MovementsCards from "@/project/home/components/movements-cards"
import StatsCards from "@/project/home/components/stats-cards"

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
		</div>
	)
}
