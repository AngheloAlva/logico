"use server"

import { prisma } from "@/lib/prisma"

export async function getStatsByPharmacy() {
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
