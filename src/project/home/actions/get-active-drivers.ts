"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getActiveDrivers() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user) {
		return { success: false, error: "Unauthorized" }
	}

	try {
		const activeDrivers = await prisma.driver.findMany({
			where: {
				active: true,
			},
			include: {
				motorbikes: true,
			},
			orderBy: {
				firstName: "asc",
			},
		})

		return { success: true, data: activeDrivers }
	} catch (error) {
		console.error("Error fetching active drivers:", error)
		return { success: false, error: "Error al obtener motoristas activos" }
	}
}
