"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

import { motorbikeSchema, type MotorbikeInput } from "@/shared/schemas/motorbike.schema"
import { createAuditLog } from "@/lib/audit"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function createMotorbike(data: MotorbikeInput) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized" }
	}

	try {
		const validated = motorbikeSchema.parse(data)

		const motorbike = await prisma.motorbike.create({
			data: validated,
		})

		await createAuditLog({
			entity: "MOTORBIKE",
			entityId: motorbike.id,
			action: "CREATE",
			userId: session.user.id,
			newData: motorbike,
			motorbikeId: motorbike.id,
		})

		revalidatePath("/motos")
		return { success: true, data: motorbike }
	} catch (error) {
		console.error("Error creating motorbike:", error)
		return { success: false, error: "Error al crear moto" }
	}
}
