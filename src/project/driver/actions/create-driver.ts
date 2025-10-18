"use server"

import { revalidatePath } from "next/cache"

import { driverSchema, type DriverInput } from "@/shared/schemas/driver.schema"
import { prisma } from "@/lib/prisma"

export async function createDriver(data: DriverInput) {
	try {
		const validated = driverSchema.parse(data)

		const driver = await prisma.driver.create({
			data: validated,
		})

		revalidatePath("/motoristas")
		return { success: true, data: driver }
	} catch (error) {
		console.error("Error creating driver:", error)
		return { success: false, error: "Error al crear motorista" }
	}
}
