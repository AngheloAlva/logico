"use server"

import { PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

export async function getTodayStats() {
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

export async function getRecentActivity() {
	try {
		const recentMovements = await prisma.movement.findMany({
			take: 10,
			orderBy: {
				createdAt: "desc",
			},
			include: {
				pharmacy: true,
				driver: true,
			},
		})
		
		return { success: true, data: recentMovements }
	} catch (error) {
		console.error("Error fetching recent activity:", error)
		return { success: false, error: "Error al obtener actividad reciente" }
	}
}

export async function getActiveDrivers() {
	try {
		const activeDrivers = await prisma.driver.findMany({
			where: {
				active: true,
			},
			include: {
				motorbike: true,
			},
			orderBy: {
				name: "asc",
			},
		})
		
		return { success: true, data: activeDrivers }
	} catch (error) {
		console.error("Error fetching active drivers:", error)
		return { success: false, error: "Error al obtener motoristas activos" }
	}
}

export async function getIncidentsSummary() {
	try {
		const incidents = await prisma.incident.findMany({
			include: {
				movement: {
					include: {
						pharmacy: true,
						driver: true,
					},
				},
			},
			orderBy: {
				date: "desc",
			},
			take: 10,
		})
		
		return { success: true, data: incidents }
	} catch (error) {
		console.error("Error fetching incidents summary:", error)
		return { success: false, error: "Error al obtener resumen de incidencias" }
	}
}

export async function getStatsByPharmacy() {
	try {
		const stats = await prisma.pharmacy.findMany({
			include: {
				_count: {
					select: {
						movements: true,
					},
				},
			},
			orderBy: {
				name: "asc",
			},
		})
		
		return { success: true, data: stats }
	} catch (error) {
		console.error("Error fetching stats by pharmacy:", error)
		return { success: false, error: "Error al obtener estadísticas por farmacia" }
	}
}
