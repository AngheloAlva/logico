"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getRegions() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user) {
		return { success: false, error: "Unauthorized" }
	}

	try {
		const regions = await prisma.region.findMany({
			include: {
				cities: true,
			},
			orderBy: {
				name: "asc",
			},
		})
		return { success: true, data: regions }
	} catch (error) {
		console.error("Error fetching regions:", error)
		return { success: false, error: "Error al obtener regiones" }
	}
}
