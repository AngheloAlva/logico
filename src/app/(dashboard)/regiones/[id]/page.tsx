"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import {
	getRegionById,
	updateRegion,
	deleteRegion,
	createCity,
	updateCity,
	deleteCity,
} from "../actions/regions-actions"
import { toast } from "sonner"

export default function EditarRegionPage() {
	const params = useParams()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [loading, setLoading] = useState(true)
	const [regionName, setRegionName] = useState("")
	const [cities, setCities] = useState<{ id: string; name: string; isNew?: boolean }[]>([])
	const [citiesToDelete, setCitiesToDelete] = useState<string[]>([])

	useEffect(() => {
		loadRegion()
	}, [loadRegion, params.id])

	// eslint-disable-next-line react-hooks/exhaustive-deps
	async function loadRegion() {
		setLoading(true)
		const result = await getRegionById(params.id as string)

		if (result.success && result.data) {
			const region = result.data
			setRegionName(region.name)
			setCities(region.cities || [])
		} else {
			toast.error(result.error || "Error al cargar región")
			router.push("/regiones")
		}

		setLoading(false)
	}

	const addCity = () => {
		setCities([...cities, { id: `new-${Date.now()}`, name: "", isNew: true }])
	}

	const removeCity = (index: number) => {
		const city = cities[index]

		// Si la ciudad ya existe en BD, marcarla para eliminar
		if (!city.isNew) {
			setCitiesToDelete([...citiesToDelete, city.id])
		}

		// Remover de la lista actual
		setCities(cities.filter((_, i) => i !== index))
	}

	const updateCityName = (index: number, value: string) => {
		const newCities = [...cities]
		newCities[index] = { ...newCities[index], name: value }
		setCities(newCities)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			// 1. Actualizar nombre de la región
			const updateRegionResult = await updateRegion(params.id as string, {
				name: regionName,
			})

			if (!updateRegionResult.success) {
				toast.error(updateRegionResult.error || "Error al actualizar región")
				setIsLoading(false)
				return
			}

			// 2. Eliminar ciudades marcadas
			for (const cityId of citiesToDelete) {
				await deleteCity(cityId)
			}

			// 3. Crear nuevas ciudades y actualizar existentes
			for (const city of cities) {
				if (city.name.trim()) {
					if (city.isNew) {
						// Crear nueva ciudad
						await createCity({
							name: city.name,
							regionId: params.id as string,
						})
					} else {
						// Actualizar ciudad existente
						await updateCity(city.id, {
							name: city.name,
							regionId: params.id as string,
						})
					}
				}
			}

			toast.success("Región actualizada exitosamente")
			router.push("/regiones")
		} catch (error) {
			console.error(error)
			toast.error("Error al actualizar región")
		} finally {
			setIsLoading(false)
		}
	}

	const handleDelete = async () => {
		if (!confirm(`¿Estás seguro de eliminar la región "${regionName}"?`)) return

		const result = await deleteRegion(params.id as string)
		if (result.success) {
			toast.success("Región eliminada exitosamente")
			router.push("/regiones")
		} else {
			toast.error(result.error || "Error al eliminar región")
		}
	}

	if (loading) {
		return <div className="py-10 text-center">Cargando región...</div>
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Link href="/regiones">
						<Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Volver
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-green-800">Editar Región</h1>
						<p className="text-muted-foreground">Actualiza la región y sus ciudades asociadas</p>
					</div>
				</div>
				<Button
					variant="destructive"
					onClick={handleDelete}
					className="bg-red-600 hover:bg-red-700"
				>
					<Trash2 className="mr-2 h-4 w-4" />
					Eliminar Región
				</Button>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<Card className="">
					<CardHeader>
						<CardTitle className="text-green-800">Información de la Región</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Nombre de la Región *</Label>
							<Input
								id="name"
								placeholder="Ej: Región Metropolitana"
								value={regionName}
								onChange={(e) => setRegionName(e.target.value)}
								required
								className="focus:border-green-500 focus:ring-green-500"
							/>
						</div>
					</CardContent>
				</Card>

				<Card className="">
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle className="text-green-800">Ciudades</CardTitle>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={addCity}
							className="border-green-300 text-green-600 hover:bg-green-50"
						>
							<Plus className="mr-2 h-4 w-4" />
							Agregar Ciudad
						</Button>
					</CardHeader>
					<CardContent className="space-y-4">
						{cities.length === 0 ? (
							<p className="text-muted-foreground py-4 text-center text-sm">
								No hay ciudades. Agrega al menos una ciudad.
							</p>
						) : (
							cities.map((city, index) => (
								<div key={city.id} className="flex gap-2">
									<div className="flex-1">
										<Input
											placeholder={`Ciudad ${index + 1}`}
											value={city.name}
											onChange={(e) => updateCityName(index, e.target.value)}
											className="focus:border-green-500 focus:ring-green-500"
										/>
									</div>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => removeCity(index)}
										className="text-red-600 hover:bg-red-50"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							))
						)}
					</CardContent>
				</Card>

				<div className="flex justify-end gap-4">
					<Link href="/regiones">
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
