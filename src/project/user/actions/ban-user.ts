"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function banUser(id: string, reason: string, expiresAt?: Date) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized" }
	}

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
