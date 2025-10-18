"use server"

import { prisma } from "@/lib/prisma"

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
