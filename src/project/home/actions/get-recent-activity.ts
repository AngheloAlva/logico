"use server"

import { prisma } from "@/lib/prisma"

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
