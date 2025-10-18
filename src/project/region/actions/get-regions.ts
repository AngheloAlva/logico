"use server"

import { prisma } from "@/lib/prisma"

export async function getRegions() {
	try {
		const regions = await prisma.region.findMany({
			include: {
				cities: true,
			},
			orderBy: {
				name: "asc",
			},
		})
		return { success: true, data: regions }
	} catch (error) {
		console.error("Error fetching regions:", error)
		return { success: false, error: "Error al obtener regiones" }
	}
}
