import { z } from "zod"

export const emergencyContactSchema = z.object({
	relationship: z.string().min(2, "El parentesco debe tener al menos 2 caracteres"),
	phone: z.string().min(8, "Teléfono inválido"),
})

export const driverSchema = z.object({
	code: z.string().min(1, "El código es requerido"),
	firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
	paternalLastName: z.string().min(2, "El apellido paterno debe tener al menos 2 caracteres"),
	maternalLastName: z.string().min(2, "El apellido materno debe tener al menos 2 caracteres"),
	rut: z.string().min(9, "RUT inválido"),
	passport: z.string().optional(),
	birthDate: z.date().or(z.string().transform((str) => new Date(str))),
	address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
	email: z.string().email("Email inválido"),
	phone: z.string().min(8, "Teléfono inválido"),
	hasPersonalMotorbike: z.boolean().default(false),
	licenseFileUrl: z.string().url("URL inválida").optional().nullable(),
	licenseLastCheckDate: z
		.date()
		.or(z.string().transform((str) => new Date(str)))
		.optional()
		.nullable(),
	licenseExpiryDate: z
		.date()
		.or(z.string().transform((str) => new Date(str)))
		.optional()
		.nullable(),
	regionId: z.string().uuid("ID de región inválido"),
	provinceId: z.string().uuid("ID de provincia inválido"),
	cityId: z.string().uuid("ID de ciudad inválido"),
	emergencyContacts: z
		.array(emergencyContactSchema)
		.min(1, "Debe tener al menos un contacto de emergencia"),
	active: z.boolean().default(true),
})

export type EmergencyContactInput = z.infer<typeof emergencyContactSchema>
export type DriverInput = z.infer<typeof driverSchema>
