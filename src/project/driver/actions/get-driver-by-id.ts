"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getDriverById(id: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized" }
	}

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
