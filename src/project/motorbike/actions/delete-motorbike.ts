"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

export async function deleteMotorbike(id: string) {
	try {
		await prisma.motorbike.delete({
			where: { id },
		})

		revalidatePath("/motos")
		return { success: true }
	} catch (error) {
		console.error("Error deleting motorbike:", error)
		return { success: false, error: "Error al eliminar moto" }
	}
}
