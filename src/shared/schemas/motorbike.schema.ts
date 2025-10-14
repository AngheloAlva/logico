import { z } from "zod"

export const motorbikeSchema = z.object({
	brand: z.string().min(2, "La marca debe tener al menos 2 caracteres"),
	model: z.string().min(2, "El modelo debe tener al menos 2 caracteres"),
	plate: z.string().min(6, "La patente debe tener al menos 6 caracteres"),
	class: z.string().min(2, "La clase debe tener al menos 2 caracteres"),
	color: z.string().min(3, "El color debe tener al menos 3 caracteres"),
	cylinders: z.number().int().positive("Los cilindros deben ser un número positivo"),
	year: z.number().int().min(1900).max(new Date().getFullYear() + 1, "Año inválido"),
	mileage: z.number().int().min(0, "El kilometraje no puede ser negativo"),
	driverId: z.string().uuid("ID de motorista inválido").optional().nullable(),
})

export type MotorbikeInput = z.infer<typeof motorbikeSchema>
