"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

export async function setDepartureDate(id: string) {
	try {
		const movement = await prisma.movement.update({
			where: { id },
			data: {
				departureDate: new Date(),
				status: "IN_TRANSIT",
			},
		})

		revalidatePath("/movimientos")
		revalidatePath(`/movimientos/${id}`)
		revalidatePath("/dashboard")
		return { success: true, data: movement }
	} catch (error) {
		console.error("Error setting departure date:", error)
		return { success: false, error: "Error al registrar salida" }
	}
}
