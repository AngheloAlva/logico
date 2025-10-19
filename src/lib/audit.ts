"use server"

import { prisma } from "@/lib/prisma"

export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE"

export type AuditEntity =
	| "DRIVER"
	| "MOTORBIKE"
	| "PHARMACY"
	| "MOVEMENT"
	| "INCIDENT"
	| "REGION"
	| "CITY"
	| "USER"

interface AuditLogParams {
	entity: AuditEntity
	entityId: string
	action: AuditAction
	userId: string
	previousData?: unknown
	newData?: unknown
	// Relaciones opcionales para facilitar consultas
	pharmacyId?: string
	driverId?: string
	motorbikeId?: string
	movementId?: string
	incidentId?: string
}

/**
 * Registra una acción en el log de auditoría
 * @param params Parámetros del log de auditoría
 */
export async function createAuditLog(params: AuditLogParams): Promise<void> {
	try {
		await prisma.auditLog.create({
			data: {
				entity: params.entity,
				entityId: params.entityId,
				action: params.action,
				userId: params.userId,
				previousData: params.previousData ? JSON.parse(JSON.stringify(params.previousData)) : null,
				newData: params.newData ? JSON.parse(JSON.stringify(params.newData)) : null,
				pharmacyId: params.pharmacyId,
				driverId: params.driverId,
				motorbikeId: params.motorbikeId,
				movementId: params.movementId,
				incidentId: params.incidentId,
			},
		})
	} catch (error) {
		// Log el error pero no fallar la operación principal
		console.error("Error creating audit log:", error)
	}
}

/**
 * Obtiene el historial de auditoría de una entidad específica
 * @param entity Tipo de entidad
 * @param entityId ID de la entidad
 */
export async function getAuditLogs(entity: AuditEntity, entityId: string) {
	try {
		const logs = await prisma.auditLog.findMany({
			where: {
				entity,
				entityId,
			},
			orderBy: {
				timestamp: "desc",
			},
		})

		return { success: true, data: logs }
	} catch (error) {
		console.error("Error fetching audit logs:", error)
		return { success: false, error: "Error al obtener logs de auditoría" }
	}
}

/**
 * Obtiene todos los logs de auditoría con filtros opcionales
 * @param filters Filtros opcionales
 */
export async function getAllAuditLogs(filters?: {
	entity?: AuditEntity
	userId?: string
	action?: AuditAction
	startDate?: Date
	endDate?: Date
}) {
	try {
		const where: {
			entity?: AuditEntity
			userId?: string
			action?: AuditAction
			timestamp?: { gte?: Date; lte?: Date }
		} = {}

		if (filters?.entity) where.entity = filters.entity
		if (filters?.userId) where.userId = filters.userId
		if (filters?.action) where.action = filters.action
		if (filters?.startDate || filters?.endDate) {
			where.timestamp = {}
			if (filters.startDate) where.timestamp.gte = filters.startDate
			if (filters.endDate) where.timestamp.lte = filters.endDate
		}

		const logs = await prisma.auditLog.findMany({
			where,
			orderBy: {
				timestamp: "desc",
			},
			take: 100, // Limitar a 100 registros por defecto
		})

		return { success: true, data: logs }
	} catch (error) {
		console.error("Error fetching all audit logs:", error)
		return { success: false, error: "Error al obtener logs de auditoría" }
	}
}
