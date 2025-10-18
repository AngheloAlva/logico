"use server"

import { prisma } from "@/lib/prisma"

export async function getMotorbikes() {
	try {
		const motorbikes = await prisma.motorbike.findMany({
			include: {
				driver: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		})
		return { success: true, data: motorbikes }
	} catch (error) {
		console.error("Error fetching motorbikes:", error)
		return { success: false, error: "Error al obtener motos" }
	}
}
