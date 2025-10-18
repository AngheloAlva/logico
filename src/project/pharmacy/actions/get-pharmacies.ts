"use server"

import { prisma } from "@/lib/prisma"

export async function getPharmacies() {
	try {
		const pharmacies = await prisma.pharmacy.findMany({
			include: {
				region: true,
				city: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		})
		return { success: true, data: pharmacies }
	} catch (error) {
		console.error("Error fetching pharmacies:", error)
		return { success: false, error: "Error al obtener farmacias" }
	}
}
