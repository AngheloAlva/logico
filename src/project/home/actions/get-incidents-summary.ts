"use server"

import { prisma } from "@/lib/prisma"

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
