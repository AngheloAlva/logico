"use server"

import { prisma } from "@/lib/prisma"

export async function getIncidentsByMovement(movementId: string) {
	try {
		const incidents = await prisma.incident.findMany({
			where: { movementId },
			orderBy: {
				date: "desc",
			},
			include: {
				createdBy: true,
			},
		})

		return { success: true, data: incidents }
	} catch (error) {
		console.error("Error fetching incidents:", error)
		return { success: false, error: "Error al obtener incidencias" }
	}
}
