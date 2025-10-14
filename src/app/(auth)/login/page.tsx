"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card"
import { AlertCircle, Loader2, TruckIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/shared/components/ui/alert"

export default function LoginPage() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")
		setIsLoading(true)

		try {
			await authClient.signIn.email(
				{
					email,
					password,
				},
				{
					onSuccess: () => {
						router.push("/dashboard")
					},
					onError: () => {
						setError("Credenciales inválidas")
					},
				}
			)
		} catch (err) {
			setError((err as string) || "Credenciales inválidas")
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
					<form onSubmit={handleLogin} className="space-y-4">
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

						<div className="space-y-2">
							<Label htmlFor="password">Contraseña</Label>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
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
									Iniciando sesión...
								</>
							) : (
								"Iniciar Sesión"
							)}
						</Button>

						<div className="text-center">
							<a
								href="/forgot-password"
								className="text-sm text-green-600 hover:text-green-700 hover:underline"
							>
								¿Olvidaste tu contraseña?
							</a>
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
