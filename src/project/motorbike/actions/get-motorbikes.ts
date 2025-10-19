"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getMotorbikes() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized" }
	}

	try {
		const motorbikes = await prisma.motorbike.findMany({
			include: {
				driver: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		})
		return { success: true, data: motorbikes }
	} catch (error) {
		console.error("Error fetching motorbikes:", error)
		return { success: false, error: "Error al obtener motos" }
	}
}
