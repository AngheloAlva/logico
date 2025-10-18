"use client"

import { Save, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { createIncident } from "../actions/incidents/create-incident"

import { Card, CardContent } from "@/shared/components/ui/card"
import { Textarea } from "@/shared/components/ui/textarea"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select"

interface IncidentFormProps {
	movementId: string
	onClose: () => void
	onSuccess: () => void
}

const incidentTypes = [
	{ value: "direccion_erronea", label: "Dirección Errónea" },
	{ value: "cliente_no_encontrado", label: "Cliente No Encontrado" },
	{ value: "reintento", label: "Reintento" },
	{ value: "cobro_rechazado", label: "Cobro Rechazado" },
	{ value: "otro", label: "Otro" },
]

export function IncidentForm({ movementId, onClose, onSuccess }: IncidentFormProps) {
	const [isLoading, setIsLoading] = useState(false)
	const [formData, setFormData] = useState({
		type: "",
		description: "",
	})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		const result = await createIncident(
			{
				movementId,
				description: formData.description,
				type: formData.type as
					| "direccion_erronea"
					| "cliente_no_encontrado"
					| "reintento"
					| "cobro_rechazado"
					| "otro",
			},
			"current-user" // TODO: Get from session
		)

		if (result.success) {
			toast.success("Incidencia reportada exitosamente")
			onSuccess()
		} else {
			toast.error(result.error || "Error al reportar incidencia")
		}

		setIsLoading(false)
	}

	return (
		<Card className="border-orange-300 bg-orange-50/50">
			<CardContent className="pt-6">
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="type">Tipo de Incidencia *</Label>
						<Select
							value={formData.type}
							onValueChange={(value) => setFormData({ ...formData, type: value })}
						>
							<SelectTrigger className="border-orange-300 bg-white">
								<SelectValue placeholder="Selecciona el tipo de incidencia" />
							</SelectTrigger>
							<SelectContent>
								{incidentTypes.map((type) => (
									<SelectItem key={type.value} value={type.value}>
										{type.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Descripción *</Label>
						<Textarea
							id="description"
							placeholder="Describe en detalle la incidencia ocurrida..."
							value={formData.description}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							required
							rows={4}
							className="resize-none border-orange-300 bg-white"
						/>
					</div>

					<div className="flex justify-end gap-2">
						<Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
							<X className="mr-2 h-4 w-4" />
							Cancelar
						</Button>
						<Button
							type="submit"
							disabled={isLoading}
							className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
						>
							<Save className="mr-2 h-4 w-4" />
							{isLoading ? "Guardando..." : "Reportar Incidencia"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
