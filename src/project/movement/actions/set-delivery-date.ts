"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

export async function setDeliveryDate(id: string) {
	try {
		const movement = await prisma.movement.update({
			where: { id },
			data: {
				deliveryDate: new Date(),
				status: "DELIVERED",
			},
		})

		revalidatePath("/movimientos")
		revalidatePath(`/movimientos/${id}`)
		revalidatePath("/dashboard")
		return { success: true, data: movement }
	} catch (error) {
		console.error("Error setting delivery date:", error)
		return { success: false, error: "Error al registrar entrega" }
	}
}
