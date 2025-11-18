"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

import { driverSchema, type DriverInput } from "@/shared/schemas/driver.schema"
import { createAuditLog } from "@/lib/audit"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function createDriver(data: DriverInput) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized" }
	}

	try {
		const validated = driverSchema.parse(data)

		const { emergencyContacts, ...driverData } = validated

		const driver = await prisma.driver.create({
			data: {
				...driverData,
				emergencyContacts: {
					create: emergencyContacts,
				},
			},
			include: {
				emergencyContacts: true,
				region: true,
				province: true,
				city: true,
			},
		})

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
