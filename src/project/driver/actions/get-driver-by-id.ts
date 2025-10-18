"use server"

import { prisma } from "@/lib/prisma"

export async function getDriverById(id: string) {
	try {
		const driver = await prisma.driver.findUnique({
			where: { id },
			include: {
				region: true,
				city: true,
				motorbike: true,
			},
		})

		if (!driver) {
			return { success: false, error: "Motorista no encontrado" }
		}

		return { success: true, data: driver }
	} catch (error) {
		console.error("Error fetching driver:", error)
		return { success: false, error: "Error al obtener motorista" }
	}
}
