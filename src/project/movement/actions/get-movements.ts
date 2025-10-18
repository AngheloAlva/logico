"use server"

import { prisma } from "@/lib/prisma"

import type { MovementStatus, Prisma } from "@/generated/prisma"

export async function getMovements(filters?: {
	status?: MovementStatus | "all"
	pharmacyId?: string
}) {
	try {
		const where: Prisma.MovementWhereInput = {}

		if (filters?.status && filters.status !== "all") {
			where.status = filters.status
		}

		if (filters?.pharmacyId) {
			where.pharmacyId = filters.pharmacyId
		}

		const movements = await prisma.movement.findMany({
			where,
			include: {
				pharmacy: true,
				driver: true,
				incidents: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		})
		return { success: true, data: movements }
	} catch (error) {
		console.error("Error fetching movements:", error)
		return { success: false, error: "Error al obtener movimientos" }
	}
}
