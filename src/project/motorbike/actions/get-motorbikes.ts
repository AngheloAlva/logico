"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

interface GetMotorbikesParams {
	page?: number
	pageSize?: number
	search?: string
}

export async function getMotorbikes(params?: GetMotorbikesParams) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized", data: [], total: 0, totalPages: 0 }
	}

	const page = params?.page || 1
	const pageSize = params?.pageSize || 10
	const skip = (page - 1) * pageSize
	const search = params?.search || ""

	try {
		const where = search
			? {
					OR: [
						{ brand: { contains: search, mode: "insensitive" as const } },
						{ model: { contains: search, mode: "insensitive" as const } },
						{ plate: { contains: search, mode: "insensitive" as const } },
					],
			  }
			: {}

		const [motorbikes, total] = await Promise.all([
			prisma.motorbike.findMany({
				where,
				include: {
					driver: true,
				},
				orderBy: {
					createdAt: "desc",
				},
				skip,
				take: pageSize,
			}),
			prisma.motorbike.count({ where }),
		])

		const totalPages = Math.ceil(total / pageSize)

		return { success: true, data: motorbikes, total, totalPages }
	} catch (error) {
		console.error("Error fetching motorbikes:", error)
		return { success: false, error: "Error al obtener motos", data: [], total: 0, totalPages: 0 }
	}
}
