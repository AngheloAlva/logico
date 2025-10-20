"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

import type { MovementStatus, Prisma } from "@/generated/prisma"

export async function getMovements(filters?: {
	status?: MovementStatus | "all"
	pharmacyId?: string
	page?: number
	pageSize?: number
	search?: string
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user) {
		return { success: false, error: "Unauthorized", data: [], total: 0, totalPages: 0 }
	}

	const page = filters?.page || 1
	const pageSize = filters?.pageSize || 10
	const skip = (page - 1) * pageSize
	const search = filters?.search || ""

	try {
		const where: Prisma.MovementWhereInput = {}

		if (filters?.status && filters.status !== "all") {
			where.status = filters.status
		}

		if (filters?.pharmacyId) {
			where.pharmacyId = filters.pharmacyId
		}

		if (search) {
			where.OR = [
				{ number: { contains: search, mode: "insensitive" } },
				{ address: { contains: search, mode: "insensitive" } },
				{ pharmacy: { name: { contains: search, mode: "insensitive" } } },
				{ driver: { name: { contains: search, mode: "insensitive" } } },
			]
		}

		const [movements, total] = await Promise.all([
			prisma.movement.findMany({
				where,
				include: {
					pharmacy: true,
					driver: true,
					incidents: true,
				},
				orderBy: {
					createdAt: "desc",
				},
				skip,
				take: pageSize,
			}),
			prisma.movement.count({ where }),
		])

		const totalPages = Math.ceil(total / pageSize)

		return { success: true, data: movements, total, totalPages }
	} catch (error) {
		console.error("Error fetching movements:", error)
		return {
			success: false,
			error: "Error al obtener movimientos",
			data: [],
			total: 0,
			totalPages: 0,
		}
	}
}
