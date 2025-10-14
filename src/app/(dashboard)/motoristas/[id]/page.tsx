"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import { getDriverById, updateDriver, deleteDriver } from "../actions/drivers-actions"
import { toast } from "sonner"

export default function EditarMotoristaPage() {
	const params = useParams()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [loading, setLoading] = useState(true)
	const [formData, setFormData] = useState({
		name: "",
		rut: "",
		email: "",
		phone: "",
		address: "",
		active: true,
	})

	useEffect(() => {
		loadDriver()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.id])

	async function loadDriver() {
		setLoading(true)
		const result = await getDriverById(params.id as string)

		if (result.success && result.data) {
			const driver = result.data
			setFormData({
				name: driver.name,
				rut: driver.rut,
				email: driver.email,
				phone: driver.phone,
				address: driver.address || "",
				active: driver.active,
			})
		} else {
			toast.error(result.error || "Error al cargar motorista")
			router.push("/motoristas")
		}

		setLoading(false)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		const result = await updateDriver(params.id as string, formData)

		if (result.success) {
			toast.success("Motorista actualizado exitosamente")
			router.push("/motoristas")
		} else {
			toast.error(result.error || "Error al actualizar motorista")
		}

		setIsLoading(false)
	}

	const handleDelete = async () => {
		if (!confirm(`¿Estás seguro de eliminar "${formData.name}"?`)) return

		const result = await deleteDriver(params.id as string)
		if (result.success) {
			toast.success("Motorista eliminado exitosamente")
			router.push("/motoristas")
		} else {
			toast.error(result.error || "Error al eliminar motorista")
		}
	}

	if (loading) {
		return <div className="py-10 text-center">Cargando motorista...</div>
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Link href="/motoristas">
						<Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Volver
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-green-800">Editar Motorista</h1>
						<p className="text-muted-foreground">Actualiza la información del motorista</p>
					</div>
				</div>
				<Button
					variant="destructive"
					onClick={handleDelete}
					className="bg-red-600 hover:bg-red-700"
				>
					<Trash2 className="mr-2 h-4 w-4" />
					Eliminar Motorista
				</Button>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<Card className="">
					<CardHeader>
						<CardTitle className="text-green-800">Información Personal</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="name">Nombre Completo *</Label>
								<Input
									id="name"
									placeholder="Ej: Juan Pérez González"
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="rut">RUT *</Label>
								<Input
									id="rut"
									placeholder="Ej: 12.345.678-9"
									value={formData.rut}
									onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Correo Electrónico *</Label>
								<Input
									id="email"
									type="email"
									placeholder="Ej: jperez@ejemplo.cl"
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="phone">Teléfono *</Label>
								<Input
									id="phone"
									placeholder="Ej: +56 9 1234 5678"
									value={formData.phone}
									onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2 md:col-span-2">
								<Label htmlFor="address">Dirección</Label>
								<Input
									id="address"
									placeholder="Ej: Av. Libertador 1234, Depto 501"
									value={formData.address}
									onChange={(e) => setFormData({ ...formData, address: e.target.value })}
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="">
					<CardHeader>
						<CardTitle className="text-green-800">Estado</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="active">Motorista Activo</Label>
								<p className="text-muted-foreground text-sm">
									Habilita o deshabilita al motorista para asignación de pedidos
								</p>
							</div>
							<Switch
								id="active"
								checked={formData.active}
								onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
							/>
						</div>
					</CardContent>
				</Card>

				<div className="flex justify-end gap-4">
					<Link href="/motoristas">
						<Button variant="outline" type="button">
							Cancelar
						</Button>
					</Link>
					<Button
						type="submit"
						disabled={isLoading}
						className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
					>
						<Save className="mr-2 h-4 w-4" />
						{isLoading ? "Guardando..." : "Guardar Cambios"}
					</Button>
				</div>
			</form>
		</div>
	)
}
