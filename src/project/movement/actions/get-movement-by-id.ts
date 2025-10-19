"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getMovementById(id: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user) {
		return { success: false, error: "Unauthorized" }
	}

	try {
		const movement = await prisma.movement.findUnique({
			where: { id },
			include: {
				pharmacy: {
					include: {
						region: true,
						city: true,
					},
				},
				driver: true,
				incidents: {
					orderBy: {
						date: "desc",
					},
				},
			},
		})

		if (!movement) {
			return { success: false, error: "Movimiento no encontrado" }
		}

		return { success: true, data: movement }
	} catch (error) {
		console.error("Error fetching movement:", error)
		return { success: false, error: "Error al obtener movimiento" }
	}
}
