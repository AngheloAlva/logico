"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

interface GetUsersParams {
	page?: number
	pageSize?: number
	search?: string
}

export async function getUsers(params?: GetUsersParams) {
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
						{ email: { contains: search, mode: "insensitive" as const } },
					],
			  }
			: {}

		const [users, total] = await Promise.all([
			prisma.user.findMany({
				where,
				orderBy: {
					createdAt: "desc",
				},
				skip,
				take: pageSize,
			}),
			prisma.user.count({ where }),
		])

		const totalPages = Math.ceil(total / pageSize)

		return { success: true, data: users, total, totalPages }
	} catch (error) {
		console.error("Error fetching users:", error)
		return { success: false, error: "Error al obtener usuarios", data: [], total: 0, totalPages: 0 }
	}
}
