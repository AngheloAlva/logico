"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createAuditLog } from "@/lib/audit"

export async function updateMovementStatus(
	id: string,
	status: "PENDING" | "IN_TRANSIT" | "DELIVERED" | "INCIDENT"
) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || (session.user.role !== "admin" && session.user.role !== "operadora")) {
		return { success: false, error: "Unauthorized" }
	}

	try {
		// Obtener datos anteriores
		const previousMovement = await prisma.movement.findUnique({
			where: { id },
		})

		const movement = await prisma.movement.update({
			where: { id },
			data: { status },
		})

		// Registrar auditoría
		await createAuditLog({
			entity: "MOVEMENT",
			entityId: movement.id,
			action: "STATUS_CHANGE",
			userId: session.user.id,
			previousData: previousMovement,
			newData: movement,
			movementId: movement.id,
			pharmacyId: movement.pharmacyId,
			driverId: movement.driverId,
		})

		revalidatePath("/movimientos")
		revalidatePath(`/movimientos/${id}`)
		revalidatePath("/dashboard")
		return { success: true, data: movement }
	} catch (error) {
		console.error("Error updating movement status:", error)
		return { success: false, error: "Error al actualizar estado del movimiento" }
	}
}
