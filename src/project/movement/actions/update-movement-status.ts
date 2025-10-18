"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function updateMovementStatus(
	id: string,
	status: "PENDING" | "IN_TRANSIT" | "DELIVERED" | "INCIDENT"
) {
	try {
		const movement = await prisma.movement.update({
			where: { id },
			data: { status },
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
