"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getStatsByPharmacy() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user) {
		return { success: false, error: "Unauthorized" }
	}

	try {
		const stats = await prisma.pharmacy.findMany({
			include: {
				_count: {
					select: {
						movements: true,
					},
				},
			},
			orderBy: {
				name: "asc",
			},
		})

		return { success: true, data: stats }
	} catch (error) {
		console.error("Error fetching stats by pharmacy:", error)
		return { success: false, error: "Error al obtener estadísticas por farmacia" }
	}
}
