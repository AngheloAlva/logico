"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

export default function NuevaRegionPage() {
	const router = useRouter()
	const [name, setName] = useState("")
	const [cities, setCities] = useState<string[]>([""])
	const [isLoading, setIsLoading] = useState(false)

	const addCity = () => {
		setCities([...cities, ""])
	}

	const removeCity = (index: number) => {
		setCities(cities.filter((_, i) => i !== index))
	}

	const updateCity = (index: number, value: string) => {
		const newCities = [...cities]
		newCities[index] = value
		setCities(newCities)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			// TODO: Implement API call to create region
			await new Promise((resolve) => setTimeout(resolve, 1000))
			router.push("/regiones")
		} catch (error) {
			console.error(error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Link href="/regiones">
					<Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Volver
					</Button>
				</Link>
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-green-800">Nueva Región</h1>
					<p className="text-muted-foreground">Crea una nueva región y sus ciudades asociadas</p>
				</div>
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
								value={name}
								onChange={(e) => setName(e.target.value)}
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
						{cities.map((city, index) => (
							<div key={index} className="flex gap-2">
								<div className="flex-1">
									<Input
										placeholder={`Ciudad ${index + 1}`}
										value={city}
										onChange={(e) => updateCity(index, e.target.value)}
										className="focus:border-green-500 focus:ring-green-500"
									/>
								</div>
								{cities.length > 1 && (
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => removeCity(index)}
										className="text-red-600 hover:bg-red-50"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								)}
							</div>
						))}
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
						{isLoading ? "Guardando..." : "Guardar Región"}
					</Button>
				</div>
			</form>
		</div>
	)
}
