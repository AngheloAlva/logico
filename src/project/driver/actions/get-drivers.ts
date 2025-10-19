"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getDrivers() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized" }
	}

	try {
		const drivers = await prisma.driver.findMany({
			include: {
				region: true,
				city: true,
				motorbike: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		})
		return { success: true, data: drivers }
	} catch (error) {
		console.error("Error fetching drivers:", error)
		return { success: false, error: "Error al obtener motoristas" }
	}
}
