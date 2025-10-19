"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createAuditLog } from "@/lib/audit"

export async function deletePharmacy(id: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized" }
	}

	try {
		// Obtener datos antes de eliminar
		const pharmacy = await prisma.pharmacy.findUnique({
			where: { id },
		})

		if (!pharmacy) {
			return { success: false, error: "Farmacia no encontrada" }
		}

		await prisma.pharmacy.delete({
			where: { id },
		})

		// Registrar auditoría
		await createAuditLog({
			entity: "PHARMACY",
			entityId: id,
			action: "DELETE",
			userId: session.user.id,
			previousData: pharmacy,
			pharmacyId: id,
		})

		revalidatePath("/farmacias")
		return { success: true }
	} catch (error) {
		console.error("Error deleting pharmacy:", error)
		return { success: false, error: "Error al eliminar farmacia" }
	}
}
