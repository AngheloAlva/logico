"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createAuditLog } from "@/lib/audit"

export async function deleteIncident(id: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized" }
	}

	try {
		// Obtener datos antes de eliminar
		const incident = await prisma.incident.findUnique({
			where: { id },
		})

		if (!incident) {
			return { success: false, error: "Incidencia no encontrada" }
		}

		await prisma.incident.delete({
			where: { id },
		})

		// Registrar auditoría
		await createAuditLog({
			entity: "INCIDENT",
			entityId: id,
			action: "DELETE",
			userId: session.user.id,
			previousData: incident,
			incidentId: id,
			movementId: incident.movementId,
		})

		revalidatePath("/movimientos")
		return { success: true }
	} catch (error) {
		console.error("Error deleting incident:", error)
		return { success: false, error: "Error al eliminar incidencia" }
	}
}
