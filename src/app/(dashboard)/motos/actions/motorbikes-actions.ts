"use server"

import { PrismaClient } from "@/generated/prisma"
import { revalidatePath } from "next/cache"
import { motorbikeSchema, type MotorbikeInput } from "@/shared/schemas/motorbike.schema"

const prisma = new PrismaClient()

export async function getMotorbikes() {
	try {
		const motorbikes = await prisma.motorbike.findMany({
			include: {
				driver: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		})
		return { success: true, data: motorbikes }
	} catch (error) {
		console.error("Error fetching motorbikes:", error)
		return { success: false, error: "Error al obtener motos" }
	}
}

export async function getMotorbikeById(id: string) {
	try {
		const motorbike = await prisma.motorbike.findUnique({
			where: { id },
			include: {
				driver: true,
			},
		})
		
		if (!motorbike) {
			return { success: false, error: "Moto no encontrada" }
		}
		
		return { success: true, data: motorbike }
	} catch (error) {
		console.error("Error fetching motorbike:", error)
		return { success: false, error: "Error al obtener moto" }
	}
}

export async function createMotorbike(data: MotorbikeInput) {
	try {
		const validated = motorbikeSchema.parse(data)
		
		const motorbike = await prisma.motorbike.create({
			data: validated,
		})
		
		revalidatePath("/motos")
		return { success: true, data: motorbike }
	} catch (error) {
		console.error("Error creating motorbike:", error)
		return { success: false, error: "Error al crear moto" }
	}
}

export async function updateMotorbike(id: string, data: MotorbikeInput) {
	try {
		const validated = motorbikeSchema.parse(data)
		
		const motorbike = await prisma.motorbike.update({
			where: { id },
			data: validated,
		})
		
		revalidatePath("/motos")
		return { success: true, data: motorbike }
	} catch (error) {
		console.error("Error updating motorbike:", error)
		return { success: false, error: "Error al actualizar moto" }
	}
}

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

export async function assignMotorbike(motorbikeId: string, driverId: string | null) {
	try {
		const motorbike = await prisma.motorbike.update({
			where: { id: motorbikeId },
			data: {
				driverId: driverId,
			},
		})
		
		revalidatePath("/motos")
		revalidatePath("/motoristas")
		return { success: true, data: motorbike }
	} catch (error) {
		console.error("Error assigning motorbike:", error)
		return { success: false, error: "Error al asignar moto" }
	}
}

export async function getAvailableMotorbikes() {
	try {
		const motorbikes = await prisma.motorbike.findMany({
			where: {
				driverId: null,
			},
			orderBy: {
				brand: "asc",
			},
		})
		return { success: true, data: motorbikes }
	} catch (error) {
		console.error("Error fetching available motorbikes:", error)
		return { success: false, error: "Error al obtener motos disponibles" }
	}
}
