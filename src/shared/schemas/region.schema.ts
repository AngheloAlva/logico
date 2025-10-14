import { z } from "zod"

export const regionSchema = z.object({
	name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
})

export const citySchema = z.object({
	name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
	regionId: z.string().uuid("ID de región inválido"),
})

export type RegionInput = z.infer<typeof regionSchema>
export type CityInput = z.infer<typeof citySchema>
