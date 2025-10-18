"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

import { type MovementInput } from "@/shared/schemas/movement.schema"

export async function updateMovement(id: string, data: Partial<MovementInput>) {
	try {
		const movement = await prisma.movement.update({
			where: { id },
			data,
		})

		revalidatePath("/movimientos")
		revalidatePath(`/movimientos/${id}`)
		return { success: true, data: movement }
	} catch (error) {
		console.error("Error updating movement:", error)
		return { success: false, error: "Error al actualizar movimiento" }
	}
}
