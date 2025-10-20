import z from "zod"

export const loginSchema = z.object({
	email: z.email({ error: "Email inválido" }),
	password: z.string().min(6, { error: "Contraseña inválida" }),
})

export type LoginSchema = z.infer<typeof loginSchema>
