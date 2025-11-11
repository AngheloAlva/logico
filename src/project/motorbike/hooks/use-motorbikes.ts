"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getMotorbikes } from "../actions/get-motorbikes"
import { getMotorbikeById } from "../actions/get-motorbike-by-id"
import { getAvailableMotorbikes } from "../actions/get-available-motorbikes"
import { createMotorbike } from "../actions/create-motorbike"
import { updateMotorbike } from "../actions/update-motorbike"
import { deleteMotorbike } from "../actions/delete-motorbike"
import { assignMotorbike } from "../actions/assign-motorbike"
import type { MotorbikeInput } from "@/shared/schemas/motorbike.schema"

// Query Keys
export const motorbikeKeys = {
	all: ["motorbikes"] as const,
	lists: () => [...motorbikeKeys.all, "list"] as const,
	list: (params?: { page?: number; pageSize?: number; search?: string }) =>
		[...motorbikeKeys.lists(), params] as const,
	available: () => [...motorbikeKeys.all, "available"] as const,
	details: () => [...motorbikeKeys.all, "detail"] as const,
	detail: (id: string) => [...motorbikeKeys.details(), id] as const,
}

// Hook para obtener lista de motos con paginación
export function useMotorbikes(params?: { page?: number; pageSize?: number; search?: string }) {
	return useQuery({
		queryKey: motorbikeKeys.list(params),
		queryFn: () => getMotorbikes(params),
	})
}

// Hook para obtener motos disponibles
export function useAvailableMotorbikes() {
	return useQuery({
		queryKey: motorbikeKeys.available(),
		queryFn: () => getAvailableMotorbikes(),
	})
}

// Hook para obtener una moto por ID
export function useMotorbike(id: string) {
	return useQuery({
		queryKey: motorbikeKeys.detail(id),
		queryFn: () => getMotorbikeById(id),
		enabled: !!id,
	})
}

// Hook para crear moto
export function useCreateMotorbike() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: MotorbikeInput) => createMotorbike(data),
		onSuccess: (result) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: motorbikeKeys.lists() })
				queryClient.invalidateQueries({ queryKey: motorbikeKeys.available() })
				toast.success("Moto creada exitosamente")
			} else {
				toast.error(result.error || "Error al crear moto")
			}
		},
		onError: () => {
			toast.error("Error al crear moto")
		},
	})
}

// Hook para actualizar moto
export function useUpdateMotorbike() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: MotorbikeInput }) => updateMotorbike(id, data),
		onSuccess: (result, variables) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: motorbikeKeys.lists() })
				queryClient.invalidateQueries({ queryKey: motorbikeKeys.detail(variables.id) })
				queryClient.invalidateQueries({ queryKey: motorbikeKeys.available() })
				toast.success("Moto actualizada exitosamente")
			} else {
				toast.error(result.error || "Error al actualizar moto")
			}
		},
		onError: () => {
			toast.error("Error al actualizar moto")
		},
	})
}

// Hook para eliminar moto
export function useDeleteMotorbike() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => deleteMotorbike(id),
		onSuccess: (result) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: motorbikeKeys.lists() })
				queryClient.invalidateQueries({ queryKey: motorbikeKeys.available() })
				toast.success("Moto eliminada exitosamente")
			} else {
				toast.error(result.error || "Error al eliminar moto")
			}
		},
		onError: () => {
			toast.error("Error al eliminar moto")
		},
	})
}

// Hook para asignar moto a motorista
export function useAssignMotorbike() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ motorbikeId, driverId }: { motorbikeId: string; driverId: string }) =>
			assignMotorbike(motorbikeId, driverId),
		onSuccess: (result, variables) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: motorbikeKeys.lists() })
				queryClient.invalidateQueries({ queryKey: motorbikeKeys.detail(variables.motorbikeId) })
				queryClient.invalidateQueries({ queryKey: motorbikeKeys.available() })
				// También invalidar queries de drivers
				queryClient.invalidateQueries({ queryKey: ["drivers"] })
				toast.success("Moto asignada exitosamente")
			} else {
				toast.error(result.error || "Error al asignar moto")
			}
		},
		onError: () => {
			toast.error("Error al asignar moto")
		},
	})
}
