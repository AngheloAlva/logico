import { z } from "zod"

export const driverSchema = z.object({
	name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
	rut: z.string().min(9, "RUT inválido"),
	email: z.string().email("Email inválido"),
	phone: z.string().min(8, "Teléfono inválido"),
	address: z.string().optional(),
	regionId: z.string().uuid("ID de región inválido").optional(),
	cityId: z.string().uuid("ID de ciudad inválido").optional(),
	active: z.boolean().default(true),
})

export type DriverInput = z.infer<typeof driverSchema>
