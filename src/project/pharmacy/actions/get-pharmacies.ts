"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getPharmacies() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user) {
		return { success: false, error: "Unauthorized" }
	}

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
