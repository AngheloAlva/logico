"use server"

import { PrismaClient } from "@/generated/prisma"
import { revalidatePath } from "next/cache"
import { driverSchema, type DriverInput } from "@/shared/schemas/driver.schema"

const prisma = new PrismaClient()

export async function getDrivers() {
	try {
		const drivers = await prisma.driver.findMany({
			include: {
				region: true,
				city: true,
				motorbike: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		})
		return { success: true, data: drivers }
	} catch (error) {
		console.error("Error fetching drivers:", error)
		return { success: false, error: "Error al obtener motoristas" }
	}
}

export async function getDriverById(id: string) {
	try {
		const driver = await prisma.driver.findUnique({
			where: { id },
			include: {
				region: true,
				city: true,
				motorbike: true,
			},
		})
		
		if (!driver) {
			return { success: false, error: "Motorista no encontrado" }
		}
		
		return { success: true, data: driver }
	} catch (error) {
		console.error("Error fetching driver:", error)
		return { success: false, error: "Error al obtener motorista" }
	}
}

export async function createDriver(data: DriverInput) {
	try {
		const validated = driverSchema.parse(data)
		
		const driver = await prisma.driver.create({
			data: validated,
		})
		
		revalidatePath("/motoristas")
		return { success: true, data: driver }
	} catch (error) {
		console.error("Error creating driver:", error)
		return { success: false, error: "Error al crear motorista" }
	}
}

export async function updateDriver(id: string, data: DriverInput) {
	try {
		const validated = driverSchema.parse(data)
		
		const driver = await prisma.driver.update({
			where: { id },
			data: validated,
		})
		
		revalidatePath("/motoristas")
		return { success: true, data: driver }
	} catch (error) {
		console.error("Error updating driver:", error)
		return { success: false, error: "Error al actualizar motorista" }
	}
}

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

export async function toggleDriverStatus(id: string) {
	try {
		const driver = await prisma.driver.findUnique({
			where: { id },
		})
		
		if (!driver) {
			return { success: false, error: "Motorista no encontrado" }
		}
		
		const updated = await prisma.driver.update({
			where: { id },
			data: {
				active: !driver.active,
			},
		})
		
		revalidatePath("/motoristas")
		return { success: true, data: updated }
	} catch (error) {
		console.error("Error toggling driver status:", error)
		return { success: false, error: "Error al cambiar estado del motorista" }
	}
}

export async function getAvailableDrivers() {
	try {
		const drivers = await prisma.driver.findMany({
			where: {
				active: true,
			},
			orderBy: {
				name: "asc",
			},
		})
		return { success: true, data: drivers }
	} catch (error) {
		console.error("Error fetching available drivers:", error)
		return { success: false, error: "Error al obtener motoristas disponibles" }
	}
}
