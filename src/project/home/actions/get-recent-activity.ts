"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getRecentActivity() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user) {
		return { success: false, error: "Unauthorized" }
	}

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
