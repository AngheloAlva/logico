"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

export async function banUser(id: string, reason: string, expiresAt?: Date) {
	try {
		const user = await prisma.user.update({
			where: { id },
			data: {
				banned: true,
				banReason: reason,
				banExpires: expiresAt,
			},
		})

		revalidatePath("/usuarios")
		return { success: true, data: user }
	} catch (error) {
		console.error("Error banning user:", error)
		return { success: false, error: "Error al bloquear usuario" }
	}
}
