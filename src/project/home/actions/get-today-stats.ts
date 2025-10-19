"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getTodayStats() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user) {
		return { success: false, error: "Unauthorized" }
	}

	try {
		const today = new Date()
		today.setHours(0, 0, 0, 0)

		const tomorrow = new Date(today)
		tomorrow.setDate(tomorrow.getDate() + 1)

		// Entregas del día
		const deliveriesToday = await prisma.movement.count({
			where: {
				createdAt: {
					gte: today,
					lt: tomorrow,
				},
			},
		})

		// Movimientos en tránsito
		const inTransit = await prisma.movement.count({
			where: {
				status: "IN_TRANSIT",
			},
		})

		// Movimientos completados este mes
		const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
		const completedThisMonth = await prisma.movement.count({
			where: {
				status: "DELIVERED",
				deliveryDate: {
					gte: firstDayOfMonth,
				},
			},
		})

		// Incidencias pendientes
		const incidentsPending = await prisma.movement.count({
			where: {
				status: "INCIDENT",
			},
		})

		return {
			success: true,
			data: {
				deliveriesToday,
				inTransit,
				completedThisMonth,
				incidentsPending,
			},
		}
	} catch (error) {
		console.error("Error fetching today stats:", error)
		return { success: false, error: "Error al obtener estadísticas" }
	}
}
