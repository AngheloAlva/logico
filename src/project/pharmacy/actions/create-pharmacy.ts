"use server"

import { revalidatePath } from "next/cache"
import { pharmacySchema, type PharmacyInput } from "@/shared/schemas/pharmacy.schema"
import { prisma } from "@/lib/prisma"

export async function createPharmacy(data: PharmacyInput) {
	try {
		const validated = pharmacySchema.parse(data)

		const pharmacy = await prisma.pharmacy.create({
			data: validated,
		})

		revalidatePath("/farmacias")
		return { success: true, data: pharmacy }
	} catch (error) {
		console.error("Error creating pharmacy:", error)
		return { success: false, error: "Error al crear farmacia" }
	}
}
