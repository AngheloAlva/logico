"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { driverSchema, type DriverInput } from "@/shared/schemas/driver.schema"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createAuditLog } from "@/lib/audit"

export async function createDriver(data: DriverInput) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized" }
	}

	try {
		const validated = driverSchema.parse(data)

		const driver = await prisma.driver.create({
			data: validated,
		})

		// Registrar auditoría
		await createAuditLog({
			entity: "DRIVER",
			entityId: driver.id,
			action: "CREATE",
			userId: session.user.id,
			newData: driver,
			driverId: driver.id,
		})

		revalidatePath("/motoristas")
		return { success: true, data: driver }
	} catch (error) {
		console.error("Error creating driver:", error)
		return { success: false, error: "Error al crear motorista" }
	}
}
