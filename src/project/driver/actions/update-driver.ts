"use server"

import { driverSchema, type DriverInput } from "@/shared/schemas/driver.schema"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function updateDriver(id: string, data: DriverInput) {
	try {
		const validated = driverSchema.parse(data)

		const driver = await prisma.driver.update({
			where: { id },
			data: validated,
		})

		revalidatePath("/motoristas")
		return { success: true, data: driver }
	} catch (error) {
		console.error("Error updating driver:", error)
		return { success: false, error: "Error al actualizar motorista" }
	}
}
