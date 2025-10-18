"use server"

import { revalidatePath } from "next/cache"

import { citySchema, type CityInput } from "@/shared/schemas/region.schema"
import { prisma } from "@/lib/prisma"

export async function createCity(data: CityInput) {
	try {
		const validated = citySchema.parse(data)

		const city = await prisma.city.create({
			data: validated,
		})

		revalidatePath("/regiones")
		return { success: true, data: city }
	} catch (error) {
		console.error("Error creating city:", error)
		return { success: false, error: "Error al crear ciudad" }
	}
}
