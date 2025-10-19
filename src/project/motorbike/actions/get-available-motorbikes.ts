"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getAvailableMotorbikes() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user) {
		return { success: false, error: "Unauthorized" }
	}

	try {
		const motorbikes = await prisma.motorbike.findMany({
			where: {
				driverId: null,
			},
			orderBy: {
				brand: "asc",
			},
		})
		return { success: true, data: motorbikes }
	} catch (error) {
		console.error("Error fetching available motorbikes:", error)
		return { success: false, error: "Error al obtener motos disponibles" }
	}
}
