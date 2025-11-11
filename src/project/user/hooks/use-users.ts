"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getUsers } from "../actions/get-users"
import { getUserById } from "../actions/get-user-by-id"
import { updateUser } from "../actions/update-user"
import { deleteUser } from "../actions/delete-user"
import { banUser } from "../actions/ban-user"
import { unbanUser } from "../actions/unban-user"
type UserUpdateInput = { name?: string; role?: string }

// Query Keys
export const userKeys = {
	all: ["users"] as const,
	lists: () => [...userKeys.all, "list"] as const,
	list: (params?: { page?: number; pageSize?: number; search?: string }) =>
		[...userKeys.lists(), params] as const,
	details: () => [...userKeys.all, "detail"] as const,
	detail: (id: string) => [...userKeys.details(), id] as const,
}

// Hook para obtener lista de usuarios con paginación
export function useUsers(params?: { page?: number; pageSize?: number; search?: string }) {
	return useQuery({
		queryKey: userKeys.list(params),
		queryFn: () => getUsers(params),
	})
}

// Hook para obtener un usuario por ID
export function useUser(id: string) {
	return useQuery({
		queryKey: userKeys.detail(id),
		queryFn: () => getUserById(id),
		enabled: !!id,
	})
}

// Hook para actualizar usuario
export function useUpdateUser() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UserUpdateInput }) => updateUser(id, data),
		onSuccess: (result, variables) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: userKeys.lists() })
				queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) })
				toast.success("Usuario actualizado exitosamente")
			} else {
				toast.error(result.error || "Error al actualizar usuario")
			}
		},
		onError: () => {
			toast.error("Error al actualizar usuario")
		},
	})
}

// Hook para eliminar usuario
export function useDeleteUser() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => deleteUser(id),
		onSuccess: (result) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: userKeys.lists() })
				toast.success("Usuario eliminado exitosamente")
			} else {
				toast.error(result.error || "Error al eliminar usuario")
			}
		},
		onError: () => {
			toast.error("Error al eliminar usuario")
		},
	})
}

// Hook para banear usuario
export function useBanUser() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, reason, expiresAt }: { id: string; reason: string; expiresAt?: Date }) =>
			banUser(id, reason, expiresAt),
		onSuccess: (result, variables) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: userKeys.lists() })
				queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) })
				toast.success("Usuario baneado exitosamente")
			} else {
				toast.error(result.error || "Error al banear usuario")
			}
		},
		onError: () => {
			toast.error("Error al banear usuario")
		},
	})
}

// Hook para desbanear usuario
export function useUnbanUser() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => unbanUser(id),
		onSuccess: (result, id) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: userKeys.lists() })
				queryClient.invalidateQueries({ queryKey: userKeys.detail(id) })
				toast.success("Usuario desbaneado exitosamente")
			} else {
				toast.error(result.error || "Error al desbanear usuario")
			}
		},
		onError: () => {
			toast.error("Error al desbanear usuario")
		},
	})
}
