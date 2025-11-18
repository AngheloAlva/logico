import { z } from "zod"

export const motorbikeSchema = z.object({
	plate: z.string().min(6, "La patente debe tener al menos 6 caracteres"),
	brand: z.string().min(2, "La marca debe tener al menos 2 caracteres"),
	model: z.string().min(2, "El modelo debe tener al menos 2 caracteres"),
	color: z.string().min(3, "El color debe tener al menos 3 caracteres"),
	year: z
		.number()
		.int()
		.min(1900)
		.max(new Date().getFullYear() + 1, "Año inválido"),
	chassisNumber: z.string().min(1, "El número de chasis es requerido"),
	engineNumber: z.string().min(1, "El número de motor es requerido"),
	owner: z.enum(["EMPRESA", "MOTORISTA"]),
	driverId: z.string().uuid("ID de motorista inválido").optional().nullable(),
})

export const motorbikeDocumentationSchema = z.object({
	year: z
		.number()
		.int()
		.min(2000)
		.max(new Date().getFullYear() + 1, "Año inválido"),
	circulationPermitFileUrl: z.string().url("URL inválida").optional().nullable(),
	mandatoryInsuranceFileUrl: z.string().url("URL inválida").optional().nullable(),
	mandatoryInsuranceExpiryDate: z
		.date()
		.or(z.string().transform((str) => new Date(str)))
		.optional()
		.nullable(),
	technicalInspectionFileUrl: z.string().url("URL inválida").optional().nullable(),
	technicalInspectionExpiryDate: z
		.date()
		.or(z.string().transform((str) => new Date(str)))
		.optional()
		.nullable(),
	motorbikeId: z.string().uuid("ID de moto inválido"),
})

export type MotorbikeInput = z.infer<typeof motorbikeSchema>
export type MotorbikeDocumentationInput = z.infer<typeof motorbikeDocumentationSchema>
