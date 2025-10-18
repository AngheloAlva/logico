"use server"

import { prisma } from "@/lib/prisma"

export async function getMotorbikeById(id: string) {
	try {
		const motorbike = await prisma.motorbike.findUnique({
			where: { id },
			include: {
				driver: true,
			},
		})

		if (!motorbike) {
			return { success: false, error: "Moto no encontrada" }
		}

		return { success: true, data: motorbike }
	} catch (error) {
		console.error("Error fetching motorbike:", error)
		return { success: false, error: "Error al obtener moto" }
	}
}
