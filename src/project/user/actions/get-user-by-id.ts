"use server"

import { prisma } from "@/lib/prisma"

export async function getUserById(id: string) {
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
