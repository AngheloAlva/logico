"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

import { pharmacySchema, type PharmacyInput } from "@/shared/schemas/pharmacy.schema"
import { createAuditLog } from "@/lib/audit"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function createPharmacy(data: PharmacyInput) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized" }
	}

	try {
		const validated = pharmacySchema.parse(data)

		const pharmacy = await prisma.pharmacy.create({
			data: validated,
		})

		await createAuditLog({
			entity: "PHARMACY",
			entityId: pharmacy.id,
			action: "CREATE",
			userId: session.user.id,
			newData: pharmacy,
			pharmacyId: pharmacy.id,
		})

		revalidatePath("/farmacias")
		return { success: true, data: pharmacy }
	} catch (error) {
		console.error("Error creating pharmacy:", error)
		return { success: false, error: "Error al crear farmacia" }
	}
}
