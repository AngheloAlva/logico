"use server"

import { revalidatePath } from "next/cache"

import { incidentSchema, type IncidentInput } from "@/shared/schemas/movement.schema"
import { prisma } from "@/lib/prisma"

// Incidents
export async function createIncident(data: IncidentInput, userId: string) {
	try {
		const validated = incidentSchema.parse(data)

		const incident = await prisma.incident.create({
			data: {
				...validated,
				date: new Date(),
				createdByUserId: userId,
			},
		})

		// Actualizar el estado del movimiento a INCIDENT
		await prisma.movement.update({
			where: { id: data.movementId },
			data: {
				status: "INCIDENT",
			},
		})

		revalidatePath(`/movimientos/${data.movementId}`)
		revalidatePath("/movimientos")
		revalidatePath("/dashboard")
		return { success: true, data: incident }
	} catch (error) {
		console.error("Error creating incident:", error)
		return { success: false, error: "Error al crear incidencia" }
	}
}
