"use client"

import { Download, FileText, Calendar, TrendingUp, Package, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

import { getDailyReport } from "@/project/report/actions/get-daily-report"
import { getPharmacies } from "@/project/pharmacy/actions/get-pharmacies"
import { getStatistics } from "@/project/report/actions/get-statistics"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
	Select,
	SelectItem,
	SelectValue,
	SelectTrigger,
	SelectContent,
} from "@/shared/components/ui/select"

import type { Pharmacy } from "@/generated/prisma"

export default function ReportesPage() {
	const [reportDate, setReportDate] = useState("")
	const [pharmacyId, setPharmacyId] = useState("all")
	const [isGenerating, setIsGenerating] = useState(false)
	const [loading, setLoading] = useState(true)
	const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
	const [stats, setStats] = useState({
		totalDeliveries: 0,
		avgDeliveryTime: 0,
		successRate: 0,
		activeDrivers: 0,
	})

	useEffect(() => {
		loadData()
	}, [])

	async function loadData() {
		setLoading(true)

		const [statsResult, pharmaciesResult] = await Promise.all([getStatistics(), getPharmacies()])

		if (statsResult.success && statsResult.data) {
			setStats({
				totalDeliveries: statsResult.data.deliveredThisMonth,
				avgDeliveryTime: statsResult.data.avgDeliveryTime,
				successRate: statsResult.data.successRate,
				activeDrivers: statsResult.data.activeDrivers,
			})
		}

		if (pharmaciesResult.success && pharmaciesResult.data) {
			setPharmacies(pharmaciesResult.data)
		}

		setLoading(false)
	}

	const handleGenerateReport = async (format: "csv" | "pdf") => {
		if (!reportDate) {
			toast.error("Por favor selecciona una fecha")
			return
		}

		setIsGenerating(true)
		try {
			const result = await getDailyReport(
				new Date(reportDate),
				pharmacyId !== "all" ? pharmacyId : undefined
			)

			if (result.success && result.data) {
				if (format === "csv") {
					exportToCSV(result.data)
				} else {
					exportToPDF(result.data)
				}
				toast.success(`Reporte ${format.toUpperCase()} generado exitosamente`)
			} else {
				toast.error(result.error || "Error al generar reporte")
			}
		} catch (error) {
			console.error(error)
			toast.error("Error al generar reporte")
		} finally {
			setIsGenerating(false)
		}
	}

	const exportToCSV = (data: Awaited<ReturnType<typeof getDailyReport>>["data"]) => {
		if (!data) {
			toast.error("Error al generar reporte")
			return
		}

		let csv =
			"Numero,Farmacia,Motorista,Estado,Fecha Creacion,Fecha Salida,Fecha Entrega,Incidencias\n"

		data.movements.forEach((mov) => {
			const row = [
				mov.number,
				mov.pharmacy?.name || "N/A",
				mov.driver?.name || "N/A",
				mov.status,
				new Date(mov.createdAt).toLocaleString("es-CL"),
				mov.departureDate ? new Date(mov.departureDate).toLocaleString("es-CL") : "N/A",
				mov.deliveryDate ? new Date(mov.deliveryDate).toLocaleString("es-CL") : "N/A",
				mov.incidents?.length || 0,
			].join(",")
			csv += row + "\n"
		})

		csv += "\n\nESTADISTICAS\n"
		csv += `Total Movimientos,${data.stats.total}\n`
		csv += `Pendientes,${data.stats.pending}\n`
		csv += `En Transito,${data.stats.inTransit}\n`
		csv += `Entregados,${data.stats.delivered}\n`
		csv += `Con Incidencias,${data.stats.incidents}\n`

		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
		const link = document.createElement("a")
		const url = URL.createObjectURL(blob)
		link.setAttribute("href", url)
		link.setAttribute("download", `reporte_${reportDate}.csv`)
		link.style.visibility = "hidden"
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	const exportToPDF = (data: Awaited<ReturnType<typeof getDailyReport>>["data"]) => {
		if (!data) {
			toast.error("Error al generar reporte")
			return
		}

		const { movements, stats } = data

		let content = `REPORTE DIARIO - ${reportDate}\n\n`
		content += `ESTADISTICAS\n`
		content += `Total Movimientos: ${stats.total}\n`
		content += `Pendientes: ${stats.pending}\n`
		content += `En Transito: ${stats.inTransit}\n`
		content += `Entregados: ${stats.delivered}\n`
		content += `Con Incidencias: ${stats.incidents}\n\n`
		content += `MOVIMIENTOS\n\n`

		movements.forEach((mov, index) => {
			content += `${index + 1}. #${mov.number}\n`
			content += `   Farmacia: ${mov.pharmacy?.name || "N/A"}\n`
			content += `   Motorista: ${mov.driver?.name || "N/A"}\n`
			content += `   Estado: ${mov.status}\n`
			content += `   Incidencias: ${mov.incidents?.length || 0}\n\n`
		})

		const blob = new Blob([content], { type: "text/plain;charset=utf-8;" })
		const link = document.createElement("a")
		const url = URL.createObjectURL(blob)
		link.setAttribute("href", url)
		link.setAttribute("download", `reporte_${reportDate}.txt`)
		link.style.visibility = "hidden"
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	if (loading) {
		return <div className="py-10 text-center">Cargando reportes...</div>
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight text-green-800">Reportes</h1>
				<p className="text-muted-foreground">Genera reportes y visualiza métricas del sistema</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card className="bg-gradient-to-br from-white to-green-50/30">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-green-700">Total Entregas</CardTitle>
						<Package className="h-5 w-5 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-green-800">{stats.totalDeliveries}</div>
						<p className="text-muted-foreground text-xs">Este mes</p>
					</CardContent>
				</Card>

				<Card className="border-blue-200 bg-gradient-to-br from-white to-blue-50/30">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-blue-700">Tiempo Promedio</CardTitle>
						<Calendar className="h-5 w-5 text-blue-600" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-blue-800">{stats.avgDeliveryTime} min</div>
						<p className="text-muted-foreground text-xs">Por entrega</p>
					</CardContent>
				</Card>

				<Card className="border-emerald-200 bg-gradient-to-br from-white to-emerald-50/30">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-emerald-700">Tasa de Éxito</CardTitle>
						<CheckCircle className="h-5 w-5 text-emerald-600" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-emerald-800">{stats.successRate}%</div>
						<p className="text-muted-foreground text-xs">Entregas exitosas</p>
					</CardContent>
				</Card>

				<Card className="border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-purple-700">
							Motoristas Activos
						</CardTitle>
						<TrendingUp className="h-5 w-5 text-purple-600" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-purple-800">{stats.activeDrivers}</div>
						<p className="text-muted-foreground text-xs">En operación</p>
					</CardContent>
				</Card>
			</div>

			<Card className="">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-green-800">
						<FileText className="h-5 w-5" />
						Generar Reporte Diario
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="date">Fecha *</Label>
							<Input
								id="date"
								type="date"
								value={reportDate}
								onChange={(e) => setReportDate(e.target.value)}
								required
								className="focus:border-green-500 focus:ring-green-500"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="pharmacy">Farmacia</Label>
							<Select value={pharmacyId} onValueChange={setPharmacyId}>
								<SelectTrigger className="focus:border-green-500 focus:ring-green-500">
									<SelectValue placeholder="Todas las farmacias" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Todas las farmacias</SelectItem>
									{pharmacies.map((pharmacy) => (
										<SelectItem key={pharmacy.id} value={pharmacy.id}>
											{pharmacy.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<Separator />

					<div>
						<p className="mb-3 text-sm font-medium">Formato de Exportación</p>
						<div className="flex gap-3">
							<Button
								onClick={() => handleGenerateReport("csv")}
								disabled={!reportDate || isGenerating}
								variant="outline"
								className="flex-1 border-green-300 hover:bg-green-50"
							>
								<Download className="mr-2 h-4 w-4" />
								Exportar CSV
							</Button>
							<Button
								onClick={() => handleGenerateReport("pdf")}
								disabled={!reportDate || isGenerating}
								variant="outline"
								className="flex-1 border-green-300 hover:bg-green-50"
							>
								<Download className="mr-2 h-4 w-4" />
								Exportar PDF
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="">
				<CardHeader>
					<CardTitle className="text-green-800">Resumen del Reporte</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3 text-sm">
						<p className="text-muted-foreground">El reporte incluirá la siguiente información:</p>
						<ul className="text-muted-foreground ml-2 list-inside list-disc space-y-1">
							<li>Número total de movimientos del día</li>
							<li>Desglose por estado (Pendiente, En Tránsito, Entregado, Incidencia)</li>
							<li>Lista detallada de cada movimiento con tiempos</li>
							<li>Resumen de incidencias reportadas</li>
							<li>Tiempo promedio de entrega</li>
							<li>Desempeño por motorista</li>
						</ul>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
