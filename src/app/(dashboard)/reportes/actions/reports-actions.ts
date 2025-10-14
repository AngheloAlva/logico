"use server"

import { PrismaClient, Driver } from "@/generated/prisma"

const prisma = new PrismaClient()

export async function getDailyReport(date: Date, pharmacyId?: string) {
	try {
		const startOfDay = new Date(date)
		startOfDay.setHours(0, 0, 0, 0)

		const endOfDay = new Date(date)
		endOfDay.setHours(23, 59, 59, 999)

		const where: { createdAt: { gte: Date; lte: Date } } & { pharmacyId?: string } = {
			createdAt: {
				gte: startOfDay,
				lte: endOfDay,
			},
		}

		if (pharmacyId && pharmacyId !== "all") {
			where.pharmacyId = pharmacyId
		}

		const movements = await prisma.movement.findMany({
			where,
			include: {
				pharmacy: true,
				driver: true,
				incidents: true,
			},
			orderBy: {
				createdAt: "asc",
			},
		})

		// Estadísticas del día
		const stats = {
			total: movements.length,
			pending: movements.filter((m) => m.status === "PENDING").length,
			inTransit: movements.filter((m) => m.status === "IN_TRANSIT").length,
			delivered: movements.filter((m) => m.status === "DELIVERED").length,
			incidents: movements.filter((m) => m.status === "INCIDENT").length,
		}

		return {
			success: true,
			data: {
				movements,
				stats,
				date: date.toISOString(),
			},
		}
	} catch (error) {
		console.error("Error fetching daily report:", error)
		return { success: false, error: "Error al obtener reporte diario" }
	}
}

export async function getStatistics() {
	try {
		const totalMovements = await prisma.movement.count()
		const totalPharmacies = await prisma.pharmacy.count()
		const totalDrivers = await prisma.driver.count()
		const totalIncidents = await prisma.incident.count()

		// Entregas del mes actual
		const now = new Date()
		const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

		const deliveredThisMonth = await prisma.movement.count({
			where: {
				status: "DELIVERED",
				deliveryDate: {
					gte: firstDayOfMonth,
				},
			},
		})

		// Tiempo promedio de entrega (solo entregas completadas)
		const deliveredMovements = await prisma.movement.findMany({
			where: {
				status: "DELIVERED",
				departureDate: { not: null },
				deliveryDate: { not: null },
			},
			select: {
				departureDate: true,
				deliveryDate: true,
			},
		})

		let avgDeliveryTime = 0
		if (deliveredMovements.length > 0) {
			const totalTime = deliveredMovements.reduce((acc, mov) => {
				const departure = mov.departureDate!.getTime()
				const delivery = mov.deliveryDate!.getTime()
				return acc + (delivery - departure)
			}, 0)

			avgDeliveryTime = Math.round(totalTime / deliveredMovements.length / 60000) // en minutos
		}

		// Tasa de éxito
		const successRate =
			totalMovements > 0 ? ((deliveredThisMonth / totalMovements) * 100).toFixed(1) : "0.0"

		// Motoristas activos
		const activeDrivers = await prisma.driver.count({
			where: {
				active: true,
			},
		})

		return {
			success: true,
			data: {
				totalMovements,
				totalPharmacies,
				totalDrivers,
				totalIncidents,
				deliveredThisMonth,
				avgDeliveryTime,
				successRate: parseFloat(successRate),
				activeDrivers,
			},
		}
	} catch (error) {
		console.error("Error fetching statistics:", error)
		return { success: false, error: "Error al obtener estadísticas" }
	}
}

export async function getDriverPerformance(startDate: Date, endDate: Date) {
	try {
		const movements = await prisma.movement.findMany({
			where: {
				createdAt: {
					gte: startDate,
					lte: endDate,
				},
				status: "DELIVERED",
			},
			include: {
				driver: true,
			},
		})

		// Agrupar por motorista
		const performanceByDriver = movements.reduce((acc, mov) => {
			const driverId = mov.driver.id
			if (!acc[driverId]) {
				acc[driverId] = {
					driver: mov.driver,
					totalDeliveries: 0,
					avgTime: 0,
					times: [],
				}
			}

			acc[driverId].totalDeliveries++

			if (mov.departureDate && mov.deliveryDate) {
				const time = mov.deliveryDate.getTime() - mov.departureDate.getTime()
				acc[driverId].times.push(time)
			}

			return acc
		}, {} as Record<string, { driver: Driver; totalDeliveries: number; avgTime: number; times: number[] }>)

		// Calcular promedios y formatear resultado
		const result = Object.keys(performanceByDriver).map((driverId) => {
			const data = performanceByDriver[driverId]
			if (data.times.length > 0) {
				const avgTime = data.times.reduce((a: number, b: number) => a + b, 0) / data.times.length
				data.avgTime = Math.round(avgTime / 60000) // en minutos
			}
		
			return {
				driver: data.driver,
				totalDeliveries: data.totalDeliveries,
				avgTime: data.avgTime,
			}
		})

		return {
			success: true,
			data: result,
		}
	} catch (error) {
		console.error("Error fetching driver performance:", error)
		return { success: false, error: "Error al obtener desempeño de motoristas" }
	}
}
