"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createAuditLog } from "@/lib/audit"

export async function deleteDriver(id: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized" }
	}

	try {
		// Obtener datos antes de eliminar
		const driver = await prisma.driver.findUnique({
			where: { id },
		})

		if (!driver) {
			return { success: false, error: "Motorista no encontrado" }
		}

		await prisma.driver.delete({
			where: { id },
		})

		// Registrar auditoría
		await createAuditLog({
			entity: "DRIVER",
			entityId: id,
			action: "DELETE",
			userId: session.user.id,
			previousData: driver,
			driverId: id,
		})

		revalidatePath("/motoristas")
		return { success: true }
	} catch (error) {
		console.error("Error deleting driver:", error)
		return { success: false, error: "Error al eliminar motorista" }
	}
}
