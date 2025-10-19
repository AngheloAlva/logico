"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function deleteUser(id: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized" }
	}

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
