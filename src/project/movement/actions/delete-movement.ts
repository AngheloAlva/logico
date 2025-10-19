"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createAuditLog } from "@/lib/audit"

export async function deleteMovement(id: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized" }
	}

	try {
		// Obtener datos antes de eliminar
		const movement = await prisma.movement.findUnique({
			where: { id },
		})

		if (!movement) {
			return { success: false, error: "Movimiento no encontrado" }
		}

		await prisma.movement.delete({
			where: { id },
		})

		// Registrar auditoría
		await createAuditLog({
			entity: "MOVEMENT",
			entityId: id,
			action: "DELETE",
			userId: session.user.id,
			previousData: movement,
			movementId: id,
			pharmacyId: movement.pharmacyId,
			driverId: movement.driverId,
		})

		revalidatePath("/movimientos")
		revalidatePath("/dashboard")
		return { success: true }
	} catch (error) {
		console.error("Error deleting movement:", error)
		return { success: false, error: "Error al eliminar movimiento" }
	}
}
