"use server"

import { prisma } from "@/lib/prisma"

export async function getActiveDrivers() {
	try {
		const activeDrivers = await prisma.driver.findMany({
			where: {
				active: true,
			},
			include: {
				motorbike: true,
			},
			orderBy: {
				name: "asc",
			},
		})

		return { success: true, data: activeDrivers }
	} catch (error) {
		console.error("Error fetching active drivers:", error)
		return { success: false, error: "Error al obtener motoristas activos" }
	}
}
