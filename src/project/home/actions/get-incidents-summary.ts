"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getIncidentsSummary() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user) {
		return { success: false, error: "Unauthorized" }
	}

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
