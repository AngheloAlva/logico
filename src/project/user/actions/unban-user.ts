"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

export async function unbanUser(id: string) {
	try {
		const user = await prisma.user.update({
			where: { id },
			data: {
				banned: false,
				banReason: null,
				banExpires: null,
			},
		})

		revalidatePath("/usuarios")
		return { success: true, data: user }
	} catch (error) {
		console.error("Error unbanning user:", error)
		return { success: false, error: "Error al desbloquear usuario" }
	}
}
