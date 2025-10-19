"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createAuditLog } from "@/lib/audit"

export async function assignMotorbike(motorbikeId: string, driverId: string | null) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized" }
	}

	try {
		// Obtener datos anteriores
		const previousMotorbike = await prisma.motorbike.findUnique({
			where: { id: motorbikeId },
		})

		const motorbike = await prisma.motorbike.update({
			where: { id: motorbikeId },
			data: {
				driverId: driverId,
			},
		})

		// Registrar auditoría
		await createAuditLog({
			entity: "MOTORBIKE",
			entityId: motorbike.id,
			action: "UPDATE",
			userId: session.user.id,
			previousData: previousMotorbike,
			newData: motorbike,
			motorbikeId: motorbike.id,
			driverId: driverId || undefined,
		})

		revalidatePath("/motos")
		revalidatePath("/motoristas")
		return { success: true, data: motorbike }
	} catch (error) {
		console.error("Error assigning motorbike:", error)
		return { success: false, error: "Error al asignar moto" }
	}
}
