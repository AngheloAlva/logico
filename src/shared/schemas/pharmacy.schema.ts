import { z } from "zod"

export const pharmacySchema = z.object({
	code: z.string().min(1, "El código es requerido"),
	name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
	address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
	phone: z.string().min(8, "El teléfono debe tener al menos 8 caracteres"),
	openingTime: z
		.string()
		.regex(/^\d{2}:\d{2}(:\d{2})?$/, "Formato de hora inválido (HH:MM o HH:MM:SS)"),
	closingTime: z
		.string()
		.regex(/^\d{2}:\d{2}(:\d{2})?$/, "Formato de hora inválido (HH:MM o HH:MM:SS)"),
	latitude: z.number().min(-90).max(90, "Latitud inválida"),
	longitude: z.number().min(-180).max(180, "Longitud inválida"),
	regionId: z.string().uuid("ID de región inválido"),
	provinceId: z.string().uuid("ID de provincia inválido"),
	cityId: z.string().uuid("ID de ciudad inválido"),
})

export type PharmacyInput = z.infer<typeof pharmacySchema>
