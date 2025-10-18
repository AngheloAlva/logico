"use server"

import { prisma } from "@/lib/prisma"

export async function getMovementById(id: string) {
	try {
		const movement = await prisma.movement.findUnique({
			where: { id },
			include: {
				pharmacy: {
					include: {
						region: true,
						city: true,
					},
				},
				driver: true,
				incidents: {
					orderBy: {
						date: "desc",
					},
				},
			},
		})

		if (!movement) {
			return { success: false, error: "Movimiento no encontrado" }
		}

		return { success: true, data: movement }
	} catch (error) {
		console.error("Error fetching movement:", error)
		return { success: false, error: "Error al obtener movimiento" }
	}
}
