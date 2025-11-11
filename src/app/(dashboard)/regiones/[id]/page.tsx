"use client"

import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import Link from "next/link"

import { getRegionById } from "@/project/region/actions/get-region-by-id"
import { deleteCity } from "@/project/region/actions/city/delete-city"
import { createCity } from "@/project/region/actions/city/create-city"
import { updateCity } from "@/project/region/actions/city/update-city"
import { deleteRegion } from "@/project/region/actions/delete-region"
import { updateRegion } from "@/project/region/actions/update-region"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"

export default function EditarRegionPage() {
	const params = useParams()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [loading, setLoading] = useState(true)
	const [regionName, setRegionName] = useState("")
	const [cities, setCities] = useState<{ id: string; name: string; isNew?: boolean }[]>([])
	const [citiesToDelete, setCitiesToDelete] = useState<string[]>([])

	useEffect(() => {
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

		loadRegion()
	}, [params.id, router])

	const addCity = () => {
		setCities([...cities, { id: `new-${Date.now()}`, name: "", isNew: true }])
	}

	const removeCity = (index: number) => {
		const city = cities[index]

		if (!city.isNew) {
			setCitiesToDelete([...citiesToDelete, city.id])
		}

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
			const updateRegionResult = await updateRegion(params.id as string, {
				name: regionName,
			})

			if (!updateRegionResult.success) {
				toast.error(updateRegionResult.error || "Error al actualizar región")
				setIsLoading(false)
				return
			}

			for (const cityId of citiesToDelete) {
				await deleteCity(cityId)
			}

			for (const city of cities) {
				if (city.name.trim()) {
					if (city.isNew) {
						await createCity({
							name: city.name,
							regionId: params.id as string,
						})
					} else {
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
						<Button variant="outline" size="icon" className="text-green-600 hover:bg-green-50">
							<ArrowLeft className="h-4 w-4" />
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
					<Trash2 className="h-4 w-4" />
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
							<Plus className="h-4 w-4" />
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
						<Save className="h-4 w-4" />
						{isLoading ? "Guardando..." : "Guardar Cambios"}
					</Button>
				</div>
			</form>
		</div>
	)
}
