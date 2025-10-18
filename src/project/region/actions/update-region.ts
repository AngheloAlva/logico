"use server"

import { revalidatePath } from "next/cache"

import { regionSchema, type RegionInput } from "@/shared/schemas/region.schema"
import { prisma } from "@/lib/prisma"

export async function updateRegion(id: string, data: RegionInput) {
	try {
		const validated = regionSchema.parse(data)

		const region = await prisma.region.update({
			where: { id },
			data: validated,
		})

		revalidatePath("/regiones")
		return { success: true, data: region }
	} catch (error) {
		console.error("Error updating region:", error)
		return { success: false, error: "Error al actualizar región" }
	}
}
