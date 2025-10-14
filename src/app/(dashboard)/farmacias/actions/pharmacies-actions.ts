"use server"

import { PrismaClient } from "@/generated/prisma"
import { revalidatePath } from "next/cache"
import { pharmacySchema, type PharmacyInput } from "@/shared/schemas/pharmacy.schema"

const prisma = new PrismaClient()

export async function getPharmacies() {
	try {
		const pharmacies = await prisma.pharmacy.findMany({
			include: {
				region: true,
				city: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		})
		return { success: true, data: pharmacies }
	} catch (error) {
		console.error("Error fetching pharmacies:", error)
		return { success: false, error: "Error al obtener farmacias" }
	}
}

export async function getPharmacyById(id: string) {
	try {
		const pharmacy = await prisma.pharmacy.findUnique({
			where: { id },
			include: {
				region: true,
				city: true,
			},
		})
		
		if (!pharmacy) {
			return { success: false, error: "Farmacia no encontrada" }
		}
		
		return { success: true, data: pharmacy }
	} catch (error) {
		console.error("Error fetching pharmacy:", error)
		return { success: false, error: "Error al obtener farmacia" }
	}
}

export async function createPharmacy(data: PharmacyInput) {
	try {
		const validated = pharmacySchema.parse(data)
		
		const pharmacy = await prisma.pharmacy.create({
			data: validated,
		})
		
		revalidatePath("/farmacias")
		return { success: true, data: pharmacy }
	} catch (error) {
		console.error("Error creating pharmacy:", error)
		return { success: false, error: "Error al crear farmacia" }
	}
}

export async function updatePharmacy(id: string, data: PharmacyInput) {
	try {
		const validated = pharmacySchema.parse(data)
		
		const pharmacy = await prisma.pharmacy.update({
			where: { id },
			data: validated,
		})
		
		revalidatePath("/farmacias")
		return { success: true, data: pharmacy }
	} catch (error) {
		console.error("Error updating pharmacy:", error)
		return { success: false, error: "Error al actualizar farmacia" }
	}
}

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
