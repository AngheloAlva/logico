"use server"

import { prisma } from "@/lib/prisma"

export async function getAvailableDrivers() {
	try {
		const drivers = await prisma.driver.findMany({
			where: {
				active: true,
			},
			orderBy: {
				name: "asc",
			},
		})
		return { success: true, data: drivers }
	} catch (error) {
		console.error("Error fetching available drivers:", error)
		return { success: false, error: "Error al obtener motoristas disponibles" }
	}
}
