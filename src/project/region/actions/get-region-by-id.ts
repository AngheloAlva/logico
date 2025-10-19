"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getRegionById(id: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user) {
		return { success: false, error: "Unauthorized" }
	}

	try {
		const region = await prisma.region.findUnique({
			where: { id },
			include: {
				cities: true,
			},
		})

		if (!region) {
			return { success: false, error: "Región no encontrada" }
		}

		return { success: true, data: region }
	} catch (error) {
		console.error("Error fetching region:", error)
		return { success: false, error: "Error al obtener región" }
	}
}
