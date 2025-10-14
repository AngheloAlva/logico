"use server"

import { PrismaClient } from "@/generated/prisma"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function getUsers() {
	try {
		const users = await prisma.user.findMany({
			orderBy: {
				createdAt: "desc",
			},
		})
		return { success: true, data: users }
	} catch (error) {
		console.error("Error fetching users:", error)
		return { success: false, error: "Error al obtener usuarios" }
	}
}

export async function getUserById(id: string) {
	try {
		const user = await prisma.user.findUnique({
			where: { id },
		})
		
		if (!user) {
			return { success: false, error: "Usuario no encontrado" }
		}
		
		return { success: true, data: user }
	} catch (error) {
		console.error("Error fetching user:", error)
		return { success: false, error: "Error al obtener usuario" }
	}
}

export async function updateUser(id: string, data: { name?: string; role?: string }) {
	try {
		const user = await prisma.user.update({
			where: { id },
			data,
		})
		
		revalidatePath("/usuarios")
		return { success: true, data: user }
	} catch (error) {
		console.error("Error updating user:", error)
		return { success: false, error: "Error al actualizar usuario" }
	}
}

export async function deleteUser(id: string) {
	try {
		await prisma.user.delete({
			where: { id },
		})
		
		revalidatePath("/usuarios")
		return { success: true }
	} catch (error) {
		console.error("Error deleting user:", error)
		return { success: false, error: "Error al eliminar usuario" }
	}
}

export async function banUser(id: string, reason: string, expiresAt?: Date) {
	try {
		const user = await prisma.user.update({
			where: { id },
			data: {
				banned: true,
				banReason: reason,
				banExpires: expiresAt,
			},
		})
		
		revalidatePath("/usuarios")
		return { success: true, data: user }
	} catch (error) {
		console.error("Error banning user:", error)
		return { success: false, error: "Error al bloquear usuario" }
	}
}

export async function unbanUser(id: string) {
	try {
		const user = await prisma.user.update({
			where: { id },
			data: {
				banned: false,
				banReason: null,
				banExpires: null,
			},
		})
		
		revalidatePath("/usuarios")
		return { success: true, data: user }
	} catch (error) {
		console.error("Error unbanning user:", error)
		return { success: false, error: "Error al desbloquear usuario" }
	}
}
