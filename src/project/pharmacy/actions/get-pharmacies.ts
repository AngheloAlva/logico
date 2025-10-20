"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

interface GetPharmaciesParams {
	page?: number
	pageSize?: number
	search?: string
}

export async function getPharmacies(params?: GetPharmaciesParams) {
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
					OR: [
						{ name: { contains: search, mode: "insensitive" as const } },
						{ address: { contains: search, mode: "insensitive" as const } },
						{ city: { name: { contains: search, mode: "insensitive" as const } } },
					],
			  }
			: {}

		const [pharmacies, total] = await Promise.all([
			prisma.pharmacy.findMany({
				where,
				include: {
					region: true,
					city: true,
				},
				orderBy: {
					createdAt: "desc",
				},
				skip,
				take: pageSize,
			}),
			prisma.pharmacy.count({ where }),
		])

		const totalPages = Math.ceil(total / pageSize)

		return { success: true, data: pharmacies, total, totalPages }
	} catch (error) {
		console.error("Error fetching pharmacies:", error)
		return { success: false, error: "Error al obtener farmacias", data: [], total: 0, totalPages: 0 }
	}
}
