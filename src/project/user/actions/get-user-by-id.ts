"use server"

import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getUserById(id: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized" }
	}

	try {
		const user = await prisma.user.findUnique({
			where: { id },
		})

		if (!user) {
			return { success: false, error: "Usuario no encontrado" }
		}

		return { success: true, data: user }
	} catch (error) {
		console.error("Error fetching user:", error)
		return { success: false, error: "Error al obtener usuario" }
	}
}
