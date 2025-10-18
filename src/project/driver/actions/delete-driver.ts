"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function deleteDriver(id: string) {
	try {
		await prisma.driver.delete({
			where: { id },
		})

		revalidatePath("/motoristas")
		return { success: true }
	} catch (error) {
		console.error("Error deleting driver:", error)
		return { success: false, error: "Error al eliminar motorista" }
	}
}
