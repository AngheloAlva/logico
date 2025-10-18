"use server"

import { prisma } from "@/lib/prisma"

export async function getAvailableMotorbikes() {
	try {
		const motorbikes = await prisma.motorbike.findMany({
			where: {
				driverId: null,
			},
			orderBy: {
				brand: "asc",
			},
		})
		return { success: true, data: motorbikes }
	} catch (error) {
		console.error("Error fetching available motorbikes:", error)
		return { success: false, error: "Error al obtener motos disponibles" }
	}
}
