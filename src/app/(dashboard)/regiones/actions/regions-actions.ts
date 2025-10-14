"use server"

import { PrismaClient } from "@/generated/prisma"
import { revalidatePath } from "next/cache"
import { regionSchema, citySchema, type RegionInput, type CityInput } from "@/shared/schemas/region.schema"

const prisma = new PrismaClient()

export async function getRegions() {
	try {
		const regions = await prisma.region.findMany({
			include: {
				cities: true,
			},
			orderBy: {
				name: "asc",
			},
		})
		return { success: true, data: regions }
	} catch (error) {
		console.error("Error fetching regions:", error)
		return { success: false, error: "Error al obtener regiones" }
	}
}

export async function getRegionById(id: string) {
	try {
		const region = await prisma.region.findUnique({
			where: { id },
			include: {
				cities: true,
			},
		})
		
		if (!region) {
			return { success: false, error: "Región no encontrada" }
		}
		
		return { success: true, data: region }
	} catch (error) {
		console.error("Error fetching region:", error)
		return { success: false, error: "Error al obtener región" }
	}
}

export async function createRegion(data: RegionInput) {
	try {
		const validated = regionSchema.parse(data)
		
		const region = await prisma.region.create({
			data: validated,
		})
		
		revalidatePath("/regiones")
		return { success: true, data: region }
	} catch (error) {
		console.error("Error creating region:", error)
		return { success: false, error: "Error al crear región" }
	}
}

export async function updateRegion(id: string, data: RegionInput) {
	try {
		const validated = regionSchema.parse(data)
		
		const region = await prisma.region.update({
			where: { id },
			data: validated,
		})
		
		revalidatePath("/regiones")
		return { success: true, data: region }
	} catch (error) {
		console.error("Error updating region:", error)
		return { success: false, error: "Error al actualizar región" }
	}
}

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

export async function createCity(data: CityInput) {
	try {
		const validated = citySchema.parse(data)
		
		const city = await prisma.city.create({
			data: validated,
		})
		
		revalidatePath("/regiones")
		return { success: true, data: city }
	} catch (error) {
		console.error("Error creating city:", error)
		return { success: false, error: "Error al crear ciudad" }
	}
}

export async function updateCity(id: string, data: CityInput) {
	try {
		const validated = citySchema.parse(data)
		
		const city = await prisma.city.update({
			where: { id },
			data: validated,
		})
		
		revalidatePath("/regiones")
		return { success: true, data: city }
	} catch (error) {
		console.error("Error updating city:", error)
		return { success: false, error: "Error al actualizar ciudad" }
	}
}

export async function deleteCity(id: string) {
	try {
		await prisma.city.delete({
			where: { id },
		})
		
		revalidatePath("/regiones")
		return { success: true }
	} catch (error) {
		console.error("Error deleting city:", error)
		return { success: false, error: "Error al eliminar ciudad" }
	}
}
