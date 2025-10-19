"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { movementSchema, type MovementInput } from "@/shared/schemas/movement.schema"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createAuditLog } from "@/lib/audit"

export async function createMovement(data: MovementInput) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || (session.user.role !== "admin" && session.user.role !== "operadora")) {
		return { success: false, error: "Unauthorized" }
	}

	try {
		const validated = movementSchema.parse(data)

		const movement = await prisma.movement.create({
			data: {
				...validated,
				status: "PENDING",
			},
		})

		// Registrar auditoría
		await createAuditLog({
			entity: "MOVEMENT",
			entityId: movement.id,
			action: "CREATE",
			userId: session.user.id,
			newData: movement,
			movementId: movement.id,
			pharmacyId: movement.pharmacyId,
			driverId: movement.driverId,
		})

		revalidatePath("/movimientos")
		return { success: true, data: movement }
	} catch (error) {
		console.error("Error creating movement:", error)
		return { success: false, error: "Error al crear movimiento" }
	}
}
