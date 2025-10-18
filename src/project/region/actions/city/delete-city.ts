"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

export async function deleteCity(id: string) {
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
