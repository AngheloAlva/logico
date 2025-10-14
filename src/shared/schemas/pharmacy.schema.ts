import { z } from "zod"

export const pharmacySchema = z.object({
	name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
	address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
	contactName: z.string().min(3, "El nombre de contacto debe tener al menos 3 caracteres"),
	contactPhone: z.string().min(8, "El teléfono debe tener al menos 8 caracteres"),
	contactEmail: z.string().email("Email inválido"),
	regionId: z.string().uuid("ID de región inválido"),
	cityId: z.string().uuid("ID de ciudad inválido"),
})

export type PharmacyInput = z.infer<typeof pharmacySchema>
