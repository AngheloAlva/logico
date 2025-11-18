"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { citySchema, type CityInput } from "@/shared/schemas/region.schema"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function createCity(data: CityInput) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized" }
	}

	try {
		const validated = citySchema.parse(data)

		const city = await prisma.city.create({
			data: {
				...validated,
				provinceId: "",
			},
		})

		revalidatePath("/regiones")
		return { success: true, data: city }
	} catch (error) {
		console.error("Error creating city:", error)
		return { success: false, error: "Error al crear ciudad" }
	}
}
