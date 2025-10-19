"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createAuditLog } from "@/lib/audit"

export async function deleteMotorbike(id: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized" }
	}

	try {
		// Obtener datos antes de eliminar
		const motorbike = await prisma.motorbike.findUnique({
			where: { id },
		})

		if (!motorbike) {
			return { success: false, error: "Moto no encontrada" }
		}

		await prisma.motorbike.delete({
			where: { id },
		})

		// Registrar auditoría
		await createAuditLog({
			entity: "MOTORBIKE",
			entityId: id,
			action: "DELETE",
			userId: session.user.id,
			previousData: motorbike,
			motorbikeId: id,
		})

		revalidatePath("/motos")
		return { success: true }
	} catch (error) {
		console.error("Error deleting motorbike:", error)
		return { success: false, error: "Error al eliminar moto" }
	}
}
