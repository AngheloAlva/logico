"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

export async function deletePharmacy(id: string) {
	try {
		await prisma.pharmacy.delete({
			where: { id },
		})

		revalidatePath("/farmacias")
		return { success: true }
	} catch (error) {
		console.error("Error deleting pharmacy:", error)
		return { success: false, error: "Error al eliminar farmacia" }
	}
}
