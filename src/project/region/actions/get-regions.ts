"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

interface GetRegionsParams {
	page?: number
	pageSize?: number
	search?: string
}

export async function getRegions(params?: GetRegionsParams) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user) {
		return { success: false, error: "Unauthorized", data: [], total: 0, totalPages: 0 }
	}

	const page = params?.page || 1
	const pageSize = params?.pageSize || 10
	const skip = (page - 1) * pageSize
	const search = params?.search || ""

	try {
		const where = search
			? {
					name: { contains: search, mode: "insensitive" as const },
				}
			: {}

		const [regions, total] = await Promise.all([
			prisma.region.findMany({
				where,
				include: {
					provinces: {
						include: {
							cities: true,
						},
					},
				},
				orderBy: {
					name: "asc",
				},
				skip,
				take: pageSize,
			}),
			prisma.region.count({ where }),
		])

		const totalPages = Math.ceil(total / pageSize)

		return { success: true, data: regions, total, totalPages }
	} catch (error) {
		console.error("Error fetching regions:", error)
		return { success: false, error: "Error al obtener regiones", data: [], total: 0, totalPages: 0 }
	}
}
