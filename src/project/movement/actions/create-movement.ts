"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

import { movementSchema, type MovementInput } from "@/shared/schemas/movement.schema"
import { MovementStatus } from "@/generated/prisma"
import { createAuditLog } from "@/lib/audit"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function createMovement(data: MovementInput) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user || (session.user.role !== "admin" && session.user.role !== "operadora")) {
		return { success: false, error: "Unauthorized" }
	}

	try {
		const validated = movementSchema.parse(data)

		const { retryHistory, ...restData } = validated
		const movementData: MovementInput & {
			retryHistory?: {
				retries: {
					attempt: number
					date: string
					reason: string
				}[]
			}
			status: MovementStatus
		} = {
			...restData,
			status: MovementStatus.PENDING,
		}

		if (retryHistory) {
			movementData.retryHistory = retryHistory
		}

		const movement = await prisma.movement.create({
			data: movementData,
		})

		await createAuditLog({
			entity: "MOVEMENT",
			entityId: movement.id,
			action: "CREATE",
			userId: session.user.id,
			newData: movement,
			movementId: movement.id,
			pharmacyId: movement.pharmacyId,
			driverId: movement.driverId,
		})

		revalidatePath("/movimientos")
		return { success: true, data: movement }
	} catch (error) {
		console.error("Error creating movement:", error)
		return { success: false, error: "Error al crear movimiento" }
	}
}
