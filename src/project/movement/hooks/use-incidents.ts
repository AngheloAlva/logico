"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getIncidentsByMovement } from "../actions/incidents/get-incidents-by-movement"
import { createIncident } from "../actions/incidents/create-incident"
import { deleteIncident } from "../actions/incidents/delete-incident"
import type { IncidentInput } from "@/shared/schemas/movement.schema"

// Query Keys
export const incidentKeys = {
	all: ["incidents"] as const,
	byMovement: (movementId: string) => [...incidentKeys.all, "movement", movementId] as const,
}

// Hook para obtener incidentes de un movimiento
export function useIncidents(movementId: string) {
	return useQuery({
		queryKey: incidentKeys.byMovement(movementId),
		queryFn: () => getIncidentsByMovement(movementId),
		enabled: !!movementId,
	})
}

// Hook para crear incidente
export function useCreateIncident() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ data, userId }: { data: IncidentInput; userId: string }) =>
			createIncident(data, userId),
		onSuccess: (result, variables) => {
			if (result.success) {
				queryClient.invalidateQueries({
					queryKey: incidentKeys.byMovement(variables.data.movementId),
				})
				// También invalidar el movimiento para actualizar su estado
				queryClient.invalidateQueries({
					queryKey: ["movements", "detail", variables.data.movementId],
				})
				toast.success("Incidente registrado exitosamente")
			} else {
				toast.error(result.error || "Error al registrar incidente")
			}
		},
		onError: () => {
			toast.error("Error al registrar incidente")
		},
	})
}

// Hook para eliminar incidente
export function useDeleteIncident() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id }: { id: string; movementId: string }) => deleteIncident(id),
		onSuccess: (result, variables) => {
			if (result.success) {
				queryClient.invalidateQueries({
					queryKey: incidentKeys.byMovement(variables.movementId),
				})
				queryClient.invalidateQueries({
					queryKey: ["movements", "detail", variables.movementId],
				})
				toast.success("Incidente eliminado exitosamente")
			} else {
				toast.error(result.error || "Error al eliminar incidente")
			}
		},
		onError: () => {
			toast.error("Error al eliminar incidente")
		},
	})
}
