import { z } from "zod"

export const retryHistoryItemSchema = z.object({
	attempt: z.number().int().positive(),
	date: z.string().datetime(),
	reason: z.string().min(5, "La razón debe tener al menos 5 caracteres"),
})

export const movementSchema = z.object({
	number: z.string().min(10, "El número debe tener al menos 10 caracteres"),
	pharmacyId: z.string().uuid("ID de farmacia inválido"),
	driverId: z.string().uuid("ID de motorista inválido"),
	address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
	type: z.enum(["ENTREGA", "ENTREGA_CON_RECETA", "REINTENTO", "ENTREGA_VARIAS_DIRECCIONES"]),
	hasRecipe: z.boolean().default(false),
	segments: z.number().int().positive().optional().nullable(),
	segmentCost: z.number().positive("El costo debe ser positivo").optional().nullable(),
	segmentsAddress: z.array(z.string()).default([]),
	retryCount: z.number().int().min(0).default(0),
	retryHistory: z
		.object({
			retries: z.array(retryHistoryItemSchema),
		})
		.optional()
		.nullable(),
})

export const incidentSchema = z.object({
	movementId: z.string().uuid("ID de movimiento inválido"),
	type: z.enum([
		"direccion_erronea",
		"cliente_no_encontrado",
		"reintento",
		"cobro_rechazado",
		"otro",
	]),
	description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
})

export type MovementInput = z.infer<typeof movementSchema>
export type IncidentInput = z.infer<typeof incidentSchema>
