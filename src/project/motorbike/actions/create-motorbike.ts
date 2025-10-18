"use server"

import { revalidatePath } from "next/cache"

import { motorbikeSchema, type MotorbikeInput } from "@/shared/schemas/motorbike.schema"
import { prisma } from "@/lib/prisma"

export async function createMotorbike(data: MotorbikeInput) {
	try {
		const validated = motorbikeSchema.parse(data)

		const motorbike = await prisma.motorbike.create({
			data: validated,
		})

		revalidatePath("/motos")
		return { success: true, data: motorbike }
	} catch (error) {
		console.error("Error creating motorbike:", error)
		return { success: false, error: "Error al crear moto" }
	}
}
