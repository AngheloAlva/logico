"use server"

import { prisma } from "@/lib/prisma"

export async function getDrivers() {
	try {
		const drivers = await prisma.driver.findMany({
			include: {
				region: true,
				city: true,
				motorbike: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		})
		return { success: true, data: drivers }
	} catch (error) {
		console.error("Error fetching drivers:", error)
		return { success: false, error: "Error al obtener motoristas" }
	}
}
