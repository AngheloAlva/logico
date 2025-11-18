"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getDashboardCharts() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user) {
		return { success: false, error: "Unauthorized" }
	}

	try {
		const today = new Date()
		today.setHours(0, 0, 0, 0)

		const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

		const sevenDaysAgo = new Date(today)
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

		const movementsByType = await prisma.movement.groupBy({
			by: ["type"],
			where: {
				createdAt: {
					gte: firstDayOfMonth,
				},
			},
			_count: {
				id: true,
			},
		})

		const typeData = movementsByType.map((item) => ({
			type: item.type,
			count: item._count.id,
			label: getTypeLabel(item.type),
		}))

		const deliveriesPerDay = await prisma.movement.findMany({
			where: {
				status: "DELIVERED",
				deliveryDate: {
					gte: sevenDaysAgo,
				},
			},
			select: {
				deliveryDate: true,
			},
		})

		const dayMap = new Map<string, number>()
		deliveriesPerDay.forEach((movement) => {
			if (movement.deliveryDate) {
				const day = movement.deliveryDate.toISOString().split("T")[0]
				dayMap.set(day, (dayMap.get(day) || 0) + 1)
			}
		})

		const dailyData = []
		for (let i = 6; i >= 0; i--) {
			const date = new Date(today)
			date.setDate(date.getDate() - i)
			const dateString = date.toISOString().split("T")[0]
			dailyData.push({
				date: dateString,
				day: getDayName(date),
				count: dayMap.get(dateString) || 0,
			})
		}

		const topDrivers = await prisma.movement.groupBy({
			by: ["driverId"],
			where: {
				status: "DELIVERED",
				deliveryDate: {
					gte: firstDayOfMonth,
				},
			},
			_count: {
				id: true,
			},
			orderBy: {
				_count: {
					id: "desc",
				},
			},
			take: 5,
		})

		const driverIds = topDrivers.map((item) => item.driverId)
		const drivers = await prisma.driver.findMany({
			where: {
				id: {
					in: driverIds,
				},
			},
			select: {
				id: true,
				firstName: true,
				paternalLastName: true,
				maternalLastName: true,
			},
		})

		const driverMap = new Map(drivers.map((d) => [d.id, d]))

		const topDriversData = topDrivers
			.map((item) => {
				const driver = driverMap.get(item.driverId)
				if (!driver) return null
				return {
					driverId: item.driverId,
					name: `${driver.firstName} ${driver.paternalLastName}`,
					count: item._count.id,
				}
			})
			.filter((item) => item !== null)

		return {
			success: true,
			data: {
				movementsByType: typeData,
				deliveriesPerDay: dailyData,
				topDrivers: topDriversData,
			},
		}
	} catch (error) {
		console.error("Error fetching dashboard charts:", error)
		return { success: false, error: "Error al obtener datos de gráficas" }
	}
}

/**
 * Obtiene la etiqueta en español del tipo de movimiento
 */
function getTypeLabel(type: string): string {
	const labels: Record<string, string> = {
		ENTREGA: "Entrega Simple",
		ENTREGA_CON_RECETA: "Entrega con Receta",
		REINTENTO: "Reintento",
		ENTREGA_VARIAS_DIRECCIONES: "Múltiples Direcciones",
	}
	return labels[type] || type
}

/**
 * Obtiene el nombre corto del día de la semana
 */
function getDayName(date: Date): string {
	const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
	return days[date.getDay()]
}
