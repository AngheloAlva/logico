"use server"

import { PrismaClient } from "@/generated/prisma"
import { revalidatePath } from "next/cache"
import {
	movementSchema,
	incidentSchema,
	type MovementInput,
	type IncidentInput,
} from "@/shared/schemas/movement.schema"

const prisma = new PrismaClient()

export async function getMovements(filters?: { status?: string; pharmacyId?: string }) {
	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const where: any = {}

		if (filters?.status && filters.status !== "all") {
			where.status = filters.status
		}

		if (filters?.pharmacyId) {
			where.pharmacyId = filters.pharmacyId
		}

		const movements = await prisma.movement.findMany({
			where,
			include: {
				pharmacy: true,
				driver: true,
				incidents: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		})
		return { success: true, data: movements }
	} catch (error) {
		console.error("Error fetching movements:", error)
		return { success: false, error: "Error al obtener movimientos" }
	}
}

export async function getMovementById(id: string) {
	try {
		const movement = await prisma.movement.findUnique({
			where: { id },
			include: {
				pharmacy: {
					include: {
						region: true,
						city: true,
					},
				},
				driver: true,
				incidents: {
					orderBy: {
						date: "desc",
					},
				},
			},
		})

		if (!movement) {
			return { success: false, error: "Movimiento no encontrado" }
		}

		return { success: true, data: movement }
	} catch (error) {
		console.error("Error fetching movement:", error)
		return { success: false, error: "Error al obtener movimiento" }
	}
}

export async function createMovement(data: MovementInput) {
	try {
		const validated = movementSchema.parse(data)

		const movement = await prisma.movement.create({
			data: {
				...validated,
				status: "PENDING",
			},
		})

		revalidatePath("/movimientos")
		return { success: true, data: movement }
	} catch (error) {
		console.error("Error creating movement:", error)
		return { success: false, error: "Error al crear movimiento" }
	}
}

export async function updateMovement(id: string, data: Partial<MovementInput>) {
	try {
		const movement = await prisma.movement.update({
			where: { id },
			data,
		})

		revalidatePath("/movimientos")
		revalidatePath(`/movimientos/${id}`)
		return { success: true, data: movement }
	} catch (error) {
		console.error("Error updating movement:", error)
		return { success: false, error: "Error al actualizar movimiento" }
	}
}

export async function updateMovementStatus(
	id: string,
	status: "PENDING" | "IN_TRANSIT" | "DELIVERED" | "INCIDENT"
) {
	try {
		const movement = await prisma.movement.update({
			where: { id },
			data: { status },
		})

		revalidatePath("/movimientos")
		revalidatePath(`/movimientos/${id}`)
		revalidatePath("/dashboard")
		return { success: true, data: movement }
	} catch (error) {
		console.error("Error updating movement status:", error)
		return { success: false, error: "Error al actualizar estado del movimiento" }
	}
}

export async function setDepartureDate(id: string) {
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

export async function setDeliveryDate(id: string) {
	try {
		const movement = await prisma.movement.update({
			where: { id },
			data: {
				deliveryDate: new Date(),
				status: "DELIVERED",
			},
		})

		revalidatePath("/movimientos")
		revalidatePath(`/movimientos/${id}`)
		revalidatePath("/dashboard")
		return { success: true, data: movement }
	} catch (error) {
		console.error("Error setting delivery date:", error)
		return { success: false, error: "Error al registrar entrega" }
	}
}

export async function deleteMovement(id: string) {
	try {
		await prisma.movement.delete({
			where: { id },
		})

		revalidatePath("/movimientos")
		revalidatePath("/dashboard")
		return { success: true }
	} catch (error) {
		console.error("Error deleting movement:", error)
		return { success: false, error: "Error al eliminar movimiento" }
	}
}

// Incidents
export async function createIncident(data: IncidentInput, userId: string) {
	try {
		const validated = incidentSchema.parse(data)

		const incident = await prisma.incident.create({
			data: {
				...validated,
				date: new Date(),
				createdByUserId: userId,
			},
		})

		// Actualizar el estado del movimiento a INCIDENT
		await prisma.movement.update({
			where: { id: data.movementId },
			data: {
				status: "INCIDENT",
			},
		})

		revalidatePath(`/movimientos/${data.movementId}`)
		revalidatePath("/movimientos")
		revalidatePath("/dashboard")
		return { success: true, data: incident }
	} catch (error) {
		console.error("Error creating incident:", error)
		return { success: false, error: "Error al crear incidencia" }
	}
}

export async function getIncidentsByMovement(movementId: string) {
	try {
		const incidents = await prisma.incident.findMany({
			where: { movementId },
			orderBy: {
				date: "desc",
			},
		})
		return { success: true, data: incidents }
	} catch (error) {
		console.error("Error fetching incidents:", error)
		return { success: false, error: "Error al obtener incidencias" }
	}
}

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
