"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

export async function updateUser(id: string, data: { name?: string; role?: string }) {
	try {
		const user = await prisma.user.update({
			where: { id },
			data,
		})

		revalidatePath("/usuarios")
		return { success: true, data: user }
	} catch (error) {
		console.error("Error updating user:", error)
		return { success: false, error: "Error al actualizar usuario" }
	}
}
