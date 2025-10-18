"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

export async function deleteRegion(id: string) {
	try {
		await prisma.region.delete({
			where: { id },
		})

		revalidatePath("/regiones")
		return { success: true }
	} catch (error) {
		console.error("Error deleting region:", error)
		return { success: false, error: "Error al eliminar región" }
	}
}
