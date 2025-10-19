"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createAuditLog } from "@/lib/audit"

export async function toggleDriverStatus(id: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized" }
	}

	try {
		const driver = await prisma.driver.findUnique({
			where: { id },
		})

		if (!driver) {
			return { success: false, error: "Motorista no encontrado" }
		}

		const updated = await prisma.driver.update({
			where: { id },
			data: {
				active: !driver.active,
			},
		})

		// Registrar auditoría
		await createAuditLog({
			entity: "DRIVER",
			entityId: updated.id,
			action: "STATUS_CHANGE",
			userId: session.user.id,
			previousData: driver,
			newData: updated,
			driverId: updated.id,
		})

		revalidatePath("/motoristas")
		return { success: true, data: updated }
	} catch (error) {
		console.error("Error toggling driver status:", error)
		return { success: false, error: "Error al cambiar estado del motorista" }
	}
}
