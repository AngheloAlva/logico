"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getAvailableDrivers() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user) {
		return { success: false, error: "Unauthorized" }
	}

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
