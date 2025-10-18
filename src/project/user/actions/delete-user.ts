"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

export async function deleteUser(id: string) {
	try {
		await prisma.user.delete({
			where: { id },
		})

		revalidatePath("/usuarios")
		return { success: true }
	} catch (error) {
		console.error("Error deleting user:", error)
		return { success: false, error: "Error al eliminar usuario" }
	}
}
