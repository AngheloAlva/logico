"use client"

import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { TrendingUp, Package, Award } from "lucide-react"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/components/ui/chart"
import {
	Card,
	CardTitle,
	CardHeader,
	CardContent,
	CardDescription,
} from "@/shared/components/ui/card"

interface DashboardChartsProps {
	movementsByType: Array<{
		type: string
		count: number
		label: string
	}>
	deliveriesPerDay: Array<{
		date: string
		day: string
		count: number
	}>
	topDrivers: Array<{
		driverId: string
		name: string
		count: number
	}>
}

export default function DashboardCharts({
	movementsByType,
	deliveriesPerDay,
	topDrivers,
}: DashboardChartsProps) {
	const typeChartConfig = {
		count: {
			label: "Movimientos",
			color: "var(--color-green-500)",
		},
	}

	const dailyChartConfig = {
		count: {
			label: "Entregas",
			color: "var(--color-emerald-500)",
		},
	}

	const driversChartConfig = {
		count: {
			label: "Entregas",
			color: "var(--color-teal-500)",
		},
	}

	return (
		<div className="grid gap-6 lg:grid-cols-2">
			<Card className="border-gray-200">
				<CardHeader>
					<div className="flex items-center gap-2">
						<div className="rounded-lg bg-blue-50 p-2">
							<Package className="h-5 w-5 text-blue-600" />
						</div>
						<div>
							<CardTitle className="text-lg font-semibold text-gray-900">
								Movimientos por Tipo
							</CardTitle>
							<CardDescription>Distribución de entregas este mes</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<ChartContainer config={typeChartConfig} className="h-[300px] w-full">
						<BarChart data={movementsByType}>
							<CartesianGrid strokeDasharray="3 3" vertical={false} />
							<XAxis
								dataKey="label"
								tickLine={false}
								tickMargin={10}
								axisLine={false}
								tickFormatter={(value) => {
									return value.length > 15 ? `${value.substring(0, 12)}...` : value
								}}
							/>
							<YAxis tickLine={false} axisLine={false} tickMargin={8} />
							<ChartTooltip content={<ChartTooltipContent />} />
							<Bar dataKey="count" fill="var(--color-green-500)" radius={[8, 8, 0, 0]} />
						</BarChart>
					</ChartContainer>
				</CardContent>
			</Card>

			<Card className="border-gray-200">
				<CardHeader>
					<div className="flex items-center gap-2">
						<div className="rounded-lg bg-green-50 p-2">
							<TrendingUp className="h-5 w-5 text-green-600" />
						</div>
						<div>
							<CardTitle className="text-lg font-semibold text-gray-900">
								Entregas Completadas
							</CardTitle>
							<CardDescription>Últimos 7 días</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<ChartContainer config={dailyChartConfig} className="h-[300px] w-full">
						<LineChart data={deliveriesPerDay}>
							<CartesianGrid strokeDasharray="3 3" vertical={false} />
							<XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
							<YAxis tickLine={false} axisLine={false} tickMargin={8} />
							<ChartTooltip content={<ChartTooltipContent />} />
							<Line
								type="monotone"
								dataKey="count"
								stroke="var(--color-emerald-500)"
								strokeWidth={2}
								dot={{
									fill: "var(--color-emerald-500)",
									r: 4,
								}}
								activeDot={{
									r: 6,
								}}
							/>
						</LineChart>
					</ChartContainer>
				</CardContent>
			</Card>

			<Card className="border-gray-200 lg:col-span-2">
				<CardHeader>
					<div className="flex items-center gap-2">
						<div className="rounded-lg bg-amber-50 p-2">
							<Award className="h-5 w-5 text-amber-600" />
						</div>
						<div>
							<CardTitle className="text-lg font-semibold text-gray-900">
								Top 5 Motoristas
							</CardTitle>
							<CardDescription>Entregas completadas este mes</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{topDrivers.length > 0 ? (
						<ChartContainer config={driversChartConfig} className="h-[300px] w-full">
							<BarChart data={topDrivers} layout="vertical">
								<CartesianGrid strokeDasharray="3 3" horizontal={false} />
								<XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} />
								<YAxis
									dataKey="name"
									type="category"
									tickLine={false}
									tickMargin={10}
									axisLine={false}
									width={150}
								/>
								<ChartTooltip content={<ChartTooltipContent />} />
								<Bar dataKey="count" fill="var(--color-teal-500)" radius={[0, 8, 8, 0]} />
							</BarChart>
						</ChartContainer>
					) : (
						<div className="flex h-[300px] items-center justify-center">
							<div className="text-center">
								<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
									<Award className="h-6 w-6 text-gray-400" />
								</div>
								<p className="text-sm text-gray-500">No hay datos de entregas este mes</p>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
