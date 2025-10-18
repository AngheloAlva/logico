"use client"

import { AlertCircle, ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

import { Alert, AlertDescription } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
	Card,
	CardTitle,
	CardHeader,
	CardContent,
	CardDescription,
} from "@/shared/components/ui/card"

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("")
	const [error, setError] = useState("")
	const [success, setSuccess] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")
		setIsLoading(true)

		try {
			// TODO: Implement forgot password logic with better-auth
			await new Promise((resolve) => setTimeout(resolve, 1000))
			setSuccess(true)
		} catch (err) {
			setError((err as string) || "Error al enviar el correo")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 p-4">
			<Card className="w-full max-w-md shadow-xl">
				<CardHeader className="space-y-3">
					<CardTitle className="text-2xl font-bold text-green-800">Recuperar Contraseña</CardTitle>
					<CardDescription>
						Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
					</CardDescription>
				</CardHeader>
				<CardContent>
					{!success ? (
						<form onSubmit={handleSubmit} className="space-y-4">
							{error && (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							<div className="space-y-2">
								<Label htmlFor="email">Correo electrónico</Label>
								<Input
									id="email"
									type="email"
									placeholder="usuario@ejemplo.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									disabled={isLoading}
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<Button
								type="submit"
								className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Enviando...
									</>
								) : (
									"Enviar enlace"
								)}
							</Button>

							<div className="text-center">
								<Link
									href="/login"
									className="inline-flex items-center text-sm text-green-600 hover:text-green-700 hover:underline"
								>
									<ArrowLeft className="mr-1 h-4 w-4" />
									Volver al inicio de sesión
								</Link>
							</div>
						</form>
					) : (
						<div className="space-y-4 text-center">
							<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
								<CheckCircle className="h-10 w-10 text-green-600" />
							</div>
							<div className="space-y-2">
								<h3 className="text-lg font-semibold text-green-800">¡Correo enviado!</h3>
								<p className="text-muted-foreground text-sm">
									Revisa tu bandeja de entrada en <strong>{email}</strong> y sigue las instrucciones
									para restablecer tu contraseña.
								</p>
							</div>
							<Link href="/login">
								<Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
									Volver al inicio de sesión
								</Button>
							</Link>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
