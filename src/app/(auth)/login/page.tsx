"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { redirect } from "next/navigation"
import { TruckIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"

import { loginSchema, type LoginSchema } from "@/project/auth/schemas/login.schema"
import { authClient } from "@/lib/auth-client"

import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/components/ui/field"
import { Spinner } from "@/shared/components/ui/spinner"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
	Card,
	CardTitle,
	CardFooter,
	CardHeader,
	CardContent,
	CardDescription,
} from "@/shared/components/ui/card"

export default function LoginPage() {
	const [isLoading, setIsLoading] = useState(false)

	const form = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	})

	const handleLogin = async (values: LoginSchema) => {
		setIsLoading(true)

		try {
			await authClient.signIn.email(
				{
					email: values.email,
					password: values.password,
				},
				{
					onSuccess: () => {
						redirect("/dashboard")
					},
					onError: (ctx) => {
						toast(ctx.error.message)
					},
				}
			)
		} catch (err) {
			toast((err as Error).message || "Credenciales inválidas")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 p-4">
			<Card className="w-full max-w-md shadow-xl">
				<CardHeader className="text-center">
					<div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
						<TruckIcon className="h-10 w-10 text-white" />
					</div>

					<CardTitle className="text-3xl font-bold text-green-800">LogiCo</CardTitle>
					<CardDescription className="text-base">
						Sistema de Distribución de Pedidos
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
						<FieldGroup>
							<Controller
								name="email"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="login-form-email">Correo Electrónico</FieldLabel>
										<Input
											{...field}
											id="login-form-email"
											aria-invalid={fieldState.invalid}
											placeholder="ejemplo@logico.cl"
											autoComplete="off"
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
							<Controller
								name="password"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="login-form-password">Contraseña</FieldLabel>
										<Input
											{...field}
											type="password"
											autoComplete="off"
											id="login-form-password"
											placeholder="Contraseña"
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
						</FieldGroup>

						<Button
							type="submit"
							className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<Spinner className="h-4 w-4" />
									Iniciando sesión...
								</>
							) : (
								"Iniciar Sesión"
							)}
						</Button>

						<div className="text-center">
							<Link
								href="/forgot-password"
								className="text-sm text-green-600 hover:text-green-700 hover:underline"
							>
								¿Olvidaste tu contraseña?
							</Link>
						</div>
					</form>
				</CardContent>

				<CardFooter className="flex flex-col items-center gap-2">
					<p className="text-center text-sm">Credenciales de prueba</p>
					<ul className="text-muted-foreground list-none text-sm">
						<li>admin@logico.test / Admin123!</li>
						<li>operadora@logico.test / User123!</li>
						<li>gerente@logico.test / User123!</li>
					</ul>
				</CardFooter>
			</Card>
		</div>
	)
}
