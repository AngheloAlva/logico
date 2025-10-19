"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function setDepartureDate(id: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || (session.user.role !== "admin" && session.user.role !== "operadora")) {
		return { success: false, error: "Unauthorized" }
	}

	try {
		const movement = await prisma.movement.update({
			where: { id },
			data: {
				departureDate: new Date(),
				status: "IN_TRANSIT",
			},
		})

		revalidatePath("/movimientos")
		revalidatePath(`/movimientos/${id}`)
		revalidatePath("/dashboard")
		return { success: true, data: movement }
	} catch (error) {
		console.error("Error setting departure date:", error)
		return { success: false, error: "Error al registrar salida" }
	}
}
