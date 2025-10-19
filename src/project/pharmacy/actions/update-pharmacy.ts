"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { pharmacySchema, type PharmacyInput } from "@/shared/schemas/pharmacy.schema"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createAuditLog } from "@/lib/audit"

export async function updatePharmacy(id: string, data: PharmacyInput) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized" }
	}

	try {
		const validated = pharmacySchema.parse(data)

		// Obtener datos anteriores
		const previousPharmacy = await prisma.pharmacy.findUnique({
			where: { id },
		})

		const pharmacy = await prisma.pharmacy.update({
			where: { id },
			data: validated,
		})

		// Registrar auditoría
		await createAuditLog({
			entity: "PHARMACY",
			entityId: pharmacy.id,
			action: "UPDATE",
			userId: session.user.id,
			previousData: previousPharmacy,
			newData: pharmacy,
			pharmacyId: pharmacy.id,
		})

		revalidatePath("/farmacias")
		return { success: true, data: pharmacy }
	} catch (error) {
		console.error("Error updating pharmacy:", error)
		return { success: false, error: "Error al actualizar farmacia" }
	}
}
