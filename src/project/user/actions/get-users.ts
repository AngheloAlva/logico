"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getUsers() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized" }
	}

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
