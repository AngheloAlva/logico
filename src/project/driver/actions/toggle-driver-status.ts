"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function toggleDriverStatus(id: string) {
	try {
		const driver = await prisma.driver.findUnique({
			where: { id },
		})

		if (!driver) {
			return { success: false, error: "Motorista no encontrado" }
		}

		const updated = await prisma.driver.update({
			where: { id },
			data: {
				active: !driver.active,
			},
		})

		revalidatePath("/motoristas")
		return { success: true, data: updated }
	} catch (error) {
		console.error("Error toggling driver status:", error)
		return { success: false, error: "Error al cambiar estado del motorista" }
	}
}
