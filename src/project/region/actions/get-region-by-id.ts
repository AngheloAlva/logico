"use server"

import { prisma } from "@/lib/prisma"

export async function getRegionById(id: string) {
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
