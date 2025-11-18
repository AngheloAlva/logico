"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createAuditLog } from "@/lib/audit"

import { type MovementInput } from "@/shared/schemas/movement.schema"

export async function updateMovement(id: string, data: Partial<MovementInput>) {
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

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { pharmacyId, driverId, retryHistory, ...rest } = data

		const movement = await prisma.movement.update({
			where: { id },
			data: {
				...rest,
			},
		})

		// Registrar auditoría
		await createAuditLog({
			entity: "MOVEMENT",
			entityId: movement.id,
			action: "UPDATE",
			userId: session.user.id,
			previousData: previousMovement,
			newData: movement,
			movementId: movement.id,
			pharmacyId: movement.pharmacyId,
			driverId: movement.driverId,
		})

		revalidatePath("/movimientos")
		revalidatePath(`/movimientos/${id}`)
		return { success: true, data: movement }
	} catch (error) {
		console.error("Error updating movement:", error)
		return { success: false, error: "Error al actualizar movimiento" }
	}
}
