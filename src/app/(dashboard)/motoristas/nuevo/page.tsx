"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select"
import { Switch } from "@/shared/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { ArrowLeft, Save, Upload } from "lucide-react"
import Link from "next/link"

export default function NuevoMotoristaPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [formData, setFormData] = useState({
		name: "",
		rut: "",
		email: "",
		phone: "",
		address: "",
		regionId: "",
		cityId: "",
		active: true,
		licenseFile: null as File | null,
	})

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFormData({ ...formData, licenseFile: e.target.files[0] })
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			// TODO: Implement API call to create driver with file upload
			await new Promise((resolve) => setTimeout(resolve, 1000))
			router.push("/motoristas")
		} catch (error) {
			console.error(error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Link href="/motoristas">
					<Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Volver
					</Button>
				</Link>
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-green-800">Nuevo Motorista</h1>
					<p className="text-muted-foreground">Registra un nuevo motorista en el sistema</p>
				</div>
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

							<div className="space-y-2">
								<Label htmlFor="region">Región</Label>
								<Select
									value={formData.regionId}
									onValueChange={(value) => setFormData({ ...formData, regionId: value })}
								>
									<SelectTrigger className="focus:border-green-500 focus:ring-green-500">
										<SelectValue placeholder="Selecciona una región" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="1">Región Metropolitana</SelectItem>
										<SelectItem value="2">Valparaíso</SelectItem>
										<SelectItem value="3">Biobío</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="city">Ciudad</Label>
								<Select
									value={formData.cityId}
									onValueChange={(value) => setFormData({ ...formData, cityId: value })}
								>
									<SelectTrigger className="focus:border-green-500 focus:ring-green-500">
										<SelectValue placeholder="Selecciona una ciudad" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="1">Santiago</SelectItem>
										<SelectItem value="2">Providencia</SelectItem>
										<SelectItem value="3">Las Condes</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="">
					<CardHeader>
						<CardTitle className="text-green-800">Licencia de Conducir</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="license">Documento de Licencia</Label>
							<div className="flex items-center gap-4">
								<Input
									id="license"
									type="file"
									accept="image/*,.pdf"
									onChange={handleFileChange}
									className="focus:border-green-500 focus:ring-green-500"
								/>
								<Button type="button" variant="outline" size="sm">
									<Upload className="mr-2 h-4 w-4" />
									Subir
								</Button>
							</div>
							{formData.licenseFile && (
								<p className="text-muted-foreground text-sm">
									Archivo seleccionado: {formData.licenseFile.name}
								</p>
							)}
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
						{isLoading ? "Guardando..." : "Guardar Motorista"}
					</Button>
				</div>
			</form>
		</div>
	)
}
