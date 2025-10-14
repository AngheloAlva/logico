import { z } from "zod"

export const movementSchema = z.object({
	number: z.string().min(10, "El número debe tener al menos 10 caracteres"),
	pharmacyId: z.string().uuid("ID de farmacia inválido"),
	driverId: z.string().uuid("ID de motorista inválido"),
	address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
	hasRecipe: z.boolean().default(false),
	segments: z.number().int().positive().default(1),
	segmentCost: z.number().positive("El costo debe ser positivo").optional(),
	segmentsAddress: z.array(z.string()).default([]),
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
