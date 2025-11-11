"use client"

import { ArrowLeft, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
	Select,
	SelectItem,
	SelectValue,
	SelectTrigger,
	SelectContent,
} from "@/shared/components/ui/select"

export default function NuevoUsuarioPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		role: "",
	})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (formData.password !== formData.confirmPassword) {
			alert("Las contraseñas no coinciden")
			return
		}

		setIsLoading(true)

		try {
			// TODO: Implement API call to create user
			await new Promise((resolve) => setTimeout(resolve, 1000))
			router.push("/usuarios")
		} catch (error) {
			console.error(error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Link href="/usuarios">
					<Button variant="outline" size="icon" className="text-green-600 hover:bg-green-50">
						<ArrowLeft className="h-4 w-4" />
					</Button>
				</Link>
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-green-800">Nuevo Usuario</h1>
					<p className="text-muted-foreground">Crea un nuevo usuario en el sistema</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<Card className="">
					<CardHeader>
						<CardTitle className="text-green-800">Información del Usuario</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="name">Nombre Completo *</Label>
								<Input
									id="name"
									placeholder="Ej: Juan Pérez"
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Correo Electrónico *</Label>
								<Input
									id="email"
									type="email"
									placeholder="Ej: usuario@logico.test"
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Contraseña *</Label>
								<Input
									id="password"
									type="password"
									placeholder="Mínimo 8 caracteres"
									value={formData.password}
									onChange={(e) => setFormData({ ...formData, password: e.target.value })}
									required
									minLength={8}
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
								<Input
									id="confirmPassword"
									type="password"
									placeholder="Repite la contraseña"
									value={formData.confirmPassword}
									onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
									required
									minLength={8}
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2 md:col-span-2">
								<Label htmlFor="role">Rol *</Label>
								<Select
									value={formData.role}
									onValueChange={(value) => setFormData({ ...formData, role: value })}
								>
									<SelectTrigger className="focus:border-green-500 focus:ring-green-500">
										<SelectValue placeholder="Selecciona un rol" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="admin">Administrador</SelectItem>
										<SelectItem value="operadora">Operadora</SelectItem>
										<SelectItem value="gerente">Gerente</SelectItem>
									</SelectContent>
								</Select>
								<p className="text-muted-foreground text-xs">
									<strong>Administrador:</strong> Acceso completo al sistema.
									<br />
									<strong>Operadora:</strong> Gestiona movimientos e incidencias.
									<br />
									<strong>Gerente:</strong> Visualiza reportes y métricas.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="flex justify-end gap-4">
					<Link href="/usuarios">
						<Button variant="outline" type="button">
							Cancelar
						</Button>
					</Link>
					<Button
						type="submit"
						disabled={isLoading}
						className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
					>
						<Save className="h-4 w-4" />
						{isLoading ? "Guardando..." : "Crear Usuario"}
					</Button>
				</div>
			</form>
		</div>
	)
}
