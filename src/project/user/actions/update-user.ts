"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function updateUser(id: string, data: { name?: string; role?: string }) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized" }
	}

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
