"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getMotorbikeById(id: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized" }
	}

	try {
		const motorbike = await prisma.motorbike.findUnique({
			where: { id },
			include: {
				driver: true,
				annualDocumentations: {
					orderBy: {
						year: "desc",
					},
				},
			},
		})

		if (!motorbike) {
			return { success: false, error: "Moto no encontrada" }
		}

		return { success: true, data: motorbike }
	} catch (error) {
		console.error("Error fetching motorbike:", error)
		return { success: false, error: "Error al obtener moto" }
	}
}
