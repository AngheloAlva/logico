"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getRegions } from "../actions/get-regions"
import { getRegionById } from "../actions/get-region-by-id"
import { createRegion } from "../actions/create-region"
import { updateRegion } from "../actions/update-region"
import { deleteRegion } from "../actions/delete-region"
import type { RegionInput } from "@/shared/schemas/region.schema"

// Query Keys
export const regionKeys = {
	all: ["regions"] as const,
	lists: () => [...regionKeys.all, "list"] as const,
	list: (params?: { page?: number; pageSize?: number; search?: string }) =>
		[...regionKeys.lists(), params] as const,
	details: () => [...regionKeys.all, "detail"] as const,
	detail: (id: string) => [...regionKeys.details(), id] as const,
}

// Hook para obtener lista de regiones con paginación
export function useRegions(params?: { page?: number; pageSize?: number; search?: string }) {
	return useQuery({
		queryKey: regionKeys.list(params),
		queryFn: () => getRegions(params),
	})
}

// Hook para obtener una región por ID
export function useRegion(id: string) {
	return useQuery({
		queryKey: regionKeys.detail(id),
		queryFn: () => getRegionById(id),
		enabled: !!id,
	})
}

// Hook para crear región
export function useCreateRegion() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: RegionInput) => createRegion(data),
		onSuccess: (result) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: regionKeys.lists() })
				toast.success("Región creada exitosamente")
			} else {
				toast.error(result.error || "Error al crear región")
			}
		},
		onError: () => {
			toast.error("Error al crear región")
		},
	})
}

// Hook para actualizar región
export function useUpdateRegion() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: RegionInput }) => updateRegion(id, data),
		onSuccess: (result, variables) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: regionKeys.lists() })
				queryClient.invalidateQueries({ queryKey: regionKeys.detail(variables.id) })
				toast.success("Región actualizada exitosamente")
			} else {
				toast.error(result.error || "Error al actualizar región")
			}
		},
		onError: () => {
			toast.error("Error al actualizar región")
		},
	})
}

// Hook para eliminar región
export function useDeleteRegion() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => deleteRegion(id),
		onSuccess: (result) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: regionKeys.lists() })
				toast.success("Región eliminada exitosamente")
			} else {
				toast.error(result.error || "Error al eliminar región")
			}
		},
		onError: () => {
			toast.error("Error al eliminar región")
		},
	})
}
