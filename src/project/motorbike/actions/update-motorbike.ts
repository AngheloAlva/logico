"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { motorbikeSchema, type MotorbikeInput } from "@/shared/schemas/motorbike.schema"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createAuditLog } from "@/lib/audit"

export async function updateMotorbike(id: string, data: MotorbikeInput) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized" }
	}

	try {
		const validated = motorbikeSchema.parse(data)

		// Obtener datos anteriores
		const previousMotorbike = await prisma.motorbike.findUnique({
			where: { id },
		})

		const motorbike = await prisma.motorbike.update({
			where: { id },
			data: validated,
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
		})

		revalidatePath("/motos")
		return { success: true, data: motorbike }
	} catch (error) {
		console.error("Error updating motorbike:", error)
		return { success: false, error: "Error al actualizar moto" }
	}
}
