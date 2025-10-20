"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

interface GetDriversParams {
	page?: number
	pageSize?: number
	search?: string
}

export async function getDrivers(params?: GetDriversParams) {
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
						{ name: { contains: search, mode: "insensitive" as const } },
						{ rut: { contains: search, mode: "insensitive" as const } },
						{ email: { contains: search, mode: "insensitive" as const } },
					],
			  }
			: {}

		const [drivers, total] = await Promise.all([
			prisma.driver.findMany({
				where,
				include: {
					region: true,
					city: true,
					motorbike: true,
				},
				orderBy: {
					createdAt: "desc",
				},
				skip,
				take: pageSize,
			}),
			prisma.driver.count({ where }),
		])

		const totalPages = Math.ceil(total / pageSize)

		return { success: true, data: drivers, total, totalPages }
	} catch (error) {
		console.error("Error fetching drivers:", error)
		return { success: false, error: "Error al obtener motoristas", data: [], total: 0, totalPages: 0 }
	}
}
