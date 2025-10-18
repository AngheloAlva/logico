"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

export async function deleteMovement(id: string) {
	try {
		await prisma.movement.delete({
			where: { id },
		})

		revalidatePath("/movimientos")
		revalidatePath("/dashboard")
		return { success: true }
	} catch (error) {
		console.error("Error deleting movement:", error)
		return { success: false, error: "Error al eliminar movimiento" }
	}
}
