"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createCity } from "../actions/city/create-city"
import { updateCity } from "../actions/city/update-city"
import { deleteCity } from "../actions/city/delete-city"
import type { CityInput } from "@/shared/schemas/region.schema"

// Hook para crear ciudad
export function useCreateCity() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: CityInput) => createCity(data),
		onSuccess: (result, variables) => {
			if (result.success) {
				// Invalidar la región para actualizar la lista de ciudades
				queryClient.invalidateQueries({ queryKey: ["regions", "detail", variables.regionId] })
				queryClient.invalidateQueries({ queryKey: ["regions", "list"] })
				toast.success("Ciudad creada exitosamente")
			} else {
				toast.error(result.error || "Error al crear ciudad")
			}
		},
		onError: () => {
			toast.error("Error al crear ciudad")
		},
	})
}

// Hook para actualizar ciudad
export function useUpdateCity() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: CityInput }) => updateCity(id, data),
		onSuccess: (result, variables) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: ["regions", "detail", variables.data.regionId] })
				queryClient.invalidateQueries({ queryKey: ["regions", "list"] })
				toast.success("Ciudad actualizada exitosamente")
			} else {
				toast.error(result.error || "Error al actualizar ciudad")
			}
		},
		onError: () => {
			toast.error("Error al actualizar ciudad")
		},
	})
}

// Hook para eliminar ciudad
export function useDeleteCity() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id }: { id: string }) => deleteCity(id),
		onSuccess: (result) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: ["regions", "detail"] })
				queryClient.invalidateQueries({ queryKey: ["regions", "list"] })
				toast.success("Ciudad eliminada exitosamente")
			} else {
				toast.error(result.error || "Error al eliminar ciudad")
			}
		},
		onError: () => {
			toast.error("Error al eliminar ciudad")
		},
	})
}
