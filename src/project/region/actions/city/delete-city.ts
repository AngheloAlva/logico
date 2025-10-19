"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function deleteCity(id: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || session.user.role !== "admin") {
		return { success: false, error: "Unauthorized" }
	}

	try {
		await prisma.city.delete({
			where: { id },
		})

		revalidatePath("/regiones")
		return { success: true }
	} catch (error) {
		console.error("Error deleting city:", error)
		return { success: false, error: "Error al eliminar ciudad" }
	}
}
