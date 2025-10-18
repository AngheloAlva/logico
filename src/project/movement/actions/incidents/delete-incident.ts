"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

export async function deleteIncident(id: string) {
	try {
		await prisma.incident.delete({
			where: { id },
		})

		revalidatePath("/movimientos")
		return { success: true }
	} catch (error) {
		console.error("Error deleting incident:", error)
		return { success: false, error: "Error al eliminar incidencia" }
	}
}
