"use server"

import { prisma } from "@/lib/prisma"

export async function getUsers() {
	try {
		const users = await prisma.user.findMany({
			orderBy: {
				createdAt: "desc",
			},
		})
		return { success: true, data: users }
	} catch (error) {
		console.error("Error fetching users:", error)
		return { success: false, error: "Error al obtener usuarios" }
	}
}
