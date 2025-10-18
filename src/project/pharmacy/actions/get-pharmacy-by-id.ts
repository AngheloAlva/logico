"use server"

import { prisma } from "@/lib/prisma"

export async function getPharmacyById(id: string) {
	try {
		const pharmacy = await prisma.pharmacy.findUnique({
			where: { id },
			include: {
				region: true,
				city: true,
			},
		})

		if (!pharmacy) {
			return { success: false, error: "Farmacia no encontrada" }
		}

		return { success: true, data: pharmacy }
	} catch (error) {
		console.error("Error fetching pharmacy:", error)
		return { success: false, error: "Error al obtener farmacia" }
	}
}
