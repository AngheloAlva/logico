"use server"

import { revalidatePath } from "next/cache"

import { movementSchema, type MovementInput } from "@/shared/schemas/movement.schema"
import { prisma } from "@/lib/prisma"

export async function createMovement(data: MovementInput) {
	try {
		const validated = movementSchema.parse(data)

		const movement = await prisma.movement.create({
			data: {
				...validated,
				status: "PENDING",
			},
		})

		revalidatePath("/movimientos")
		return { success: true, data: movement }
	} catch (error) {
		console.error("Error creating movement:", error)
		return { success: false, error: "Error al crear movimiento" }
	}
}
