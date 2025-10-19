"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { regionSchema, type RegionInput } from "@/shared/schemas/region.schema"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function createRegion(data: RegionInput) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized" }
	}

	try {
		const validated = regionSchema.parse(data)

		const region = await prisma.region.create({
			data: validated,
		})

		revalidatePath("/regiones")
		return { success: true, data: region }
	} catch (error) {
		console.error("Error creating region:", error)
		return { success: false, error: "Error al crear región" }
	}
}
