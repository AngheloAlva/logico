"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save, Trash2, Plus, X } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import Link from "next/link"

import { getDriverById } from "@/project/driver/actions/get-driver-by-id"
import { updateDriver } from "@/project/driver/actions/update-driver"
import { deleteDriver } from "@/project/driver/actions/delete-driver"
import { getRegions } from "@/project/region/actions/get-regions"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Switch } from "@/shared/components/ui/switch"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
	Select,
	SelectItem,
	SelectValue,
	SelectTrigger,
	SelectContent,
} from "@/shared/components/ui/select"

import type { City, Province } from "@/generated/prisma"

type ProvinceWithCities = Province & { cities: City[] }

type EmergencyContact = {
	relationship: string
	phone: string
}

export default function EditarMotoristaPage() {
	const params = useParams()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [loading, setLoading] = useState(true)
	const [regions, setRegions] = useState<Awaited<ReturnType<typeof getRegions>>["data"]>([])
	const [provinces, setProvinces] = useState<ProvinceWithCities[]>([])
	const [cities, setCities] = useState<City[]>([])
	const [formData, setFormData] = useState({
		code: "",
		firstName: "",
		paternalLastName: "",
		maternalLastName: "",
		rut: "",
		passport: "",
		birthDate: "",
		address: "",
		email: "",
		phone: "",
		hasPersonalMotorbike: false,
		licenseFileUrl: "",
		licenseLastCheckDate: "",
		licenseExpiryDate: "",
		regionId: "",
		provinceId: "",
		cityId: "",
		active: true,
	})
	const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
		{ relationship: "", phone: "" },
	])

	useEffect(() => {
		loadData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.id])

	useEffect(() => {
		if (formData.regionId) {
			const region = regions?.find((r) => r.id === formData.regionId)
			setProvinces(region?.provinces || [])
		}
	}, [formData.regionId, regions])

	useEffect(() => {
		if (formData.provinceId) {
			const province = provinces?.find((p) => p.id === formData.provinceId)
			setCities(province?.cities || [])
		}
	}, [formData.provinceId, provinces])

	async function loadData() {
		setLoading(true)

		const [driverResult, regionsResult] = await Promise.all([
			getDriverById(params.id as string),
			getRegions(),
		])

		if (regionsResult.success && regionsResult.data) {
			setRegions(regionsResult.data)
		}

		if (driverResult.success && driverResult.data) {
			const driver = driverResult.data
			setFormData({
				code: driver.code,
				firstName: driver.firstName,
				paternalLastName: driver.paternalLastName,
				maternalLastName: driver.maternalLastName,
				rut: driver.rut,
				passport: driver.passport || "",
				birthDate: driver.birthDate ? new Date(driver.birthDate).toISOString().split("T")[0] : "",
				address: driver.address || "",
				email: driver.email,
				phone: driver.phone,
				hasPersonalMotorbike: driver.hasPersonalMotorbike,
				licenseFileUrl: driver.licenseFileUrl || "",
				licenseLastCheckDate: driver.licenseLastCheckDate
					? new Date(driver.licenseLastCheckDate).toISOString().split("T")[0]
					: "",
				licenseExpiryDate: driver.licenseExpiryDate
					? new Date(driver.licenseExpiryDate).toISOString().split("T")[0]
					: "",
				regionId: driver.regionId,
				provinceId: driver.provinceId,
				cityId: driver.cityId,
				active: driver.active,
			})

			if (driver.emergencyContacts && driver.emergencyContacts.length > 0) {
				setEmergencyContacts(
					driver.emergencyContacts.map((contact) => ({
						relationship: contact.relationship,
						phone: contact.phone,
					}))
				)
			}

			// Set provinces and cities based on the region and province
			const region = regionsResult.data?.find((r) => r.id === driver.regionId)
			if (region) {
				setProvinces(region.provinces || [])
				const province = region.provinces?.find((p) => p.id === driver.provinceId)
				if (province) {
					setCities(province.cities || [])
				}
			}
		} else {
			toast.error(driverResult.error || "Error al cargar motorista")
			router.push("/motoristas")
		}

		setLoading(false)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		const data = {
			code: formData.code,
			firstName: formData.firstName,
			paternalLastName: formData.paternalLastName,
			maternalLastName: formData.maternalLastName,
			rut: formData.rut,
			passport: formData.passport || undefined,
			birthDate: new Date(formData.birthDate),
			address: formData.address,
			email: formData.email,
			phone: formData.phone,
			hasPersonalMotorbike: formData.hasPersonalMotorbike,
			licenseFileUrl: formData.licenseFileUrl || null,
			licenseLastCheckDate: formData.licenseLastCheckDate
				? new Date(formData.licenseLastCheckDate)
				: null,
			licenseExpiryDate: formData.licenseExpiryDate ? new Date(formData.licenseExpiryDate) : null,
			regionId: formData.regionId,
			provinceId: formData.provinceId,
			cityId: formData.cityId,
			emergencyContacts: emergencyContacts.filter(
				(contact) => contact.relationship && contact.phone
			),
			active: formData.active,
		}

		const result = await updateDriver(params.id as string, data)

		if (result.success) {
			toast.success("Motorista actualizado exitosamente")
			router.push("/motoristas")
		} else {
			toast.error(result.error || "Error al actualizar motorista")
		}

		setIsLoading(false)
	}

	const handleDelete = async () => {
		if (!confirm(`¿Estás seguro de eliminar "${formData.firstName} ${formData.paternalLastName}"?`))
			return

		const result = await deleteDriver(params.id as string)
		if (result.success) {
			toast.success("Motorista eliminado exitosamente")
			router.push("/motoristas")
		} else {
			toast.error(result.error || "Error al eliminar motorista")
		}
	}

	const addEmergencyContact = () => {
		setEmergencyContacts([...emergencyContacts, { relationship: "", phone: "" }])
	}

	const removeEmergencyContact = (index: number) => {
		setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index))
	}

	const updateEmergencyContact = (
		index: number,
		field: "relationship" | "phone",
		value: string
	) => {
		const newContacts = [...emergencyContacts]
		newContacts[index][field] = value
		setEmergencyContacts(newContacts)
	}

	if (loading) {
		return <div className="py-10 text-center">Cargando motorista...</div>
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Link href="/motoristas">
						<Button variant="outline" size="icon" className="text-green-600 hover:bg-green-50">
							<ArrowLeft className="h-4 w-4" />
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
					<Trash2 className="h-4 w-4" />
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
								<Label htmlFor="code">Código *</Label>
								<Input
									id="code"
									placeholder="Ej: MOT001"
									value={formData.code}
									onChange={(e) => setFormData({ ...formData, code: e.target.value })}
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
								<Label htmlFor="firstName">Nombre *</Label>
								<Input
									id="firstName"
									placeholder="Ej: Juan"
									value={formData.firstName}
									onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="paternalLastName">Apellido Paterno *</Label>
								<Input
									id="paternalLastName"
									placeholder="Ej: Pérez"
									value={formData.paternalLastName}
									onChange={(e) => setFormData({ ...formData, paternalLastName: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="maternalLastName">Apellido Materno *</Label>
								<Input
									id="maternalLastName"
									placeholder="Ej: González"
									value={formData.maternalLastName}
									onChange={(e) => setFormData({ ...formData, maternalLastName: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="passport">Pasaporte</Label>
								<Input
									id="passport"
									placeholder="Ej: AB123456"
									value={formData.passport}
									onChange={(e) => setFormData({ ...formData, passport: e.target.value })}
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="birthDate">Fecha de Nacimiento *</Label>
								<Input
									id="birthDate"
									type="date"
									value={formData.birthDate}
									onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
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
								<Label htmlFor="address">Dirección *</Label>
								<Input
									id="address"
									placeholder="Ej: Av. Libertador 1234, Depto 501"
									value={formData.address}
									onChange={(e) => setFormData({ ...formData, address: e.target.value })}
									required
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="">
					<CardHeader>
						<CardTitle className="text-green-800">Ubicación</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-3">
							<div className="space-y-2">
								<Label htmlFor="region">Región *</Label>
								<Select
									value={formData.regionId}
									onValueChange={(value) =>
										setFormData({ ...formData, regionId: value, provinceId: "", cityId: "" })
									}
								>
									<SelectTrigger className="w-full focus:border-green-500 focus:ring-green-500">
										<SelectValue placeholder="Selecciona una región" />
									</SelectTrigger>
									<SelectContent>
										{regions?.map((region) => (
											<SelectItem key={region.id} value={region.id}>
												{region.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="province">Provincia *</Label>
								<Select
									value={formData.provinceId}
									onValueChange={(value) =>
										setFormData({ ...formData, provinceId: value, cityId: "" })
									}
									disabled={!formData.regionId}
								>
									<SelectTrigger className="w-full focus:border-green-500 focus:ring-green-500">
										<SelectValue placeholder="Selecciona una provincia" />
									</SelectTrigger>
									<SelectContent>
										{provinces.map((province) => (
											<SelectItem key={province.id} value={province.id}>
												{province.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="city">Ciudad *</Label>
								<Select
									value={formData.cityId}
									onValueChange={(value) => setFormData({ ...formData, cityId: value })}
									disabled={!formData.provinceId}
								>
									<SelectTrigger className="w-full focus:border-green-500 focus:ring-green-500">
										<SelectValue placeholder="Selecciona una ciudad" />
									</SelectTrigger>
									<SelectContent>
										{cities.map((city) => (
											<SelectItem key={city.id} value={city.id}>
												{city.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="">
					<CardHeader>
						<CardTitle className="text-green-800">Información de Licencia</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="licenseFileUrl">URL del Archivo de Licencia</Label>
								<Input
									id="licenseFileUrl"
									type="url"
									placeholder="https://ejemplo.com/licencia.pdf"
									value={formData.licenseFileUrl}
									onChange={(e) => setFormData({ ...formData, licenseFileUrl: e.target.value })}
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="licenseLastCheckDate">Última Revisión</Label>
								<Input
									id="licenseLastCheckDate"
									type="date"
									value={formData.licenseLastCheckDate}
									onChange={(e) =>
										setFormData({ ...formData, licenseLastCheckDate: e.target.value })
									}
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="licenseExpiryDate">Fecha de Vencimiento</Label>
								<Input
									id="licenseExpiryDate"
									type="date"
									value={formData.licenseExpiryDate}
									onChange={(e) => setFormData({ ...formData, licenseExpiryDate: e.target.value })}
									className="focus:border-green-500 focus:ring-green-500"
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="">
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle className="text-green-800">Contactos de Emergencia</CardTitle>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={addEmergencyContact}
							className="border-green-300 text-green-600 hover:bg-green-50"
						>
							<Plus className="h-4 w-4" />
							Agregar Contacto
						</Button>
					</CardHeader>
					<CardContent className="space-y-4">
						{emergencyContacts.map((contact, index) => (
							<div key={index} className="flex gap-4 rounded-lg border border-gray-200 p-4">
								<div className="flex-1 space-y-4">
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label>Parentesco *</Label>
											<Input
												placeholder="Ej: Padre, Hermano, etc."
												value={contact.relationship}
												onChange={(e) =>
													updateEmergencyContact(index, "relationship", e.target.value)
												}
												required
												className="focus:border-green-500 focus:ring-green-500"
											/>
										</div>
										<div className="space-y-2">
											<Label>Teléfono *</Label>
											<Input
												placeholder="Ej: +56 9 1234 5678"
												value={contact.phone}
												onChange={(e) => updateEmergencyContact(index, "phone", e.target.value)}
												required
												className="focus:border-green-500 focus:ring-green-500"
											/>
										</div>
									</div>
								</div>
								{emergencyContacts.length > 1 && (
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => removeEmergencyContact(index)}
										className="text-red-600 hover:bg-red-50"
									>
										<X className="h-4 w-4" />
									</Button>
								)}
							</div>
						))}
					</CardContent>
				</Card>

				<Card className="">
					<CardHeader>
						<CardTitle className="text-green-800">Configuración</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="hasPersonalMotorbike">Tiene Moto Propia</Label>
								<p className="text-muted-foreground text-sm">
									Indica si el motorista tiene su propia motocicleta
								</p>
							</div>
							<Switch
								id="hasPersonalMotorbike"
								checked={formData.hasPersonalMotorbike}
								onCheckedChange={(checked) =>
									setFormData({ ...formData, hasPersonalMotorbike: checked })
								}
							/>
						</div>

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
						<Save className="h-4 w-4" />
						{isLoading ? "Guardando..." : "Guardar Cambios"}
					</Button>
				</div>
			</form>
		</div>
	)
}
