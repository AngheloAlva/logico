"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getDrivers } from "../actions/get-drivers"
import { getDriverById } from "../actions/get-driver-by-id"
import { getAvailableDrivers } from "../actions/get-available-drivers"
import { createDriver } from "../actions/create-driver"
import { updateDriver } from "../actions/update-driver"
import { deleteDriver } from "../actions/delete-driver"
import { toggleDriverStatus } from "../actions/toggle-driver-status"
import type { DriverInput } from "@/shared/schemas/driver.schema"

// Query Keys
export const driverKeys = {
	all: ["drivers"] as const,
	lists: () => [...driverKeys.all, "list"] as const,
	list: (params?: { page?: number; pageSize?: number; search?: string }) =>
		[...driverKeys.lists(), params] as const,
	available: () => [...driverKeys.all, "available"] as const,
	details: () => [...driverKeys.all, "detail"] as const,
	detail: (id: string) => [...driverKeys.details(), id] as const,
}

// Hook para obtener lista de motoristas con paginación
export function useDrivers(params?: { page?: number; pageSize?: number; search?: string }) {
	return useQuery({
		queryKey: driverKeys.list(params),
		queryFn: () => getDrivers(params),
	})
}

// Hook para obtener motoristas disponibles
export function useAvailableDrivers() {
	return useQuery({
		queryKey: driverKeys.available(),
		queryFn: () => getAvailableDrivers(),
	})
}

// Hook para obtener un motorista por ID
export function useDriver(id: string) {
	return useQuery({
		queryKey: driverKeys.detail(id),
		queryFn: () => getDriverById(id),
		enabled: !!id,
	})
}

// Hook para crear motorista
export function useCreateDriver() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: DriverInput) => createDriver(data),
		onSuccess: (result) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: driverKeys.lists() })
				queryClient.invalidateQueries({ queryKey: driverKeys.available() })
				toast.success("Motorista creado exitosamente")
			} else {
				toast.error(result.error || "Error al crear motorista")
			}
		},
		onError: () => {
			toast.error("Error al crear motorista")
		},
	})
}

// Hook para actualizar motorista
export function useUpdateDriver() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: DriverInput }) => updateDriver(id, data),
		onSuccess: (result, variables) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: driverKeys.lists() })
				queryClient.invalidateQueries({ queryKey: driverKeys.detail(variables.id) })
				queryClient.invalidateQueries({ queryKey: driverKeys.available() })
				toast.success("Motorista actualizado exitosamente")
			} else {
				toast.error(result.error || "Error al actualizar motorista")
			}
		},
		onError: () => {
			toast.error("Error al actualizar motorista")
		},
	})
}

// Hook para eliminar motorista
export function useDeleteDriver() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => deleteDriver(id),
		onSuccess: (result) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: driverKeys.lists() })
				queryClient.invalidateQueries({ queryKey: driverKeys.available() })
				toast.success("Motorista eliminado exitosamente")
			} else {
				toast.error(result.error || "Error al eliminar motorista")
			}
		},
		onError: () => {
			toast.error("Error al eliminar motorista")
		},
	})
}

// Hook para cambiar estado del motorista
export function useToggleDriverStatus() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => toggleDriverStatus(id),
		onSuccess: (result, id) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: driverKeys.lists() })
				queryClient.invalidateQueries({ queryKey: driverKeys.detail(id) })
				queryClient.invalidateQueries({ queryKey: driverKeys.available() })
				toast.success("Estado del motorista actualizado")
			} else {
				toast.error(result.error || "Error al actualizar estado")
			}
		},
		onError: () => {
			toast.error("Error al actualizar estado")
		},
	})
}
