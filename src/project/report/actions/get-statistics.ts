"use server"

import { prisma } from "@/lib/prisma"

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
