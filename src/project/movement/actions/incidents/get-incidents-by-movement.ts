"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getIncidentsByMovement(movementId: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user) {
		return { success: false, error: "Unauthorized" }
	}

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
