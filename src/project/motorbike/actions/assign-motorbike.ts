"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

export async function assignMotorbike(motorbikeId: string, driverId: string | null) {
	try {
		const motorbike = await prisma.motorbike.update({
			where: { id: motorbikeId },
			data: {
				driverId: driverId,
			},
		})

		revalidatePath("/motos")
		revalidatePath("/motoristas")
		return { success: true, data: motorbike }
	} catch (error) {
		console.error("Error assigning motorbike:", error)
		return { success: false, error: "Error al asignar moto" }
	}
}
