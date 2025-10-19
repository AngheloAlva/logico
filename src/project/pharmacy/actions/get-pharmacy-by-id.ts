"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getPharmacyById(id: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user) {
		return { success: false, error: "Unauthorized" }
	}

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
