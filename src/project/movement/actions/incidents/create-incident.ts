"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

import { incidentSchema, type IncidentInput } from "@/shared/schemas/movement.schema"
import { createAuditLog } from "@/lib/audit"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// Incidents
export async function createIncident(data: IncidentInput, userId: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || (session.user.role !== "admin" && session.user.role !== "operadora")) {
		return { success: false, error: "Unauthorized" }
	}

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

		// Registrar auditoría
		await createAuditLog({
			entity: "INCIDENT",
			entityId: incident.id,
			action: "CREATE",
			userId: session.user.id,
			newData: incident,
			incidentId: incident.id,
			movementId: data.movementId,
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
