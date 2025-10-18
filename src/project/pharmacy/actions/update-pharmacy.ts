"use server"

import { revalidatePath } from "next/cache"

import { pharmacySchema, type PharmacyInput } from "@/shared/schemas/pharmacy.schema"
import { prisma } from "@/lib/prisma"

export async function updatePharmacy(id: string, data: PharmacyInput) {
	try {
		const validated = pharmacySchema.parse(data)

		const pharmacy = await prisma.pharmacy.update({
			where: { id },
			data: validated,
		})

		revalidatePath("/farmacias")
		return { success: true, data: pharmacy }
	} catch (error) {
		console.error("Error updating pharmacy:", error)
		return { success: false, error: "Error al actualizar farmacia" }
	}
}
