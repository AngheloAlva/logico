"use server"

import { revalidatePath } from "next/cache"

import { citySchema, type CityInput } from "@/shared/schemas/region.schema"
import { prisma } from "@/lib/prisma"

export async function updateCity(id: string, data: CityInput) {
	try {
		const validated = citySchema.parse(data)

		const city = await prisma.city.update({
			where: { id },
			data: validated,
		})

		revalidatePath("/regiones")
		return { success: true, data: city }
	} catch (error) {
		console.error("Error updating city:", error)
		return { success: false, error: "Error al actualizar ciudad" }
	}
}
