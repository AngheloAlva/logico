"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getPharmacies } from "../actions/get-pharmacies"
import { getPharmacyById } from "../actions/get-pharmacy-by-id"
import { createPharmacy } from "../actions/create-pharmacy"
import { updatePharmacy } from "../actions/update-pharmacy"
import { deletePharmacy } from "../actions/delete-pharmacy"
import type { PharmacyInput } from "@/shared/schemas/pharmacy.schema"

// Query Keys
export const pharmacyKeys = {
	all: ["pharmacies"] as const,
	lists: () => [...pharmacyKeys.all, "list"] as const,
	list: (params?: { page?: number; pageSize?: number; search?: string }) =>
		[...pharmacyKeys.lists(), params] as const,
	details: () => [...pharmacyKeys.all, "detail"] as const,
	detail: (id: string) => [...pharmacyKeys.details(), id] as const,
}

// Hook para obtener lista de farmacias con paginación
export function usePharmacies(params?: { page?: number; pageSize?: number; search?: string }) {
	return useQuery({
		queryKey: pharmacyKeys.list(params),
		queryFn: () => getPharmacies(params),
	})
}

// Hook para obtener una farmacia por ID
export function usePharmacy(id: string) {
	return useQuery({
		queryKey: pharmacyKeys.detail(id),
		queryFn: () => getPharmacyById(id),
		enabled: !!id,
	})
}

// Hook para crear farmacia
export function useCreatePharmacy() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: PharmacyInput) => createPharmacy(data),
		onSuccess: (result) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: pharmacyKeys.lists() })
				toast.success("Farmacia creada exitosamente")
			} else {
				toast.error(result.error || "Error al crear farmacia")
			}
		},
		onError: () => {
			toast.error("Error al crear farmacia")
		},
	})
}

// Hook para actualizar farmacia
export function useUpdatePharmacy() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: PharmacyInput }) => updatePharmacy(id, data),
		onSuccess: (result, variables) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: pharmacyKeys.lists() })
				queryClient.invalidateQueries({ queryKey: pharmacyKeys.detail(variables.id) })
				toast.success("Farmacia actualizada exitosamente")
			} else {
				toast.error(result.error || "Error al actualizar farmacia")
			}
		},
		onError: () => {
			toast.error("Error al actualizar farmacia")
		},
	})
}

// Hook para eliminar farmacia
export function useDeletePharmacy() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => deletePharmacy(id),
		onSuccess: (result) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: pharmacyKeys.lists() })
				toast.success("Farmacia eliminada exitosamente")
			} else {
				toast.error(result.error || "Error al eliminar farmacia")
			}
		},
		onError: () => {
			toast.error("Error al eliminar farmacia")
		},
	})
}
