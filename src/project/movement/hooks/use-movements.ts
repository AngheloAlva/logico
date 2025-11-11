"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getMovements } from "../actions/get-movements"
import { getMovementById } from "../actions/get-movement-by-id"
import { createMovement } from "../actions/create-movement"
import { updateMovement } from "../actions/update-movement"
import { deleteMovement } from "../actions/delete-movement"
import { updateMovementStatus } from "../actions/update-movement-status"
import { setDepartureDate } from "../actions/set-departure-date"
import { setDeliveryDate } from "../actions/set-delivery-date"
import type { MovementInput } from "@/shared/schemas/movement.schema"

// Query Keys
export const movementKeys = {
	all: ["movements"] as const,
	lists: () => [...movementKeys.all, "list"] as const,
	list: (params?: { page?: number; pageSize?: number; search?: string }) =>
		[...movementKeys.lists(), params] as const,
	details: () => [...movementKeys.all, "detail"] as const,
	detail: (id: string) => [...movementKeys.details(), id] as const,
}

// Hook para obtener lista de movimientos con paginación
export function useMovements(params?: { page?: number; pageSize?: number; search?: string }) {
	return useQuery({
		queryKey: movementKeys.list(params),
		queryFn: () => getMovements(params),
	})
}

// Hook para obtener un movimiento por ID
export function useMovement(id: string) {
	return useQuery({
		queryKey: movementKeys.detail(id),
		queryFn: () => getMovementById(id),
		enabled: !!id,
	})
}

// Hook para crear movimiento
export function useCreateMovement() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: MovementInput) => createMovement(data),
		onSuccess: (result) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: movementKeys.lists() })
				toast.success("Movimiento creado exitosamente")
			} else {
				toast.error(result.error || "Error al crear movimiento")
			}
		},
		onError: () => {
			toast.error("Error al crear movimiento")
		},
	})
}

// Hook para actualizar movimiento
export function useUpdateMovement() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: MovementInput }) => updateMovement(id, data),
		onSuccess: (result, variables) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: movementKeys.lists() })
				queryClient.invalidateQueries({ queryKey: movementKeys.detail(variables.id) })
				toast.success("Movimiento actualizado exitosamente")
			} else {
				toast.error(result.error || "Error al actualizar movimiento")
			}
		},
		onError: () => {
			toast.error("Error al actualizar movimiento")
		},
	})
}

// Hook para eliminar movimiento
export function useDeleteMovement() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => deleteMovement(id),
		onSuccess: (result) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: movementKeys.lists() })
				toast.success("Movimiento eliminado exitosamente")
			} else {
				toast.error(result.error || "Error al eliminar movimiento")
			}
		},
		onError: () => {
			toast.error("Error al eliminar movimiento")
		},
	})
}

// Hook para actualizar estado del movimiento
export function useUpdateMovementStatus() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			id,
			status,
		}: {
			id: string
			status: "PENDING" | "IN_TRANSIT" | "DELIVERED" | "INCIDENT"
		}) => updateMovementStatus(id, status),
		onSuccess: (result, variables) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: movementKeys.lists() })
				queryClient.invalidateQueries({ queryKey: movementKeys.detail(variables.id) })
				toast.success("Estado actualizado exitosamente")
			} else {
				toast.error(result.error || "Error al actualizar estado")
			}
		},
		onError: () => {
			toast.error("Error al actualizar estado")
		},
	})
}

// Hook para establecer fecha de salida
export function useSetDepartureDate() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => setDepartureDate(id),
		onSuccess: (result, id) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: movementKeys.lists() })
				queryClient.invalidateQueries({ queryKey: movementKeys.detail(id) })
				toast.success("Fecha de salida registrada")
			} else {
				toast.error(result.error || "Error al registrar fecha de salida")
			}
		},
		onError: () => {
			toast.error("Error al registrar fecha de salida")
		},
	})
}

// Hook para establecer fecha de entrega
export function useSetDeliveryDate() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => setDeliveryDate(id),
		onSuccess: (result, id) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: movementKeys.lists() })
				queryClient.invalidateQueries({ queryKey: movementKeys.detail(id) })
				toast.success("Fecha de entrega registrada")
			} else {
				toast.error(result.error || "Error al registrar fecha de entrega")
			}
		},
		onError: () => {
			toast.error("Error al registrar fecha de entrega")
		},
	})
}
